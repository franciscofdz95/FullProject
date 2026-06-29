Ext.define('App.View.Component.Permissions.Item.TypeIcon', {
    extend: 'Ext.container.Container',
    alias: 'widget.App-View-Component-Permissions-Item-TypeIcon',
    layout: 'hbox',

    items: [
        //{ xtype: 'container', itemId: 'SA', html: '<i class="fa fa-user"></i>', style: { color: 'black' }, hidden: true },
        //{ xtype: 'container', itemId: 'Admin', html: '<i class="fa fa-user-plus"></i>', style: { color: 'black' }, hidden: true },
        //{ xtype: 'container', itemId: 'User', html: '<i class="fa fa-user-secret"></i>', style: { color: 'black' }, hidden: true },
        { xtype: 'container', itemId: 'User', html: '<i class="fa fa-user"></i>', style: { color: 'black' }, hidden: true },
        { xtype: 'container', itemId: 'Admin', html: '<i class="fa fa-user-plus"></i>', style: { color: 'black' }, hidden: true },
        { xtype: 'container', itemId: 'SA', html: '<i class="fa fa-user-secret"></i>', style: { color: 'black' }, hidden: true }
    ]
});