/**
 * Extends the {@link Ext.app.Application} class and adds a few extra features to change the MVC pattern used by Ext4.
 *
 * ## Ext Pattern
 * If you follow the Ext MVC design pattern, views are composed by instantiating controllers. This is awkward to think
 * about. What this class does is reverse the pattern, allowing you to define one or more {@link Ext.view.Viewport}
 * objects, and then switch between them at will.
 *
 * **Note:** This will require you to be very smart about your controller selectors. I strongly suggest you use xtype
 * and not itemId.
 *
 *     @example
 *     this.control(
 *         '[xtype="App.view.Widget"]': {
 *	           show: this.onShow
 *         });
 *
 * ## Example Usage
 *
 *     @example
 *     BIA.application({
 *          name: 'App',
 *          namespaces: ['MyReports'],
 *          autoAddControllers: true,
 *          launch: function () {
 *               Ext.widget('App.view.Main', {});
 *          }
 *     });
 *
 * **Note:** This file must be included last in your application, otherwise Ext's autoloader will either
 * throw an error about 'unable to find ...', or it just won't work.
 */

//Classic and Modern
Ext.define('BIA.app.Application', {
    extend: 'Ext.app.Application',

    /**
     * @cfg {Boolean} autoAddControllers
     * Switch to enable/disable automatically searching the given namespaces for controllers.
     */
    autoAddControllers: false,

    /**
     * @cfg {Boolean} loadDeepLinkOnStartup
     * Switch to enable/disable processing of Deep Link hash/query string on application start up
     */
    loadDeepLinkOnStartup: false,

    /**
     * @cfg {String[]} namespaces
     * The array of namespaces to search for controllers.
     */
    namespaces: [],

    constructor: function (config) {
        var me = this,
            config = config || {},
            domains = ['BIA'];

        if (config.autoAddControllers) {
            domains = Ext.Array.union(domains, [config.name], Ext.Array.from(config.namespaces || []));
            domains = Ext.Array.unique(domains);
        }
        // copy over things appropriate to Ext.app.Application.
        me.name = config.name;
        config.controllers = Ext.Array.union(Ext.Array.from(config.controllers), me.FindAllControllers(domains));

        for (var prop in config) {
            // run-around ext5's $configStrict rules (cannot override method on instance)
            if (config.hasOwnProperty(prop) && typeof config[prop] === 'function') {
                me[prop] = config[prop];
                delete config[prop];
            }
        }

        if (Ext.platformTags && Ext.platformTags.modern)
            me.callParent(arguments);
        else {
            me.callOverridden(arguments)
        }
    },

    /**
     * @private
     * Function for recursively searching the given namespace for objects that extend
     * Ext.app.Controller.
     * @param {String} path the current path being searched
     * @param {Object} root the current root object
     * @param {Number} depth the current search depth to limit/prevent recursive loops
     * @returns {Array} the array of controllers found in the current root
     */
    FindAllControllers: function (domains) {
        var me = this,
            result = [],
            classes = Ext.ClassManager.classes;

        // TODO: Ext.ClassManager.classes - methods appear to be classes, use .superclass to look for Ext.app.Controller.
        Ext.each(domains, function (domain) {
            for (var prop in classes) {
                if (prop.indexOf(domain) !== 0) {
                    continue;
                } else if (me.isController(classes[prop])) {
                    result.push(prop);
                }
            }
        });

        return result;
    },

    /**
     * @private
     * Function for determining if the current object is a controller.
     * @param {Object} c the item to test
     * @returns {Boolean} true if the object is a controller
     */
    isController: function (c) {
        // non-classes aren't functions
        if (!c.$isClass) { return false; }
        while (c) {
            if (c.$className === 'Ext.app.Controller') {
                return true;
            } else if (c.$className === 'Ext.app.Application') {
                // application extends controller, but is itself not a controller.
                return false;
            }
            c = c.superclass;
        }
        return false;
    }
});