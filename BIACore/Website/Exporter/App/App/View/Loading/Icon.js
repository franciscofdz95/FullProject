Ext.define('App.View.Loading.Icon', {
    extend: (Ext.platformTags && Ext.platformTags.modern) ? 'Ext.Container' : 'Ext.container.Container',
    alias: 'widget.App-View-Loading-Icon',
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
            html: '<i class="fa fa-spinner fa-pulse fa-3x"></i>'
        },
        { xtype: 'tbfill', flex: 1 }
    ]
});