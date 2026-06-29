Ext.define('App.View.Component.Permissions.Item.StatusIcon', {
    extend: 'Ext.container.Container',
    alias: 'widget.App-View-Component-Permissions-Item-StatusIcon',
    layout: 'hbox',
    minWidth: 14,
    items: [
        { xtype: 'container', itemId: 'NoAccess', html: '<i class="fa fa-ban"></i>', style: { color: 'red'}, hidden: true },
        { xtype: 'container', itemId: 'Pending', html: '<i class="fa fa-history"></i>', style: { color: 'black' }, hidden: true }
    ]
});