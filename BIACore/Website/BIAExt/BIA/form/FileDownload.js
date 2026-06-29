/**
 * Defines an Ext Panel that will be used for downloading files via the browser.
 */
Ext.define('BIA.form.FileDownload', {
    extend: 'Ext.form.Panel',

    /**
     * @cfg {Object} params
     * Any parameters to send to the server on submit.
     * Note that these values will be sent via the QueryString, since POST body mapping
     * is really difficult with standard submit in WebAPI.
     * (You can't send JSON objects, you have to form-encode everything, and the standard MVC
     * handler doesn't decode the form-encoded values reliably.)
     */
    params: {},

    /**
     * @cfg {String} [method='POST']
     * The default method for intializing the request with the server.
     * Needs to be a 'POST' type, for the {@link #standardSubmit} method to work correctly.
     */
    method: 'POST',

    /**
     * @cfg {String} [target='_blank']
     * Window to open the submitted URI in. You probably don't want to change this value.
     */
    target: '_blank',

    /**
     * @cfg {Boolean} [standardSubmit=true]
     * Use the browser's submit mechanism, instead of AJAX. Necessary for the browser to 
     * handle the initiated download correctly.
     */
    standardSubmit: true,

    initComponent: function () {
        var me = this;
        me.callParent(arguments);

        // submit to fire off the download
        me.submit({
            target: me.target,
            params: me.params
        });

        // and clean up after ourself.
        Ext.defer(function () { me.close(); }, 100);
    }
    
});