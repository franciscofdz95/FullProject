Ext.define('App.View.Component.Permissions.Item.Name', {
    extend: 'Ext.container.Container',
    alias: 'widget.App-View-Component-Permissions-Item-Name',
    //html: 'SP / CO / ALL'
    layout: 'vbox',

    items: [
        {
            xtype: 'container',
            itemId: 'NameValue',
            style: {
                whiteSpace: 'pre-wrap',
                //wordWrap: 'break-word',
                wordBreak: 'break-all'
                //overflowWrap: 'break-word',
                //overflow: 'hidden'
            },
            width: 182,
            flex: 1
        }
    ]
});