/* ====================================================================================================
NAME:			[Account Month Filter]
BEHAVIOR:		Shows Account Month Filter.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/26/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.View.Component.Filter.AcctMon', {
    extend: 'BIA.container.FilterContainer',
    alias: 'widget.App-View-Component-Filter-AcctMon',
    name: 'AcctMon',
    layout: 'column',
    width: 210,
    items: [
        { xtype: 'label', text: 'Acounting Month:', baseCls: 'UPS_White', width: '48%' },
        {
            xtype: 'combobox',
            itemId: 'AcctMonth',
            emptyText: 'Accounting Month',
            width: '48%',
            store: {
                type: 'webapi',
                api: {
                    read: 'api/WebAPIFilter/AcctMon'
                },
                remoteFilter: false,
                listeners: {
                    load: {
                        fn: function (t) {
                            t.clearFilter(true);
                            var comboYear = Ext.ComponentQuery.query('container[name=AcctYear] combobox')[0];
                            t.filterBy(function (rec, id) {
                                var retFlag = false;
                                if (rec.get('Accounting_Year') === comboYear.getValue() || rec.get('Accounting_Month') == 'All') { retFlag = true; }
                                return retFlag;
                            }, this);

                        }
                    }
                }
            },
            valueField: 'Accounting_Month',
            displayField: 'Accounting_Month',
            editable: false,
            allowBlank: false,
            value: new Date().getMonth() + 1
        }
    ],
    GetFilterDisplay: function () {
        var value = this.down('#AcctMonth').getRawValue();
        return (value) ? 'Acc Month: ' + value : '';
    }
});

