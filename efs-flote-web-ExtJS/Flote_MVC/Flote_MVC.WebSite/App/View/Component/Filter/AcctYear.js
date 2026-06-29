/* ====================================================================================================
NAME:			[Account Year Filter]
BEHAVIOR:		Shows Account Year Filter.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/26/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.View.Component.Filter.AcctYear', {
    extend: 'BIA.container.FilterContainer',
    alias: 'widget.App-View-Component-Filter-AcctYear',
    name: 'AcctYear',
    layout: 'column',
    width: 210,
    items: [
        { xtype: 'label', text: 'Acounting Year:', baseCls: 'UPS_White', width: '48%' },
        {
            xtype: 'combobox',
            itemId: 'AcctYear',
            hideLabel: true,
            allowBlank: false,
            editable: false,
            emptyText: 'Accounting year',
            width: '48%',
            store: {
                type: 'webapi',
                api: {
                    read: 'api/WebAPIFilter/AcctYear'
                }
            },
            valueField: 'Accounting_Year',
            displayField: 'Accounting_Year'            
        }
    ],
    GetFilterDisplay: function () {
        var value = this.down('#Accounting_Year').getRawValue();
        return (value) ? 'AcctYear: ' + value : '';
    }

});