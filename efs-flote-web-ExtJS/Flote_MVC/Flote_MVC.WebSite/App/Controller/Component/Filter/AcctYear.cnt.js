/* ====================================================================================================
NAME:			[Account Year Filter Controller ]
BEHAVIOR:		Account Year filter criteria.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/24/2017        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.Controller.Component.Filter.AcctYear', {
    extend: 'Ext.app.Controller',
    init: function () {
        this.control({
            'App-View-Component-Filter-AcctYear combobox': {
                select: this.AcctYearSelect,
                afterrender: this.AcctYearAfterRender
            }
        });
    },
    AcctYearSelect: function AcctYearSelect(combo, records) {
        var combobox = combo.up('#filterItemId').down('container[name=AcctMon] combobox');
        Ext.Ajax.defaultHeaders = { "Content-Type": "application/json; charset=utf-8" };
        BIA.Ajax.request({
            url: 'api/WebAPIFilter/AcctMon',
            method: 'POST',
            jsonData: {
                AcctYear: combo.getValue()
            },
            success: function (response) {
                var data = Ext.decode(response.responseText);
                combobox.clearValue();
                var dataVal = [];
                for (var i = 0; data.total > i; i++) {
                    if (data.data[i].Accounting_Year == combo.getValue() || data.data[i].Accounting_Year == 'All') {
                        dataVal.push(data.data[i]);
                    }
                }
                combobox.store.loadData(dataVal);
                combobox.valueField = 'Accounting_Month';
                combobox.displayField = 'Accounting_Month';
                if (dataVal.length != 0) {
                    combobox.setValue(dataVal[0].Accounting_Month);
                }
                else { combobox.setValue("All"); }
            },
            failure: function (conn, response, options, eOpts) {
                BIACore.Exception(conn.responseText);
                BIACore.Message(response);
            },
            scope: this
        });
    },
    AcctYearAfterRender: function AcctYearAfterRender(combo) {
        var dt = new Date();
        combo.setValue(dt.getFullYear());
        combo.focus();
    }
});