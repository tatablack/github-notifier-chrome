'use strict';

var COLOR_FEWER = '#d6e685',
    COLOR_FEW = '#8cc665',
    COLOR_SOME = '#44a340',
    COLOR_MANY = '#1e6823';

function getBadgeBackgroundColor(notificationCount) {
    var badgeBackgroundColor;
    
    switch(true) {
        case notificationCount < 3:
            badgeBackgroundColor = COLOR_FEWER;
            break;
        case notificationCount < 5:
            badgeBackgroundColor = COLOR_FEW;
            break;
        case notificationCount < 9:
            badgeBackgroundColor = COLOR_SOME;
            break;
        default:
            badgeBackgroundColor = COLOR_MANY;
            break;
    }
    
    return { color: badgeBackgroundColor };
}


function getFromStorage(key) {
    return new Promise(function (resolve, reject) {
        chrome.storage.sync.get(key, function(result) {
            if (chrome.runtime.lastError) {
                reject(new Error(chrome.runtime.lastError));
            } else {
                resolve(result[key]);
            }
        });
    });
}

function saveToStorage(key, value) {
    var toStore = {};
    toStore[key] = value;
    
    chrome.storage.sync.set(toStore, function() {
        if (chrome.runtime.lastError) {
            console.error('github-notifier: unable to save %s. There was an error: %s', key, chrome.runtime.lastError.message);
        }
    });
}

function setTitle(count) {
    if (count) {
        chrome.browserAction.setTitle({ title: count + ' notifications awaiting your attention' });
    } else {
        chrome.browserAction.setTitle({ title: '' });
    }
}

function setBadge(count) {
    chrome.browserAction.setBadgeText({ text: '' + count });
    chrome.browserAction.setBadgeBackgroundColor(getBadgeBackgroundColor(count));
}

function retrieveNotifications() {
    Promise.all([getFromStorage('username'), getFromStorage('listener')]).then(function(results) {
        console.log('github-notifier: about to retrieve notifications');
        
        $.ajax({
            url: results[1] + '/notifications/' + results[0],
            success: function(response) {
                var count = response.commits ? response.commits.length : 0;
                console.log('github-notifier: %d commits retrieved', count);

                setTitle(response.commits.length);
                setBadge(response.commits.length);
                saveToStorage('commits', response.commits);
                ChromeNotifications.informUser(response.commits);
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

    chrome.browserAction.setBadgeText({text: '*'});
    
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
