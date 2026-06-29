Ext.define('App.View.Component.FTPFileNFolder.FTPFiles', {
    extend: 'App.View.Component.Grid.Base',
    alias: 'widget.App-View-Component-FTPFileNFolder-FTPFiles',
    title: '<div style="font-weight: bold; font-size: 12px; color: white;"> FTP Files </div>',
    itemId: 'ftpFilesId',
    border: true,
    viewConfig: {
        deferEmptyText: true,
        emptyText: 'No data to Display'
    },
    ui: 'UPS_Blue_1',
    columns: {
        defaults: { menuDisabled: true, align: 'center' },
        cls: 'UBlue',
        items: [
            { text: 'Row ID', dataIndex: 'Key', hidden: true },
            { text: '<div style="font-weight: bold; font-size: 12px; color: white; "> File Name </div>', dataIndex: 'Value', flex: 1.2 },
            {
                text: '<div style="font-weight: bold; font-size: 12px; color: white;"> Action </div>', dataIndex: 'Value',
                xtype: 'actioncolumn',
                flex: 1,
                items: [{
                    icon: 'images/DownloadExcel-icon.png',
                    tooltip: 'Download',
                    handler: function (view, rowIndex, colIndex, item, e, record, row) {
                        this.fireEvent('sftpColAction', view, rowIndex, colIndex, item, e, record, row, 'download',record.get('SelectedFolder'));
                    },
                    getClass: function (value, meta, rec) {
                        var grid = this.up('grid');
                        if (value == "" || value == undefined || value == null) {
                            return 'x-hide-display';
                        }
                    }
                }, {
                    xtype: 'spacer'
                }]
            }
        ]
    },
    initComponent: function () {
        var me = this;
        me.store = {
            type: 'webapi',
            api: {
                read: 'api/WebAPIReport/ConnectToSFTP'
            },
            extraParams: {
                selectedFolder: ''
            },
            autoLoad: true
        };
        this.callParent(arguments);
    },
    ShowHideAction: function (value, meta, record, actionCol) {

    }
});