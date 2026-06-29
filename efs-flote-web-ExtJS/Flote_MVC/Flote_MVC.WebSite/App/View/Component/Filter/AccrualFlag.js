/* ====================================================================================================
NAME:			[Accrual Flag Filter]
BEHAVIOR:		Shows Accrual Flag Filter.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/26/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.View.Component.Filter.AccrualFlag', {
    extend: 'BIA.container.FilterContainer',
    alias: 'widget.App-View-Component-Filter-AccrualFlag',
    layout: 'column',
    width: 210,
    items: [
         { xtype: 'label', text: 'Accrual Status:', baseCls: 'UPS_White', width: '48%' },
        {
            xtype: 'combobox',
            itemId: 'AccrualFlag',
            emptyText: 'Accrual Status',
            width: '48%',
            store: new Ext.data.SimpleStore({
                data: [
                    ['All', 'All'],
                    ['2', 'Open'],
                    ['1', 'Partial'],
                    ['0', 'Closed']
                ],                
                fields: ['value', 'text']
            }),
            valueField: 'value',
            value: 'All',
            displayField: 'text',
            triggerAction: 'all',
            editable: false            
        }
    ],
    GetFilterDisplay: function () {
        var value = this.down('#AccrualFlag').getRawValue();
        return (value) ? 'AccrualFlag: ' + value : '';
    }
});