Ext.define('App.View.Component.FTPFileNFolder.FTPFolder', {
    extend: 'Ext.form.Panel',
    alias: 'widget.App-View-Component-FTPFileNFolder-FTPFolder',
    itemId: 'ftpFolderId',
    title: '<div style="font-weight: bold; font-size: 12px; color: black; ">FTP Folders</div>',
    bodyPadding: 5,
    defaults: { flex: 1 },
    layout: {
        type: 'vbox',
        pack: 'start',
        align: 'fit'
    },
    ui: 'light',
    items: [{       
        xtype: 'combobox',
        store: {
            type: 'webapi',
            api: {
                read: 'api/WebAPIReport/ConnectToSFTPRootDirectory'
            },            
            remoteFilter: false,
            autoLoad: true
        },
        fieldLabel: "APUT FTP Root Directory",
        name: "SFTPFolder",
        itemId: "SFTPFolderId",
        displayField: "Value",
        valueField: "Value",
        labelWidth: 180,
        margin: '0 0 0 10',
        listConfig: {
            minWidth: 320
        },
        flex: 1        
    }],
    initComponent: function () {
        this.callParent(arguments);
    }
});