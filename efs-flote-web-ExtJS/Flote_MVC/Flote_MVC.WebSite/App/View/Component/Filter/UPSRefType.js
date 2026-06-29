/* ====================================================================================================
NAME:			[UPSRefType Filter]
BEHAVIOR:		Shows UPSRefType Filter.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/26/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.View.Component.Filter.UPSRefTypeName', {
    extend: 'BIA.container.FilterContainer',
    alias: 'widget.App-View-Component-Filter-UPSRefTypeName',
    layout: 'column',
    width: 210,
    items: [
        { xtype: 'label', text: 'UPS Ref Type:', baseCls: 'UPS_White', width: '48%' },
        {
            xtype: 'textfield',
            itemId: 'UPSRefType',
            emptyText: 'UPS Ref Type',
            width: '48%',
            readyOnly: true,
            editable: false,
            inputWidth: 75,
            hideLabel: true,
            hideTrigger: true,
            typeAhead: false
        }
    ]
});