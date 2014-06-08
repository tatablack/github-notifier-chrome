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

function retrieveNotifications(alarm) {
    if (alarm.name === 'retrieveNotifications') {
        Promise.all([getFromStorage('username'), getFromStorage('listener')]).then(function(results) {
            console.log('github-notifier: about to retrieve notifications');
            
            $.ajax({
                url: results[1] + '/notifications/' + results[0],
                success: function(response) {
                    console.log('github-notifier: notifications retrieved');
                    console.log(response);
                    chrome.browserAction.setBadgeText({ text: '' + response.length });
                    chrome.browserAction.setBadgeBackgroundColor(getBadgeBackgroundColor(response.length));
                },
                error: function(xhr, type) {
                    console.log('github-notifier: unable to retrieve notifications. Status: %s', xhr.status);
                },
                complete: function() {
                    console.log('github-notifier: ajax call finished');
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

    chrome.browserAction.setBadgeText({text: '*'});
    
    chrome.alarms.create('retrieveNotifications', {
        when: Date.now(),
        periodInMinutes: 5
    });
});

chrome.alarms.onAlarm.addListener(retrieveNotifications);
