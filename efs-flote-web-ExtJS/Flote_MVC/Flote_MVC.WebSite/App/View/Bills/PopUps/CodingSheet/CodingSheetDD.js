/* ====================================================================================================
NAME:			[Coding sheet drop down]
BEHAVIOR:		Shows scan folder selection option.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/26/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.View.Reports.Bills.PopUps.CodingSheet.CodingSheetDD', {
    extend: 'BIA.container.FilterContainer',
    alias: 'widget.App-View-Bills-PopUps-CodingSheet-CodingSheetDD',
    layout: 'hbox',
    rec: '',
    name: 'CodingSheetDD',
    items: [
        { xtype: 'label', text: 'Select coding sheet export: ', width: '60%' },
        {
            xtype: 'combobox',
            emptyText: 'Select SubFolder',
            store: {
                type: 'webapi',
                api: {
                    read: 'api/WebAPIReport/GetSubFolderNames'
                },
                listeners: {
                    beforeload: function (store, operation, eOpts) {
                        var rec = Ext.ComponentQuery.query('#codingSheetId')[0].rec
                        var locCode = PgAtt.getLocation_code();
                        var cmpCode = PgAtt.getCompany_code()
                        if (rec != '') {
                            locCode = rec.get('Location_Code');
                        }
                        var query = locCode + ',' + cmpCode + ',' + Ext.ComponentQuery.query('#ScanFolderDD combobox')[0].getValue();
                        operation._params.query = query;
                    }
                },
                remoteFilter: false
            },
            valueField: 'subfoldername',
            displayField: 'subfoldername',
            width: '40%',
            editable: false,
            anchor: '100%',
            listConfig: {
                loadingText: 'Searching...',
                emptyText: 'No matching posts found.',
                // Custom rendering template for each item
                getInnerTpl: function () {
                    return '<div>' + '{subfoldername}' + '</div>';
                }
            },
            onChange: function (newValue, oldValue, eOpts) {
                var me = this;
                if (me.getValue() != '' && me.getValue() != null) {
                    var win = me.up('window');
                    var rec = win.rec
                    var sfldrsuffix = me.getValue().slice(-3);
                    var vscodesuffix = rec.get('Oracle_Site_Code').slice(-3);
                    var paygroupvalue = rec.get('pay_group');


                    if ((me.getValue() == 'PRIORITY_RCK') && (sfldrsuffix != vscodesuffix)) {
                        alert('Priority Payment should use site codes ending in "RCK". Currently selected Site Code is not "RCK"');
                    }

                    if ((me.getValue() == 'PAID') && (paygroupvalue != 'MANUAL')) {
                        alert('Cannot use PAID sub-folder because site code selected is not Manual. Move invoice back to PENDING status, select a manual site code and re-approve to avoid duplicate payment if invoice is already paid.');
                        me.setValue('Select SubFolder');
                    }

                    if (me.getValue() != 'Select SubFolder') {
                        BIA.Ajax.request({
                            url: 'api/WebAPIReport/SetScanFolder',
                            method: "POST",
                            async: false,
                            cache: false,
                            dataType: "html",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            jsonData: {
                                ScanFolder: win.down('#ScanFolderDD combobox').getValue() + '.' + me.getValue(),
                                InvoiceId: rec.get('invoice_id')
                            },
                            useDefaultXhrHeader: true
                            //success: function (conn, response, options, eOpts) { var data = Ext.decode(response.responseText); }
                        });
                    }
                }
            },
            listeners: {
                afterrender: function (combo) {
                    var win = combo.up('window');
                    var rec = win.rec,
                        folderName = rec.get('ScanFolder').split('.');
                    if (folderName.length > 1) {
                        combo.setValue(folderName[1].replace('@', '_'));
                        combo.focus();
                    }
                }
            }

        }]
});