Ext.define('App.View.Home.ChangePermission.CPWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.App-View-Home-ChangePermission-CPWindow',
    title: '<Div style="font-weight:bold; font-size:14px;color:white;">Geo/SR Switch</Div>',
    autoHeight: true,
    draggable: false,
    width:'30%',
    layout: 'vbox',
    bodyPadding: 10,
    items: [
        {
            xtype: 'displayfield',
            value: 'Your Geo/SR Permissions'
        }
    ],
    buttons: [
        {
            text: 'Close',
            itemId: 'CPCloseBtn'
        }
    ]
});