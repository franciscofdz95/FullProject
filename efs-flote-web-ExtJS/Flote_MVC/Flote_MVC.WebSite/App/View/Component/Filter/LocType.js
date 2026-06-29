/* ====================================================================================================
NAME:			[Location Type Filter]
BEHAVIOR:		Shows Location Type Filter.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/26/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.View.Component.Filter.LocType', {
    extend: 'BIA.container.FilterContainer',
    alias: 'widget.App-View-Component-Filter-LocType',
    layout: 'column',
    width: 210,
    items: [
        { xtype: 'label', text: 'Location Type:', baseCls: 'UPS_White', width: '48%' },
        {
            xtype: 'combobox',
            itemId: 'LocType',
            emptyText: 'Location Type',
            width: '48%',
            store: new Ext.data.SimpleStore({
                data: [
                    ['DEP', 'DEP'],
                    ['TP', 'TP']
                ],
                fields: ['value', 'text']
            }),
            valueField: 'value',
            value: 'DEP',
            displayField: 'text',
            triggerAction: 'all',
            editable: false
        }
    ],
    GetFilterDisplay: function () {
        var value = this.down('#LocType').getRawValue();
        return (value) ? 'LocType: ' + value : '';
    }
});