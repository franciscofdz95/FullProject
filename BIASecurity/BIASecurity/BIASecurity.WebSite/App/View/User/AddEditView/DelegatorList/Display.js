Ext.define('App.View.User.AddEditView.DelegatorList.Display', {
    extend: 'Ext.container.Container',
    alias: 'widget.App-View-User-AddEditView-DelegatorList-Display',

    cls: 'Chip',
    layout: {
        type: 'hbox',
        align: 'center',
        pack: 'start'
    },
    margin: 2,
    height: 32,
    defaults: { margin: '0 0 0 3' },
    items: [
        { xtype: 'label', dataField: 'application_code', margin: 0 },
        { xtype: 'label', text: '-' },
        { xtype: 'label', dataField: 'DisplayName' },
        { xtype: 'label', text: '-' },
        { xtype: 'label', dataField: 'expirationDT', preText: 'Expires: ', formatFn: Ext.util.Format.date }
    ]
});