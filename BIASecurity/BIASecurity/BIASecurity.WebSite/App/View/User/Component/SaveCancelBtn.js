Ext.define('App.View.User.Component.SaveCancelBtn', {
    extend: 'Ext.container.Container',
    alias: 'widget.App-View-User-Component-SaveCancelBtn',

    //cls: 'userComponentSavecancelbtn',
    layout: {
        type: 'hbox',
        align: 'center',
        pack: 'center'
    },
    style: {
        backgroundColor: '#f5f5f5'
    },
    padding: '0 0 0 5',
    defaults: { margin: '0 5 0 0' },

    items: [
        { xtype: 'button', itemId: 'UserSave', text: 'Save', scale: 'medium', margin: '0 5 0 5' },
        { xtype: 'button', itemId: 'UserCancel', text: 'Cancel', scale: 'medium', margin: '0 5 0 5' }
    ]
});