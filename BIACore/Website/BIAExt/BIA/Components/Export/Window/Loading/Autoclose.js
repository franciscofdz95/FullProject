Ext.define('BIA.Components.Export.Window.Loading.Autoclose', {
    extend: (Ext.platformTags && Ext.platformTags.modern) ? 'Ext.Container' : 'Ext.container.Container',
    alias: 'widget.BIA-Components-Export-Window-Loading-Autoclose',
    cls: 'ExporterLoadingAutoclose',
    layout: {
        type: 'hbox',
        align: 'stretch',
        pack: 'center'
    },
    items: [
        { xtype: 'tbfill', flex: 1 },
        {
            xtype: 'container',
            html: 'This window will close automatically after the download.'
        },
        { xtype: 'tbfill', flex: 1 }
    ]
});