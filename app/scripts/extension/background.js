/*jshint unused:false */
var Background = (function() {
    'use strict';
    
    // This is used for both alarms and messages
    var retrieveNotificationsTrigger = function(trigger) {
        if (trigger.name === 'retrieveNotifications') {
            GitHubNotifications.loadFromServer();
        }
    };

    // As soon as we create this alarm, we want to
    // retrieve notifications. And every 5 minutes after that.
    var createAlarm = function() {
        chrome.alarms.create('retrieveNotifications', {
            when: Date.now(),
            periodInMinutes: 5
        });
    };

    // We need to do things when:
    // - the extension is loaded
    // - a 5-minute alarm fires
    // - another part of the extension sends a message
    var initListeners = function() {
        chrome.runtime.onInstalled.addListener(function() {
            Console.info('github-notifier: starting up');
            ChromeBadge.setAppearance();
            Installation.ensureId();
            createAlarm();
        });

        chrome.alarms.onAlarm.addListener(retrieveNotificationsTrigger);
        chrome.runtime.onMessage.addListener(retrieveNotificationsTrigger);
    };

    // Let's make sure things start rolling
    initListeners();
})();
