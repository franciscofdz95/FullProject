BIACore.define('BIACore.Addons.JQuery.Exists', {
    name: 'jquery.exists',
    plugin: function ($) {
        $.fn.exists = function () {
            return this.length !== 0;
        };
    }
});
