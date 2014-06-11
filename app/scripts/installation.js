/*jshint unused:false */
/*global ChromeStorage, uuid, Promise */
var Installation = (function() {
    'use strict';

    var installationId;
    
    var getId = function() {
        return installationId;
    };
    
    
    var ensureId = function() {
        ChromeStorage.read('installation').then(
            function(result) {
                if (_.keys(result).length === 1) {
                    installationId = result.installation.installationId;
                } else {
                    var desiredId = uuid.v4();
                    
                    ChromeStorage.save({ installation: { installationId: desiredId, registered: false } }, function() {
                        if (chrome.runtime.lastError) {
                            console.error('github-notifier: unable to save a new installation ID. Error reported: %s', chrome.runtime.lastError.message);
                        } else {
                            installationId = desiredId;                            
                        }
                    });
                }
            },
            function(error) {
                console.error('github-notifier: unable to look up an existing installation ID: ' + error);
            }
        );
    };
    
    var register = function(listener, installationId, username) {
         $.ajax({
             url: listener + '/v1/users',
             type: 'POST',
             data: $.param({
                 installationId: installationId,
                 username: username
             }),
             success: function() {
                 ChromeStorage.save({ installation: { installationId: installationId, registered: true } });
                 console.log('github-notifier: registered the current installation (%s) with %s', installationId, listener);
             },
             error: function(xhr) {
                 console.log('github-notifier: unable to register the current installation. Status: %s', xhr.status);
             }
        });
    };
    
    var update = function(listener, installationId, username) {
         $.ajax({
             url: listener + '/v1/users/' + installationId,
             type: 'PUT',
             data: $.param({
                 username: username
             }),
             success: function() {
                 console.log('github-notifier: updated the current installation (%s) with %s', installationId, listener);
             },
             error: function(xhr) {
                 console.log('github-notifier: unable top update the current installation. Status: %s', xhr.status);
             }
        });
    };
    
    var save = function() {
        ChromeStorage.read(['installation', 'username', 'listener']).then(
            function(result) {
                if (_.keys(result).length !== 3) {
                    return;
                }
                
                if (result.installation.registered) {
                    update(result.listener, result.installation.installationId, result.username);
                } else {
                    register(result.listener, result.installation.installationId, result.username);
                }
            },
            function(error) {
                console.error('github-notifier: unable to read from local storage: ' + error);
            }
        );        
    };
    
    return {
        ensureId: ensureId,
        getId: getId,
        save: save
    };
})();
