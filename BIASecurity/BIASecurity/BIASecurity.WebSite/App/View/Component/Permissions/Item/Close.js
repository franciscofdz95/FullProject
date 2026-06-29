Ext.define('App.View.Component.Permissions.Item.Close', {
    extend: 'Ext.container.Container',
    alias: 'widget.App-View-Component-Permissions-Item-Close',
    layout: 'hbox',
    cls: 'PermissionItemClose',

    margin: '0 -2 0 0',
    width: 18,
    items: [
        {
            xtype: 'container',
            html: '<i class="fa fa-times-circle-o"></i>',
            style: {
                //color: '#999999',
                fontSize: '20px'
            },
            flex: 1
        }
    ]
});