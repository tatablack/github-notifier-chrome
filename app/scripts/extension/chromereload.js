/*jshint unused:false */
/*global Console, chrome */

// Reload client for Chrome Apps & Extensions.
// The reload client has a compatibility with livereload.
// WARNING: only supports reload command.
var ChromeReload = (function() {
    'use strict';

    var LIVERELOAD_HOST = 'localhost:',
        LIVERELOAD_PORT = 35729,
        connection = new WebSocket('ws://' + LIVERELOAD_HOST + LIVERELOAD_PORT + '/livereload');
    
    connection.onerror = function(error) {
        Console.log('reload connection got error' + JSON.stringify(error));
    };
    
    connection.onmessage = function(evt) {
        if (evt.data) {
            var data = JSON.parse(evt.data);
            if (data && data.command === 'reload') {
                chrome.runtime.reload();
            }
        }
    };
})();

