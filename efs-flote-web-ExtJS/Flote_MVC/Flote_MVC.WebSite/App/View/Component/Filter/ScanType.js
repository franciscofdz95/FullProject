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
Ext.define('App.View.Component.Filter.ScanType', {
    extend: 'BIA.container.FilterContainer',
    alias: 'widget.App-View-Component-Filter-ScanType',
    layout: 'column',
    width: 210,
    items: [
        { xtype: 'label', text: 'Scan Dest:', baseCls: 'UPS_White', width: '48%' },

        {
            xtype: 'combobox',
            emptyText: 'Scan Type',
            itemId: 'ScanDest',
            allowBlank: false,
            width: '48%',
            store: new Ext.data.SimpleStore({
                data: [
                    ['All', 'All'],
                    ['NEXT_DAY', 'Next Day'],
                    ['TERM_PAY', 'Term Pay']
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

    ],
    GetFilterDisplay: function () {
        var value = this.down('#ScanDest').getRawValue();
        // forceSelection: true makes this a bit retarded.
        return (value) ? 'Scan Type: ' + value : '';
    }
});