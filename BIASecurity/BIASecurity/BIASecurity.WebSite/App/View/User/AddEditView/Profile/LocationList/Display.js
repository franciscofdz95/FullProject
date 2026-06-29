Ext.define('App.View.User.AddEditView.Profile.LocationList.Display', {
    extend: 'Ext.container.Container',
    alias: 'widget.App-View-User-AddEditView-Profile-LocationList-Display',

    cls: 'userAddeditviewProfileLocationlistDisplay Chip',
    layout: {
        type: 'hbox',
        align: 'center',
        pack: 'start'
    },
    defaults: { margin: '0 10 0 0' },
    items: [
        { xtype: 'label', dataField: 'Region', preText: 'RR:' },
        { xtype: 'label', dataField: 'District', preText: 'DD:' },
        { xtype: 'label', dataField: 'Center', preText: 'CR:' },
        { xtype: 'label', dataField: 'Country', preText: 'CN:', margin: 0 }
    ]
});