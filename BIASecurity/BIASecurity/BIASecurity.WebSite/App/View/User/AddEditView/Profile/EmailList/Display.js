Ext.define('App.View.User.AddEditView.Profile.EmailList.Display', {
    extend: 'Ext.container.Container',
    alias: 'widget.App-View-User-AddEditView-Profile-EmailList-Display',

    cls: 'userAddeditviewProfileEmaillistDisplay Chip',
    layout: {
        type: 'hbox',
        align: 'center',
        pack: 'start'
    },

    items: [
        { xtype: 'label', dataField: 'Email', margin: '0 5 0 0' },
        { xtype: 'App-View-User-Component-Email' }
    ]
});