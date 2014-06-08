'use strict';

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

function retrieveNotifications(alarm) {
    if (alarm.name === 'retrieveNotifications') {
        console.log('github-notifier: about to retrieve notifications');
        
        Promise.all([getFromStorage('username'), getFromStorage('listener')]).then(function(results) {
            $.ajax({
                url: results[1] + '/notifications/' + results[0],
                success: function(response) {
                    console.log('github-notifier: notifications retrieved');
                    console.log(response);
                },
                error: function(xhr, type) {
                    console.log('github-notifier: unable to retrieve notifications. Status: %s', xhr.status);
                },
                complete: function() {
                }
            });
        })
    }
}

chrome.runtime.onStartup.addListener(function() {
});

chrome.runtime.onInstalled.addListener(function (details) {
    console.log('github-notifier: starting up');
    
    if (details.reason === 'update') {
        console.log('github-notifier: just updated from version %s to %s', details.previousVersion, chrome.app.getDetails().version);
    }
    chrome.browserAction.setBadgeText({text: '...'});
    
    chrome.alarms.create('retrieveNotifications', {
        when: Date.now(),
        periodInMinutes: 2
    });
});

chrome.alarms.onAlarm.addListener(retrieveNotifications);
