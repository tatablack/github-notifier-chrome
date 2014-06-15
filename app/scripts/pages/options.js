/*jshint unused:false */
/*jshint sub:true */
/*global $, _, Console, chrome, humane, self, ChromeStorage, Marker, Installation, Analytics */
var Options = (function() {
    'use strict';

    var urlRegExp = /\b((?:https?:\/\/|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/i,
        usernameRegExp = /^[a-zA-Z0-9]+[a-zA-Z0-9\-]*$/;

    var currentRequest;

    var extensionMessagesSuccess = humane.create({ baseCls: 'humane-jackedup', addnCls: 'humane-jackedup-success' }),
        extensionMessagesError = humane.create({ timeout: 5000, clickToClose: true, baseCls: 'humane-jackedup', addnCls: 'humane-jackedup-error' });

    var options= {
        authors: []
    };
    
    var checkListenerAvailability = function(url) {
        if (!url) {
            Marker.clearField('.listener-validation');
            return;
        }
        
        if (currentRequest) {
            Console.log('github-notifier: a request was already executing');
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
    
    var updateOverview = function() {
        $('#overview').html(_.templates['overview']({
            username: options.username,
            authors: options.authors
        }));
    };
    
    var saveOptions = function(callback) {
        var clonedOptions = _.clone(options);
        
        _.each(['username', 'listener', 'authors'], function(name) {
            if (!clonedOptions[name] || !clonedOptions[name].length) {
                ChromeStorage.remove(name);
            }
        });
        
        if (!clonedOptions.authors.length) {
            delete clonedOptions.authors;
        }

        if (!_.isEmpty(clonedOptions)) {
            ChromeStorage.save(clonedOptions, function() {
                extensionMessagesSuccess.log('Options saved');
                Installation.save(callback);
                updateOverview();
            });
        } else {
            extensionMessagesSuccess.log('Options saved');
        }
    };
    
    var initOptions = function() {
        ChromeStorage.read(['installation', 'username', 'listener', 'authors']).then(
            function(result) {
                if (result.username) {
                    options.username = result.username;
                    $('#username').val(result.username);
                    checkUsernameValidity(result.username);
                }

                if (result.listener) {
                    options.listener = result.listener;
                    $('#listener').val(result.listener);
                    checkListenerAvailability(result.listener);
                }

                if (result.authors) {
                    options.authors = result.authors;
                }

                if (result.installation.registered) {
                    $('#rules').show();
                }
                
                if (result.username || (result.authors)) {
                    updateOverview();                    
                }
            }
        );
    };
    
    var addAuthor = function() {
        var newAuthor = $('#author').val();
        
        if (_.isEmpty(newAuthor)) { return; }
        
        options.authors.push(newAuthor);
        options.authors = _.uniq(options.authors);
        
        updateOverview();
        
        $('#author').val('');
    };
    
    var initFieldListeners = function() {
        var debouncedCheckListenerAvailability = _.debounce(checkListenerAvailability, 200);

        $('#username').on('input', function() {
            options.username = this.value;
            checkUsernameValidity(this.value);
        });

        $('#listener').on('input', function() {
            if (urlRegExp.test(this.value)) {
                options.listener = this.value;                
                debouncedCheckListenerAvailability(this.value);
            } else {
                Marker.clearField('.listener-validation');
            }
        });
        
        $('.icon-add').on('click', function() {
            addAuthor();
        });
        
        $('#author').on('keydown', function(evt) {
            if (evt.keyCode === 13) {
                addAuthor();
                return false;
            }
        });
        
        $('#overview').on('click', '.delete', function() {
            _.pull(options.authors, $('.delete').prev().text());
            updateOverview();
        });
    };
    
    var initButtonListeners = function() {
        $('#saveButton').on('click', function(evt) {
            evt.preventDefault();

            saveOptions(function() {
                $('#rules').show();
                updateOverview();
                
                _.delay(chrome.runtime.sendMessage, 2000, { name: 'retrieveNotifications'});
            });
        });
    
        $('#closeButton').on('click', function() {
            self.close();
        });
        
        $('.storage-information').on('click', function() {
            ChromeStorage.read(null).then(function(result) {
                Console.log('github-notifier: storage contents ' + String.fromCharCode(0x25BC) + '\n', result);
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


