/*jshint unused:false */
/*jshint sub:true */
/*global chrome, humane, self, ChromeStorage */
var Options = (function() {
    'use strict';
    
    var urlRegExp = /\b((?:https?:\/\/|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/i,
        usernameRegExp = /^[a-zA-Z0-9]+[a-zA-Z0-9\-]*$/;
    
    var currentRequest;
    
    var extensionMessagesSuccess = humane.create({ baseCls: 'humane-jackedup', addnCls: 'humane-jackedup-success' }),
        extensionMessagesError = humane.create({ timeout: 5000, clickToClose: true, baseCls: 'humane-jackedup', addnCls: 'humane-jackedup-error' });
    
    
    var clearField = function(fieldName) {
        $('.' + fieldName).removeClass('icon-cross icon-checkmark');
        $('.' + fieldName + '-message').text('');
    };
    
    var checkListenerAvailability = function(url) {
        if (!url) {
            clearField('listener-validation');
            return;
        }
        
        if (currentRequest) {
            console.log('A request was already executing');
            currentRequest.abort();
        }
        
        currentRequest = $.ajax({
            url: url + '/v1',
            success: function(response) {
                $('.listener-validation').
                    removeClass('icon-cross').
                    addClass('icon-checkmark');
                
                $('.listener-validation-message').text('Github Listener v' + response.server.version + ' found');
            },
            error: function() {
                $('.listener-validation').
                    removeClass('icon-checkmark').
                    addClass('icon-cross');
                
                $('.listener-validation-message').text('Server not available');
            },
            complete: function() {
                currentRequest = null;
            }
        });
    };
    
    var saveOptions = function() {
        var options = {
            username: $('#username').val(),
            listener: $('#listener').val()
        };

        ChromeStorage.save(options, function() {
            extensionMessagesSuccess.log('Options saved');
        });
    };
    
    var initOptions = function() {
        Promise.all([
            ChromeStorage.read('username'),
            ChromeStorage.read('listener')
        ]).then(function(results) {
            $('#username').val(results[0]);
            checkUsernameValidity(results[0]);
    
            $('#listener').val(results[1]);
            checkListenerAvailability(results[1]);
        });
    };
    
    var checkUsernameValidity = function(username) {
        if (!username) {
            clearField('username-validation');
            return;
        }
        
        if (usernameRegExp.test(username)) {
            $('.username-validation').
                removeClass('icon-cross').
                addClass('icon-checkmark');
    
            $('.username-validation-message').text('This seems a valid GitHub username');
        } else {
            $('.username-validation').
                removeClass('icon-checkmark').
                addClass('icon-cross');
    
            $('.username-validation-message').text('Invalid username');
            
            extensionMessagesError.log('GitHub usernames may only contain alphanumeric<br>characters or dashes and cannot begin with a dash');
        }
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
                clearField('listener-validation');
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
    };
    
    $(function() {
        initOptions();
        initFieldListeners();
        initButtonListeners();
    });
})();


