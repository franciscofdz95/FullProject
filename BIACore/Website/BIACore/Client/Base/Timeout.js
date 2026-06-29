// not actually redefining biacore
// this allows us to "extend" biacore without adding a new namespace, while keeping
// the data logically in a separate file.
// think of it like a c# partial class.
BIACore.define('BIACore', {
}, function () {
    BIACore.onReady(function () {
        // extend timeouts on Ext4.x
        var timeout = BIACore.Config.timeout || 35;

        // update Ext timeouts
        var ext = (typeof (Ext) !== 'undefined') ? Ext : null,
            version = (ext && ext.getVersion) ? ext.getVersion().major : 0;
        if (version >= 5) {
            // ext 5.x: configs are no longer cloned from some parent class.
            // so.. test if the configured object has the same timeout as base:
            // if it does, it's "defaulted" and we need to override it.
            // if it does not, it's "custom" and we need to leave it alone.

            ext.define('BIA.override.data.Connection', {
                override: 'Ext.data.Connection',
                constructor: function () {
                    var me = this;
                    me.callParent(arguments);
                    if (me.getTimeout() === ext.data.Connection.prototype.defaultConfig.timeout) {
                        me.setTimeout(timeout * 1000);
                    }
                }
            });

            ext.define('BIA.override.data.proxy.Server', {
                override: 'Ext.data.proxy.Server',
                constructor: function () {
                    var me = this;
                    me.callParent(arguments);
                    if (me.getTimeout() === ext.data.proxy.Server.prototype.defaultConfig.timeout) {
                        me.setTimeout(timeout * 1000);
                    }
                }
            });

            // action (uploads) extend Basic, so we need to allow for longer/larger uploads.
            ext.define('BIA.override.form.Basic', {
                override: (Ext.platformTags && Ext.platformTags.modern) ? 'Ext.form.Panel' : 'Ext.form.Basic',
                constructor: function () {
                    var me = this;
                    me.callParent(arguments);
                    if (me.getTimeout && me.getTimeout() === (Ext.platformTags && Ext.platformTags.modern) ? ext.form.Panel.prototype.defaultConfig.timeout : ext.form.Basic.prototype.defaultConfig.timeout) {
                        me.setTimeout(timeout * 1000);
                    }
                }
            });
        } else if (version >= 4) {
            ext.override(ext.data.Connection, { timeout: timeout * 1000 });
            ext.override(ext.data.proxy.Server, { timeout: timeout * 1000 });
            ext.override(ext.form.action.Action, { timeout: timeout });
        }

        // update jQuery timeouts
        var $ = (typeof (jQuery) !== 'undefined') ? jQuery : null;
        if ($ !== null) {
            $.ajaxSetup({ timeout: timeout * 1000 });
        }
    });
});
