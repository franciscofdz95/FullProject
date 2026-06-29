/* ====================================================================================================
NAME:			[LVB Remote Check Location]
BEHAVIOR:		Shows LVB Remot Check Location Filter.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
06/06/2017        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.View.LogVendor.Filter.RemoteCheckLoc', {
    extend: 'BIA.container.FilterContainer',
    alias: 'widget.App-View-LogVendor-Filter-RemoteCheckLoc',
    hidden: true,
    layout: 'vbox',
    items: [
        { xtype: 'label', text: 'Remote Check Location:', baseCls: 'UPS_Black' },
        {
            xtype: 'clearCombo',
            name: 'remoteChkLoc',
            width: 150,
            store: {
                type: 'webapi',
                api: {
                    read: 'api/WebAPIFilter/GetRemotePrintLocations'
                },
                listeners: {
                    beforeload: function (store, operation, eOpts) {
                        store.getProxy().extraParams = {
                            LocCode: PgAtt.getLocation_code()
                        };
                    }
                },
                remoteFilter: false
            },
            valueField: 'remote_check_print_location',
            displayField: 'remote_check_print_location',
            triggerAction: 'all',
            onChange: function (newValue, oldValue, eOpts) {
                var me = this;
                me.updateLayout();
            },
            listeners: {
                afterrender: function (combo) {
                    var win = combo.up('window');
                    var locCode = win.down('#filVendorLoctionLVB clearCombo').getValue();
                    if (locCode == null && locCode == undefined) {
                        locCode = PgAtt.getLocation_code();
                    }
                    BIA.Ajax.request({
                        url: 'api/WebAPIFilter/GetRemotePrintLocations',
                        method: "POST",
                        async: false,
                        cache: false,
                        dataType: "html",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        jsonData: {
                            LocCode: locCode
                        },
                        useDefaultXhrHeader: true,
                        success: function (conn, response, options, eOpts) {
                            var data = Ext.decode(conn.responseText);

                            if (data != null && data.length > 0) {
                                combo.clearValue();
                                var dataVal = [];

                                for (var i = 0; data.length > i; i++) {
                                    dataVal.push(data[i]);
                                }

                                combo.store.loadData(dataVal, true);
                                combo.valueField = 'remote_check_print_location';
                                combo.displayField = 'remote_check_print_location';
                                combo.setValue(dataVal[0].remote_check_print_location);
                            } else {
                                combo.setValue(locCode);
                            }
                        },
                        failure: function () {
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