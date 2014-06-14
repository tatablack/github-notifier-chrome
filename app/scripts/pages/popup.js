/*jshint unused:false */
/*jshint sub:true */
/*global $, _, chrome, moment, ChromeStorage, ChromeBadge, ga, Analytics */
var Popup = (function() {
    'use strict';
    
    var MentionRegExp = /(?:[\s])@([A-Za-z0-9]+[A-Za-z0-9-]+)/g;
    
    var initLinks = function() {
        $('body').on('click', '.tag-clickable', function(evt) {
            Analytics.trackEvent('repo', 'click');
            chrome.tabs.create({ url: $(this).data('url') });
            evt.stopImmediatePropagation();
            return false;
        });
    
        $('body').on('click', 'a', function(evt) {
            if ($(this).attr('href')) {
                Analytics.trackEvent('commit', 'click');
                chrome.tabs.create({ url: $(this).attr('href') });
            }
            
            return false;
        });
    };
    
    var prepareCommits = function(commits) {
        _.each(commits, function(commit) {
            commit.readableTimestamp = moment(commit.timestamp).fromNow();
            commit.parsedMessage = commit.message.replace(MentionRegExp, '');
        });
    };
    
    var initAnalytics = function() {
        Analytics.init();
        Analytics.trackPage('Popup');
    };
    
    var initActions = function(className) {
        $('body').on('click', '.' + className, function(evt) {
            var listItem = $(this).closest('li');

            listItem.addClass(className + '-away');
            Analytics.trackEvent(className, 'click');

            ChromeStorage.removeFromArray('commits', 'id', listItem.data('commit-id'));
            ChromeStorage.increment('commits' + className.charAt(0).toUpperCase() + className.slice(1), 1);
            ChromeBadge.setAppearance($('.commit-thumbnail').length - 1);

            _.delay(function() {
                listItem.remove();
                $('.mainview').height($('.mainview').height() - 58);
            }, 900);

            evt.stopImmediatePropagation();
            return false;
        });
    };

    $(function() {
        initAnalytics();
        initActions('dismissed');
        initActions('reviewed');
        initLinks();
    
        ChromeStorage.read('commits').then(function(result) {
            prepareCommits(result.commits);
            
            $('.mainview').height((58 * result.commits.length) + 12);
            $('#notifications').html(_.templates['row']({ commits: result.commits }));
        });
    });    
})();
