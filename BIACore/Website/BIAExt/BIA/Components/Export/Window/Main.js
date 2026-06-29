Ext.define('BIA.Components.Export.Window.Main', {
    extend: (Ext.platformTags && Ext.platformTags.modern) ? 'Ext.Container' : 'Ext.container.Container',
    alias: 'widget.BIA-Components-Export-Window-Main',

    layout: {
        type: 'vbox',
        align: 'center',
        pack: 'middle'
    },

    style: {
        backgroundColor: '#FFFFFF'
    },

    items: [
        { xtype: 'BIA-Components-Export-Window-Loading-Container' },
        { xtype: 'BIA-Components-Export-Window-IEComplete-Container', hidden: true }
    ]
});