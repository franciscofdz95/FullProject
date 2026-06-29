Ext.define('App.View.Application.List.Item.Status.Online', {
    extend: 'App.View.Component.List.Item.ConditionalIcon',
    alias: 'widget.App-View-Application-List-Item-Status-Online',
    cls: 'ApplicationListItemStatusOnline ApplicationListIcon',
    
    iconProperty: 'Active',
    icons: [
        '<i class="fa fa-circle Offline" data-qtip="App Offline"></i>',
        '<i class="fa fa-circle Online" data-qtip="App Online"></i>'
    ],
    msg: [
        'Are you sure you want to take the application offline?',
        'Are you sure you want to make the application available?'
    ]
});