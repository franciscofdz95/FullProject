/* ====================================================================================================
NAME:			[LV Bill Currency]
BEHAVIOR:		Shows LV Bill Currency Filter.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/26/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.View.LogVendor.Filter.BillCurr', {
    extend: 'BIA.container.FilterContainer',
    alias: 'widget.App-View-LogVendor-Filter-BillCurr',
    layout: 'vbox',
    items: [
        { xtype: 'label', text: 'Bill Currency:', baseCls: 'UPS_Black' },
        {
            xtype: 'clearCombo',
            itemId: 'DisplayCurr',
            name: 'InvoiceCID',
            emptyText: 'Display Currency',
            width: 150,
            store: {
                type: 'webapi',
                api: {
                    read: 'api/WebAPIFilter/BillCurr'
                },
                listeners: {
                    beforeload: function (store, operation, eOpts) {
                        var query = PgAtt.getLocation_code() + ',' + PgAtt.getCountry_code();
                        operation._params.query = query;
                        // But operation.params and operation.getParams() is always null
                    }
                },
                remoteFilter: false
            },
            valueField: 'currency_code',
            displayField: 'currency_code',
            triggerAction: 'all',
            onChange: function (newValue, oldValue, eOpts) {
                var me = this;
                me.updateLayout();
            },
            listeners: {
                afterrender: function (combo) {

                    BIA.Ajax.request({
                        url: 'api/WebAPIFilter/DisplayCurrency',
                        method: "POST",
                        async: false,
                        cache: false,
                        dataType: "html",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        jsonData: {
                            query: PgAtt.getLocation_code() + ',' + PgAtt.getCountry_code()
                        },
                        useDefaultXhrHeader: true,
                        success: function (conn, response, options, eOpts) {
                            var data = Ext.decode(conn.responseText);

                            combo.clearValue();
                            var dataVal = [];
                            var defaultCurrency = '';

                            for (var i = 0; data.length > i; i++) {
                                dataVal.push(data[i]);
                                if (data[i].defaultCurrency) { defaultCurrency = data[i].currency_code; }
                            }

                            combo.store.loadData(dataVal, true);
                            combo.valueField = 'currency_code';
                            combo.displayField = 'currency_code';
                            combo.setValue(defaultCurrency);

                            var me = this;
                            var win = me.up('window');
                            if (win && win.dataRecord && Ext.isObject(win.dataRecord) && win.dataRecord.Invoice_id > 0) {
                                me.setValue(win.dataRecord.invoice_CID);
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
    ],
    GetFilterDisplay: function () {        
        return '<div>' + '{currency_code}' + '</div>';
    }
});