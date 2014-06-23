/*jshint unused:false */
/*global _, chrome, ChromeStorage */
var ChromeBadge = (function() {
    'use strict';
    
    var COLOR_NONE = '#808080',
        COLOR_FEWER = '#d6e685',
        COLOR_FEW = '#8cc665',
        COLOR_SOME = '#44a340',
        COLOR_MANY = '#1e6823';
    
    var getBadgeBackgroundColor = function(notificationCount) {
        var badgeBackgroundColor;
        
        switch(true) {
            case !notificationCount:
                badgeBackgroundColor = COLOR_NONE;
                break;
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
    };
    
    var setTitle = function(notificationCount) {
        if (notificationCount) {
            chrome.browserAction.setTitle({ title: notificationCount + ' commits awaiting your attention' });
        } else {
            chrome.browserAction.setTitle({ title: '' });
        }
    };
    
    var setBadge = function(notificationCount) {
        chrome.browserAction.setBadgeText({ text: '' + (_.isNumber(notificationCount) ? notificationCount : '*') });
        chrome.browserAction.setBadgeBackgroundColor(getBadgeBackgroundColor(notificationCount));        
    };
    
    var getUpdatedNotificationCount = function(notificationCount, commits) {
        var newNotifications = _.isNumber(notificationCount),
            oldNotifications = !!(commits && commits.length),
            neverOldNotifications = !commits,
            updatedNotificationCount;

        switch(true) {
            // We have 0 or more incoming notifications, and old ones
            case (newNotifications && oldNotifications):
                updatedNotificationCount = notificationCount + commits.length;
                break;
            // We have 0 or more incoming notifications, but no old ones (0 or never stored)
            case (newNotifications && !oldNotifications):
                updatedNotificationCount = notificationCount;
                break;
            // We are just starting the application, and we never stored notifications
            case (!newNotifications && neverOldNotifications):
                updatedNotificationCount = notificationCount;
                break;
            // We are just starting the application, but we have old notifications
            case (!newNotifications && oldNotifications):
                updatedNotificationCount = commits.length;
                break;
            // We are just starting the application, and we have 0 old notifications
            case (!newNotifications && !oldNotifications):
                updatedNotificationCount = commits.length;
                break;
        }

        return updatedNotificationCount;
    };
    
    var setAppearance = function(notificationCount) {
        ChromeStorage.read('commits').then(function(result) {
            var updatedNotificationCount = getUpdatedNotificationCount(notificationCount, result.commits);
            
            setTitle(updatedNotificationCount);
            setBadge(updatedNotificationCount);
        });
    };
    
    return {
        setAppearance: setAppearance
    };
})();
