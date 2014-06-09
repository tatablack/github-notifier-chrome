/*jshint unused:false */
/*global chrome */
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
            case notificationCount === undefined:
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
        chrome.browserAction.setBadgeText({ text: '' + (notificationCount ? notificationCount : '*') });
        chrome.browserAction.setBadgeBackgroundColor(getBadgeBackgroundColor(notificationCount));        
    };
    
    var setAppearance = function(notificationCount) {
        setTitle(notificationCount);
        setBadge(notificationCount);
    };
    
    return {
        setAppearance: setAppearance
    };
})();
