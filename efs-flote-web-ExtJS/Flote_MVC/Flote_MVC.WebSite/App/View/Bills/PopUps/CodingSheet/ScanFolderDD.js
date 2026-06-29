/* ====================================================================================================
NAME:			[LV Vendor Location]
BEHAVIOR:		Shows scan folder selection option.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/26/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.View.Reports.Bills.PopUps.CodingSheet.ScanFolderDD', {
    extend: 'BIA.container.FilterContainer',
    alias: 'widget.App-View-Bills-PopUps-CodingSheet-ScanFolderDD',
    layout: 'hbox',
    rec: '',
    items: [
        { xtype: 'label', text: 'Select scan folder for imaging :', width: '60%' },
        {
            xtype: 'combobox',
            store: {
                type: 'webapi',
                api: {
                    read: 'api/WebAPIReport/GetFolderNames'
                },
                listeners: {
                    beforeload: function (store, operation, eOpts) {
                        var rec = Ext.ComponentQuery.query('#codingSheetId')[0].rec
                        var locCode = PgAtt.getLocation_code();
                        var cmpCode = PgAtt.getCompany_code()
                        if (rec != '') {
                            locCode = rec.get('Location_Code');
                        }
                        var query = locCode + ',' + cmpCode;
                        operation._params.query = query;
                    }

                },
                remoteFilter: false
            },
            valueField: 'foldername',
            displayField: 'foldername',
            width: '40%',
            editable: false,
            allowBlank: false,
            anchor: '100%',
            listConfig: {
                loadingText: 'Searching...',
                emptyText: 'No matching posts found.',
                // Custom rendering template for each item
                getInnerTpl: function () {
                    return '<div>' + '{foldername}' + '</div>';
                }
            },
            // override default onSelect to do redirect
            listeners: {
                'select': function (combo, records) {
                    var me = this;
                    var win = me.up('window');
                    var rec = win.rec
                    var locCode = PgAtt.getLocation_code();
                    var cmpCode = PgAtt.getCompany_code()
                    if (rec != '') {
                        locCode = rec.get('Location_Code');
                    }
                    var query = locCode + ',' + cmpCode + ',' + me.getValue();
                    var combobox = win.down('container[name=CodingSheetDD] combobox');
                    Ext.Ajax.defaultHeaders = { "Content-Type": "application/json; charset=utf-8" };
                    BIA.Ajax.request({
                        url: 'api/WebAPIReport/GetSubFolderNames',
                        method: 'POST',
                        async: false,
                        cache: false,
                        dataType: "html",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        jsonData: {
                            query: query
                        },
                        useDefaultXhrHeader: true,
                        success: function (response) {
                            var data = Ext.decode(response.responseText);
                            combobox.clearValue();
                            var dataVal = [];
                            for (var i = 0; data.length > i; i++) {
                                dataVal.push(data[i]);
                            }
                            combobox.store.loadData(dataVal);
                            combobox.valueField = 'subfoldername';
                            combobox.displayField = 'subfoldername';
                        },
                        failure: function (conn, response, options, eOpts) {
                            BIACore.Exception(conn.responseText);
                            BIACore.Message(response);
                        },
                        scope: this
                    });
                },
                afterrender: function (combo) {
                    var win = combo.up('window');
                    var rec = win.rec;
                    var locCode = PgAtt.getLocation_code();
                    var cmpCode = PgAtt.getCompany_code()
                    if (rec != '') {
                        locCode = rec.get('Location_Code');
                    }
                    var query = locCode + ',' + cmpCode;
                    BIA.Ajax.request({
                        url: 'api/WebAPIReport/GetFolderNames',
                        method: "POST",
                        async: false,
                        cache: false,
                        dataType: "html",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        jsonData: {
                            query: query
                        },
                        useDefaultXhrHeader: true,
                        success: function (conn, response, options, eOpts) {
                            var folderName = rec.get('ScanFolder').split('.');
                            var flag = false,
                                data = Ext.decode(conn.responseText);
                            combo.clearValue();
                            var dataVal = [];
                            for (var i = 0; data.length > i; i++) {
                                dataVal.push(data[i]);
                                if (data[i].foldername.toUpperCase() == folderName[0].replace('@', '_').toUpperCase()) {
                                    flag = true;
                                }
                            }
                            combo.store.loadData(dataVal, true);
                            combo.valueField = 'foldername';
                            combo.displayField = 'foldername';

                            if (folderName[0] != '' && flag) {
                                combo.setValue(folderName[0].replace('@', '_'));
                            } else {
                                combo.setValue(dataVal[0].foldername);
                            }
                        },
                        failure: function (conn, response, options, eOpts) {
                            BIACore.Exception(conn.responseText);
                            BIACore.Message(response);
                        },
                        scope: this
                    });
                }
            }
        }
    ]
});