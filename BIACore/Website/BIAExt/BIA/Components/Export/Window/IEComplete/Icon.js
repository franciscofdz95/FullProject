Ext.define('BIA.Components.Export.Window.IEComplete.Icon', {
    extend: (Ext.platformTags && Ext.platformTags.modern) ? 'Ext.Container' : 'Ext.container.Container',
    alias: 'widget.BIA-Components-Export-Window-IEComplete-Icon',
    cls: 'ExporterIcon',
    layout: {
        type: 'hbox',
        align: 'stretch',
        pack: 'center'
    },
    items: [
        { xtype: 'tbfill', flex: 1 },
        {
            xtype: 'container',
            html: '<i class="fa fa-check-circle fa-3x ExporterIconComplete"></i>'
        },
        { xtype: 'tbfill', flex: 1 }
    ]
});