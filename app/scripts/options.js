/*jshint unused:false */
/*jshint sub:true */
/*global chrome, humane, self, ChromeStorage, Marker, Installation, Analytics */
var Options = (function() {
    'use strict';
    
    var urlRegExp = /\b((?:https?:\/\/|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/i,
        usernameRegExp = /^[a-zA-Z0-9]+[a-zA-Z0-9\-]*$/;
    
    var currentRequest;
    
    var extensionMessagesSuccess = humane.create({ baseCls: 'humane-jackedup', addnCls: 'humane-jackedup-success' }),
        extensionMessagesError = humane.create({ timeout: 5000, clickToClose: true, baseCls: 'humane-jackedup', addnCls: 'humane-jackedup-error' });
    
    
    var checkListenerAvailability = function(url) {
        if (!url) {
            Marker.clearField('.listener-validation');
            return;
        }
        
        if (currentRequest) {
            console.log('A request was already executing');
            currentRequest.abort();
        }
        
        currentRequest = $.ajax({
            url: url + '/v1',
            success: function(response) {
                if (response.server && response.server.version) {
                    Marker.markAsValid('.listener-validation', 'Github Listener v' + response.server.version + ' found');                    
                } else {
                    Marker.markAsInvalid('.listener-validation', 'Server not available');
                }
            },
            error: function() {
                Marker.markAsInvalid('.listener-validation', 'Server not available');
            },
            complete: function() {
                currentRequest = null;
            }
        });
    };
    
    var checkUsernameValidity = function(username) {
        if (!username) {
            Marker.clearField('.username-validation');
            return;
        }
        
        if (usernameRegExp.test(username)) {
            Marker.markAsValid('.username-validation', 'This seems a valid GitHub username');
        } else {
            Marker.markAsInvalid('.username-validation', 'Invalid username');
            extensionMessagesError.log('GitHub usernames may only contain alphanumeric<br>characters or dashes and cannot begin with a dash');
        }
    };
    
    var saveOptions = function() {
        var options = {};
        
        _.each(['username', 'listener'], function(selector) {
            var value = $('#' + selector).val();
            if (value) {
                options[selector] = value;
            } else {
                ChromeStorage.remove(selector);
            }
        });

        if (!_.isEmpty(options)) {
            ChromeStorage.save(options, function() {
                extensionMessagesSuccess.log('Options saved');
                Installation.save();
            });
        } else {
            extensionMessagesSuccess.log('Options saved');
        }
    };
    
    var initOptions = function() {
        ChromeStorage.read(['username', 'listener']).then(
            function(result) {
                if (result.username) {
                    $('#username').val(result.username);
                    checkUsernameValidity(result.username);
                }
        
                if (result.listener) {
                    $('#listener').val(result.listener);
                    checkListenerAvailability(result.listener);
                }
            }
        );
    };
    
    var initFieldListeners = function() {
        var debouncedCheckListenerAvailability = _.debounce(checkListenerAvailability, 200);

        $('#username').on('input', function() {
            checkUsernameValidity(this.value);
        });

        $('#listener').on('input', function() {
            if (urlRegExp.test(this.value)) {
                debouncedCheckListenerAvailability(this.value);
            } else {
                Marker.clearField('.listener-validation');
            }
        });        
    };
    
    var initButtonListeners = function() {
        $('#saveButton').on('click', function(evt) {
            evt.preventDefault();
    
            chrome.runtime.sendMessage({ name: 'retrieveNotifications'});
            
            saveOptions();
        });
    
        $('#closeButton').on('click', function() {
            self.close();
        });
        
        $('.storage-information').on('click', function() {
            ChromeStorage.read(null).then(function(result) {
                console.log(result);
            });
        });
    };
    
    var initStorageInformation = function() {
        ChromeStorage.getUsage().then(function(usage) {
            $('.storage-information').text('Storage in use: ' + usage);
        });
    };
    
    var initAnalytics = function() {
        Analytics.init();
        Analytics.trackPage('Options');
    };
    
    $(function() {
        initAnalytics();
        initOptions();
        initFieldListeners();
        initButtonListeners();
        initStorageInformation();
    });
})();


