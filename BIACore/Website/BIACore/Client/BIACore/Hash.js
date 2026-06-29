/**
 * @class BIACore.Hash
 * @singleton
 * 
 * This defines functions for changing the current URI Hash (everything after the '#')
 */
BIACore.define('BIACore.Hash', {
    get: function () {
        return window.location.hash.substr(1);
    },
    set: function (value) {
        try {
            value = (typeof (value) === 'string') ? value : '';
            if (value.length === 0) {
                return;
            } else if (value.slice(0, 1) !== '#') {
                value = '#' + value;
            }
            window.location.hash = value;
        } catch (e) { }
    }
});