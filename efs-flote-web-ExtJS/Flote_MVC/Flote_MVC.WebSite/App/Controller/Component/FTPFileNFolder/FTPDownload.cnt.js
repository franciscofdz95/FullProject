Ext.define('App.controller.FTPDownload', {
    extend: 'Ext.app.Controller',
    init: function () {
        var me = this;
        me.control({
            'App-View-Component-FTPFileNFolder-Report actioncolumn': {
                sftpColAction: me.SFTPColAction
            },
            'App-View-Component-FTPFileNFolder-Report #SFTPFolderId': {
                select: me.LoadFTPFiles
            }
        });
    },
    SFTPColAction: function SFTPColAction(view, rowIndex, colIndex, item, e, record, row, action, selectedFolder) {
        if (action == 'download') {
            if (!Ext.isEmpty(record.get('Value'))) {
                var iframeUrl = "api/WebAPIReport/DownLoadFile?fileName=" + record.get('Value') + "&selectedFolder=" + selectedFolder;
                Ext.DomHelper.insertAfter(Ext.getBody(), '<iframe style="display:none;" src="' + iframeUrl + '"></iframe>', true);
            }
            else {
                Ext.Msg.alert('No FTP Folder Selected', 'Choose the FTP File you would like to DOWNLOAD by selecting the rows below');
            }
        }
    },
    LoadFTPFiles: function LoadFTPFiles(combo, records) {
        let selectedFolder = combo.getValue();
        var params = {
            selectedFolder: selectedFolder
        };
        grid = combo.up('window').down('grid');
        var store = grid.getStore();
        store.getProxy().extraParams = params;
        store.load();
        //grid.st

    }
});
