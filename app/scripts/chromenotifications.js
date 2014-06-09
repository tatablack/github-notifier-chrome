/*jshint unused:false */
/*global chrome */
var ChromeNotifications = (function() {
    'use strict';
    
    var getItems = function(commits) {
        var items = {};
        
        _.each(commits, function(commit) {
            if (!items[commit.repository.name]) {
                items[commit.repository.name] = [];
            }
            
            items[commit.repository.name].push(commit.author.name);
        });
        
        return _.map(items, function(value, key) {
            return {
                title: key,
                message: _.uniq(value).toString().replace(',', ', ')
            };
        });
    };
    
    var informUser = function(commits) {
        if (!commits.length) {
            return;
        }
    
        var items = [],
            repositories = [];
        
        _.each(commits, function(commit) {
            items.push(commit.author.name);
            repositories.push(commit.repository.name);
        });
        
        var notificationOptions = {
            type: 'list',
            iconUrl: 'images/icon-38.png',
            title: 'GitHub Notifier',
            message: '',
            contextMessage: 'You have ' + commits.length + ' new commits to review.',
            items: getItems(commits)
        };
        
        chrome.notifications.create('', notificationOptions, function(notificationId) {});
    };
    
    return {
        informUser: informUser
    };
})();
