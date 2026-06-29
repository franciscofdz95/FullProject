Ext.define('App.View.Component.FTPFileNFolder.Report', {
    extend: 'Ext.container.Container',
    alias: 'widget.App-View-Component-FTPFileNFolder-Report',
    closable: false,
    hidden: false,
    border: true,
    layout: 'border',
    items: [
        { xtype: 'App-View-Component-FTPFileNFolder-FTPFolder', region: 'north' },
        { xtype: 'App-View-Component-FTPFileNFolder-FTPFiles', region: 'center' }
    ]
});