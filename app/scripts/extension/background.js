/*jshint unused:false */
var Background = (function() {
    'use strict';

    var lifecycleTrigger = function() {
        if (!Lifecycle.hasStarted()) {
            Lifecycle.start();
        }
    };

    // We need to do things when:
    // - the extension is loaded
    // - another part of the extension sends a message
    var initListeners = function() {
        chrome.runtime.onInstalled.addListener(function() {
            Console.info('github-notifier: starting up');
            ChromeBadge.setAppearance();
            Installation.ensureId().then(lifecycleTrigger);
        });

        chrome.runtime.onMessage.addListener(lifecycleTrigger);
    };

    // Let's make sure things start rolling
    initListeners();
})();
