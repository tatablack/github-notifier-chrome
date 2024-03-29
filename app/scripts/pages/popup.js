/*jshint unused:false */
/*jshint sub:true */
/*global self, $, _, chrome, Console, moment, ChromeStorage, ChromeBadge, ChromeOptions, ga, Analytics */
var Popup = (function() {
    'use strict';
    
    var MentionRegExp = /(?:[\s])@([A-Za-z0-9]+[A-Za-z0-9-]+)/g;
    
    var initLinks = function() {
        $('body').on('click', '.tag-clickable', function handleRepoClick(evt) {
            Analytics.trackEvent('repo', 'click');
            chrome.tabs.create({ url: $(this).data('url') });
            evt.stopImmediatePropagation();
            return false;
        });
    
        $('body').on('click', 'a', function handleRowClick(evt) {
            if ($(this).attr('href')) {
                Analytics.trackEvent('commit', 'click');
                chrome.tabs.create({ url: $(this).attr('href') });
            }
            
            return false;
        });
    };
    
    var prepareCommits = function(result) {
        _.each(result.commits, function(commit) {
            var defaultTimestamp = moment(commit.timestamp);
            
            // Display purposes
            commit.readableTimestamp = defaultTimestamp.fromNow();
            commit.extendedTimestamp = defaultTimestamp.format('dddd, MMMM DD YYYY, HH:mm:ss');

            // Sorting purposes
            commit.unixTimestamp = defaultTimestamp.unix();
            
            // Remove mentions from the message
            commit.parsedMessage = commit.message.replace(MentionRegExp, '');
            
            // Needed to highlight a review request
            commit.reviewRequired = _.contains(commit.mentions, result.username);
        });

        return _.sortBy(result.commits, 'unixTimestamp').reverse();
    };
    
    var initAnalytics = function() {
        Analytics.init();
        Analytics.trackPage('Popup');
    };

    var initActions = function(className) {
        $('body').on('click', '.' + className, function handleActionClick(evt) {
            var listItem = $(this).closest('li');

            listItem.addClass(className + '-away');
            Analytics.trackEvent(className, 'click');

            ChromeStorage.removeFromArray('commits', 'id', listItem.data('commit-id'), function updateStatsAndUI() {
                ChromeStorage.increment('commits' + className.charAt(0).toUpperCase() + className.slice(1), 1);
                ChromeBadge.setAppearance(0);
            });

            _.delay(function updatePopupUI() {
                listItem.remove();
                
                if ($('#notifications li').length) {
                    $('.mainview').height($('.mainview').height() - 58);                    
                } else {
                    $('#notifications').html(_.templates['row']({ commits: [] }));
                }
            }, 900);

            evt.stopImmediatePropagation();
            return false;
        });
    };

    var initButtons = function() {
        $('#options').on('click', function() {
            ChromeOptions.open();
        });

        $('#reload').on('click', function() {
            chrome.runtime.reload();
            self.close();
        });
    };

    $(function() {
        initAnalytics();
        initActions('dismissed');
        initActions('reviewed');
        initButtons();
        initLinks();
    
        ChromeStorage.read(['commits', 'username']).then(function initPopup(result) {
            var commits = prepareCommits(result);
            
            if (commits.length) {
                $('.mainview').height((59 * commits.length) + 12 + 40);
            } else {
                $('.mainview').height(48 + 40);
            }
            
            $('#notifications').html(_.templates['row']({ commits: commits }));
        });
    });    
})();
