Ext.define('BIA.Components.Export.Window.Loading', {
    extend: 'Ext.app.Controller',
    refs: [],
    init: function () {
        this.control({
            'BIA-Components-Export-Window-Loading-Container': {
                boxready: this.SubmitFormToDownloadExport
            }
        });
    },
    SubmitFormToDownloadExport: function SubmitFormToDownloadExport(me, width, height, eOpts) {
        if (Ext.getDom('fld_downloadAttempt') == null || (Ext.getDom('fld_downloadAttempt') != null && Ext.getDom('fld_downloadAttempt').value != '1')) {
            Ext.defer(function () {
                Ext.getDom('form1').submit();
                var intervalId = Ext.interval(function () {
                    if (Ext.getDom('fld_downloadId') != null && !Ext.isEmpty(Ext.getDom('fld_downloadId').value) &&
                        Ext.util.Cookies.get('Download_' + Ext.getDom('fld_downloadId').value + '_Complete') == 1) {
                        Ext.util.Cookies.set('Download_' + Ext.getDom('fld_downloadId').value + '_Complete', '0', Ext.Date.subtract(new Date(), Ext.Date.Day, -1), '/'); //, 'inside.ups.com'

                        if (Ext.isIE === true) {
                            me.hide();
                            me.up('').down('BIA-Components-Export-Window-IEComplete-Container').show();
                        }
                        else window.close();
                    }
                },
                100,
                this);
            }, 50, this);
        }
        else if(Ext.getDom('fld_downloadAttempt') != null && Ext.getDom('fld_downloadAttempt').value == '1') {
            Ext.Msg.alert('Download Error', 'There was an error downloading the file. If this issue persists please contact the application\'s admin.',
                function () { window.close(); }, this);
        }
    }
});