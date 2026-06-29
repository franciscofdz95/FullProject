/* ====================================================================================================
NAME:			[Scan Type Filter]
BEHAVIOR:		Shows Scan Type Filter.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
01/07/2021        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.View.Component.Filter.PaidStatus', {
    extend: 'BIA.container.FilterContainer',
    alias: 'widget.App-View-Component-Filter-PaidStatus',
    layout: 'column',
    width: 210,
    items: [
        { xtype: 'label', text: 'Paid Status:', baseCls: 'UPS_White', width: '48%' },

        {
            xtype: 'combobox',
            emptyText: 'Paid Status',
            itemId: 'PaidStatus',
            allowBlank: false,
            width: '48%',
            store: new Ext.data.SimpleStore({
                data: [
                    ['All', 'All'],
                    ['Never Validated', 'Never Validated'],
                    ['Validated', 'Validated'],
                    ['Paid', 'Paid'],
                    ['Hold', 'Hold'],
                    ['Scheduled', 'Scheduled']
                ],
                //itemId: 0,
                fields: ['value', 'text']
            }),
            valueField: 'value',
            value: 'All',
            displayField: 'text',
            triggerAction: 'all',
            editable: false

        }

    ]
});