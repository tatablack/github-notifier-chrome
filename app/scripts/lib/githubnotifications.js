/*jshint unused:false */
/*global $, _, console, ChromeStorage, ChromeBadge, ChromeNotifications */
var GitHubNotifications = (function() {
    'use strict';
    
    var loadFromServer = function() {
        ChromeStorage.read(['installation', 'listener']).then(
            function(result) {
                if (_.keys(result).length !== 2) {
                    return;
                }
                
                $.ajax({
                    url: result.listener + '/v1/notifications',
                    headers: {
                        'Authorization': 'GitHubListener installationId="' + result.installation.installationId + '"'
                    },
                    success: function(response) {
                        var count = response.commits ? response.commits.length : 0;
                        console.log('github-notifier: %d commits retrieved', count);
        
                        ChromeBadge.setAppearance(response.commits.length);
                        ChromeNotifications.show(response.commits);
                        ChromeStorage.append('commits', response.commits);
                    },
                    error: function(xhr) {
                        console.log('github-notifier: unable to retrieve notifications. Status: %s', xhr.status);
                    }
                });
            }
        );
    };

    return {
        loadFromServer: loadFromServer
    };
})();


