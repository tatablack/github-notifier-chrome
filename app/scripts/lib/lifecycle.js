/*jshint unused:false */
/*jshint -W079 */
var Lifecycle = (function() {
    'use strict';

    var socket;

    var start = function() {
        ChromeStorage.read(['listener']).then(
            function(result) {
                if (result.listener) {
                    socket = io(result.listener);
                    socket.on('connect', handleConnection);
                }
            }
        );
    };

    var handleConnection = function() {
        Console.log('Socket.io client connected');
        socket.on('incoming', function(data) {
            Console.log(data);
        });
        socket.on('disconnect', function() {
            Console.log('Socket.io client disconnected');
        });
    };
    
    return {
        start: start
    };
})();

