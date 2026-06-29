Ext.define('App.View.Component.MessageContainer', {
    extend: (Ext.platformTags && Ext.platformTags.modern) ? 'Ext.Container' : 'Ext.container.Container',
    alias: 'widget.App-View-Component-MessageContainer',
    cls: 'ExporterLoadingContainer Card',
    layout: {
        type: 'vbox',
        align: 'stretch',
        pack: 'center'
    },

    defaults: {
        margin: '0 0 10',
        padding: 5
    }
});