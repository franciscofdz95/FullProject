Ext.define('App.View.Main', {
    extend: (Ext.platformTags && Ext.platformTags.modern) ? 'Ext.Container' : 'Ext.container.Container',
    alias: 'widget.App-View-Main',

    layout: {
        type: 'vbox',
        align: 'center',
        pack: 'middle'
    },

    style: {
        backgroundColor: '#FFFFFF'
    },

    items: [
        { xtype: 'App-View-Loading-Container' },
        { xtype: 'App-View-IEComplete-Container', hidden: true }
    ]
});