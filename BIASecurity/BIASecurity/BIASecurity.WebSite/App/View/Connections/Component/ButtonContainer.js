Ext.define('App.View.Connections.Component.ButtonContainer', {
    extend: 'Ext.container.Container',
    alias: 'widget.App-View-Connections-Component-ButtonContainer',
    xtype: 'connectionsAddEditButtonContainer',
    componentCls: 'connectionsComponentButtoncontainer',
    layout: {
        type: 'hbox',
        align: 'stretch',
        pack: 'center'
    },
    padding: '3 0 0 5',
    defaults: { margin: '0 5 0 0' },
    items: [
        { xtype: 'button', itemId: 'Delete', text: 'Delete', hidden: true, cls: 'RedButton' },
        { xtype: 'container', flex: 1},
        { xtype: 'button', itemId: 'Save', text: 'Save' },
        { xtype: 'button', itemId: 'Cancel', text: 'Cancel' }
    ],

    //optional configurations
    show_delete: false //set to true to show the delete (this is not available everywhere)
});