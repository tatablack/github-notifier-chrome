/*jshint unused:false */
/*global ChromeStorage, ChromeBadge, ChromeNotifications */
var GitHubNotifications = (function() {
    'use strict';
    
    var loadFromServer = function() {
        Promise.all([
            ChromeStorage.read('username'),
            ChromeStorage.read('listener')]).
        then(function(results) {
            if (_.compact(results).length !== 2) {
                return;
            }

            $.ajax({
                url: results[1] + '/v1/notifications/' + results[0],
                success: function(response) {
                    var count = response.commits ? response.commits.length : 0;
                    console.log('github-notifier: %d commits retrieved', count);
    
                    ChromeBadge.setAppearance(response.commits.length);
                    ChromeNotifications.show(response.commits);
                    ChromeStorage.save({ commits: response.commits });
                },
                error: function(xhr) {
                    console.log('github-notifier: unable to retrieve notifications. Status: %s', xhr.status);
                }
            });
        });
    };

    return {
        loadFromServer: loadFromServer
    };
})();

