/*jshint unused:false */
/*jshint -W079 */
var Lifecycle = (function() {
    'use strict';

    var socket,
        installation,
        username,
        started = false,
        oldestCommit = Date.now();

    var hasStarted = function() {
        return started;
    };

    var start = function() {
        ChromeStorage.read(['installation', 'username', 'listener', 'commits']).then(
            function(result) {
                // Without listener, there's not much to do
                // (this may happen on first run, for example)
                if (!result.listener) { return; }

                // If we have a listener, we assume
                // the rest is there, too.
                // TODO: a bit optimistic. Add more sanity checks.
                installation = result.installation;
                username = result.username;

                if (result.commits) {
                    oldestCommit = _.min(result.commits, 'unixTimestamp');
                }

                socket = io(result.listener);
                socket.on('connect', handleConnection);
                started = true;
            }
        );
    };

    var handleConnection = function() {
        var payload = {
            installationId: installation.installationId
        };
        
        if (installation.registered) {
            payload.oldestCommit = oldestCommit;
        } else {
            payload.username = username;
        }

        socket.emit('registration', payload);

        socket.on('commitsReceived', function(data) {
            Console.log(data);
        });

        socket.on('disconnect', function() {
            Console.log('Socket.io client disconnected');
        });
    };
    
    return {
        start: start,
        hasStarted: hasStarted
    };
})();

