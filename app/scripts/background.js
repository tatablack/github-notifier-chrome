'use strict';

function getServers() {
    return [];
}

function retrieveNotifications(alarm) {
    if (alarm.name === 'retrieveNotifications') {
        console.log('About to retrieve notifications');
        
        _.each(getServers(), function(server) {
            uxhr(server.retrieveNotifications, {
                user: 'atata'
            }, {
                complete: function (response) {
                    console.log('notifications retrieved')
                }
            });
        });
    }
}

chrome.runtime.onStartup.addListener(function() {
});

chrome.runtime.onInstalled.addListener(function (details) {
    console.log('github-notifier: starting up');
    
    chrome.browserAction.setBadgeText({text: '...'});
    
    chrome.alarms.create('retrieveNotifications', {
        when: Date.now(),
        periodInMinutes: 2
    });
});

chrome.alarms.onAlarm.addListener(retrieveNotifications);
