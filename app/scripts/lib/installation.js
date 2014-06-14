/*jshint unused:false */
/*global $, _, Console, chrome, ChromeStorage, uuid, Promise */
var Installation = (function() {
    'use strict';
    
    var ensureId = function() {
        ChromeStorage.read('installation').then(
            function(result) {
                if (_.keys(result).length === 0) {
                    var desiredId = uuid.v4();
                    
                    ChromeStorage.save({
                         installation: {
                             installationId: desiredId,
                             installationDate: Date.now(),
                             registered: false
                         }
                    }, function() {
                        if (chrome.runtime.lastError) {
                            Console.error('github-notifier: unable to save a new installation ID. Error reported: %s', chrome.runtime.lastError.message);
                        } else {
                            Console.info('github-notifier: new installation. Created installation id %s', desiredId);
                        }
                    });
                }
            },
            function(error) {
                Console.error('github-notifier: unable to look up an existing installation ID: ' + error);
            }
        );
    };
    
    var register = function(listener, installationId, username, callback) {
         $.ajax({
             url: listener + '/v1/users',
             type: 'POST',
             data: $.param({
                 installationId: installationId,
                 username: username
             }),
             success: function() {
                 ChromeStorage.save({ installation: { installationId: installationId, registered: true } });
                 Console.info('github-notifier: registered the current installation (%s) with %s', installationId, listener);
                 callback();
             },
             error: function(xhr) {
                 Console.error('github-notifier: unable to register the current installation. Status: %s', xhr.status);
             }
        });
    };
    
    var update = function(listener, installationId, username, callback) {
         $.ajax({
             url: listener + '/v1/users/' + installationId,
             type: 'PUT',
             data: $.param({
                 username: username
             }),
             success: function() {
                 Console.info('github-notifier: updated the current installation (%s) with %s', installationId, listener);
                 callback();
             },
             error: function(xhr) {
                 Console.error('github-notifier: unable to update the current installation. Status: %s', xhr.status);
             }
        });
    };
    
    var save = function(callback) {
        ChromeStorage.read(['installation', 'username', 'listener']).then(
            function(result) {
                if (_.keys(result).length !== 3) {
                    return;
                }
                
                if (result.installation.registered) {
                    update(result.listener, result.installation.installationId, result.username, callback);
                } else {
                    register(result.listener, result.installation.installationId, result.username, callback);
                }
            },
            function(error) {
                Console.error('github-notifier: unable to read from local storage: ' + error);
            }
        );        
    };
    
    return {
        ensureId: ensureId,
        save: save
    };
})();
