Ext.define('App.View.Component.Permissions.NoAccessItem', {
    extend: 'Ext.container.Container',
    alias: 'widget.App-View-Component-Permissions-NoAccessItem',
    cls: 'Card',

    padding: 5,
    style: {
        borderRadius: '5px',
        backgroundColor: '#CCCCCC',
        border: 'none',
        backgroundImage: 'none !important',
        fontSize: '16px'
    },

    layout: {
        type: 'hbox',
        align: 'middle',
        pack: 'begin'
    },
    defaults: {
        margin: '0 3'
    },
    width: 30,
    items: [
        { xtype: 'container', itemId: 'NoAccess', html: '<i class="fa fa-ban"></i>', style: { color: 'red' } }
    ]
});