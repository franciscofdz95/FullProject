/**
 * @class BIACore.Log
 * @singleton
 * 
 * Contains basic logging facilities that can be extended to log externally if necessary.
 */
BIACore.define('BIACore', {
}, function (me) {
    var write = function (level, message) {
        if (typeof (console) !== 'undefined') {
            console.log(level + ': ' + message);
        }
    };

    BIACore.apply(me, {
        /**
         * Log the given message to the console.
         * @param {String} message the message to log.
         */
        Console: function (message) { write('CONSOLE', message); },

        /**
         * Log the given message as a 'debug' event.
         * @param {String} message the message to log.
         */
        Debug: function (message) { write('DEBUG', message); },

        /**
         * Log the given message as a 'message' event.
         * @param {String} message the message to log.
         */
        Message: function (message) { write('MESSAGE', message); },

        /**
         * Log the given message as an 'error' event.
         * @param {String} message the message to log.
         */
        Error: function (message) { write('ERROR', message); },

        /**
         * Log the given message as a 'exception' event.
         * @param {Object} error the error to log.
         */
        Exception: function (message) { write('EXCEPTION', message); }
    });
});