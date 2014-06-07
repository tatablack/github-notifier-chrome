'use strict';

function getServers() {
    return [];
}

function retrieveNotifications(alarm) {
    if (alarm.name === 'retrieveNotifications') {
        console.log('github-notifier: about to retrieve notifications');
        
        _.each(getServers(), function(server) {
//            uxhr(server.retrieveNotifications, {
//                user: 'atata'
//            }, {
//                complete: function (response) {
//                    console.log('github-notifier: notifications retrieved')
//                }
//            });
        });
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
