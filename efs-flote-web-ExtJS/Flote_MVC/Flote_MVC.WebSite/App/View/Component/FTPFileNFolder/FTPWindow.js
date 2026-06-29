Ext.define('App.View.Component.FTPFileNFolder.FTPWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.App-View-Component-FTPFileNFolder-FTPWindow',
    contrain: true,
    constrainHeader: true,
    modal: true,
    layout: 'border',
    title: '<div style="font-weight: bold; font-size: 12px; color: white;">FTP Folder & Files</div>',
    width: '40%',
    height: '90%',
    config: {},
    initComponent: function () {
        this.items = [{
            xtype: 'App-View-Component-FTPFileNFolder-Report',
            config: this.config,
            region: 'center'
        }];
        this.callParent(arguments);
    }
});