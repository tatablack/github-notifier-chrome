'use strict';

function retrieveNotifications() {
    Promise.all([ChromeStorage.read('username'), ChromeStorage.read('listener')]).then(function(results) {
        console.log('github-notifier: about to retrieve notifications');
        
        $.ajax({
            url: results[1] + '/notifications/' + results[0],
            success: function(response) {
                var count = response.commits ? response.commits.length : 0;
                console.log('github-notifier: %d commits retrieved', count);

                ChromeBadge.setAppearance(response.commits.length);
                ChromeNotifications.informUser(response.commits);
                ChromeStorage.save({ commits: response.commits });
            },
            error: function(xhr) {
                console.log('github-notifier: unable to retrieve notifications. Status: %s', xhr.status);
            },
            complete: function() {
                console.log('github-notifier: ajax call finished');
            }
        });
    });
}

function retrieveNotificationsTrigger(alarm) {
    if (alarm.name === 'retrieveNotifications') {
        retrieveNotifications();
    }
}

chrome.runtime.onStartup.addListener(function() {
});

chrome.runtime.onInstalled.addListener(function (details) {
    console.log('github-notifier: starting up');
    
    if (details.reason === 'update') {
        console.log('github-notifier: just updated from version %s to %s', details.previousVersion, chrome.app.getDetails().version);
    }

    ChromeBadge.setAppearance();
    
    chrome.alarms.create('retrieveNotifications', {
        when: Date.now(),
        periodInMinutes: 5
    });
});

chrome.alarms.onAlarm.addListener(retrieveNotificationsTrigger);

chrome.runtime.onMessage.addListener(function(request) {
    if (request.command === 'retrieveNotifications') {
        retrieveNotifications();        
    }
});

chrome.storage.onChanged.addListener(function(changes, namespace) {
    _.forOwn(changes, function(value, key) {
        console.log('github-notifier: storage key "%s" changed. ' +
            'Old value was "%s", new value is "%s".',
            key,
            value.oldValue,
            value.newValue
        );
    });
});
