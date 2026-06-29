Ext.define('BIA.Components.Export.Window.Loading.Message', {
    extend: (Ext.platformTags && Ext.platformTags.modern) ? 'Ext.Container' : 'Ext.container.Container',
    alias: 'widget.BIA-Components-Export-Window-Loading-Message',
    cls: 'ExporterMessage',

    layout: {
        type: 'hbox',
        align: 'stretch',
        pack: 'center'
    },
    items: [
        { xtype: 'tbfill', flex: 1 },
        {
            xtype: 'container',
            html: 'Generating Spreadsheet, please wait.',
            padding: '0 5'
        },
        { xtype: 'tbfill', flex: 1 }
    ]
});