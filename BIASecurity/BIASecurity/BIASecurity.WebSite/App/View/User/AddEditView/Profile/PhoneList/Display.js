Ext.define('App.View.User.AddEditView.Profile.PhoneList.Display', {
    extend: 'Ext.container.Container',
    alias: 'widget.App-View-User-AddEditView-Profile-PhoneList-Display',

    cls: 'userAddeditviewProfilePhonelistDisplay Chip',
    layout: {
        type: 'hbox',
        align: 'center',
        pack: 'start'
    },

    items: [
        { xtype: 'label', dataField: 'PhoneType' },
        { xtype: 'label', text: ':' },
        { xtype: 'label', dataField: 'PhoneNumber' }
    ]
});