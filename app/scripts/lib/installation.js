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
    
    var register = function(listener, installationId, options, callback) {
         $.ajax({
             url: listener + '/v1/users',
             type: 'POST',
             data: $.param(
                 _.merge(
                    { installationId: installationId }, options
                 )
             ),
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
    
    var update = function(listener, installationId, options, callback) {
         $.ajax({
             url: listener + '/v1/users/' + installationId,
             type: 'PUT',
             data: $.param(options),
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
        ChromeStorage.read(['installation', 'username', 'listener', 'authors']).then(
            function(result) {
                if (_.keys(_.pick(result, ['installation', 'username', 'listener'])).length !== 3) {
                    return;
                }
                
                if (result.installation.registered) {
                    update(result.listener, result.installation.installationId, _.pick(result, ['username', 'authors']), callback);
                } else {
                    // Currently, the Options panel does not allow to add authors before registration, so
                    // the _.pick() call in the next line is superfluous
                    register(result.listener, result.installation.installationId, _.pick(result, ['username', 'authors']), callback);
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
