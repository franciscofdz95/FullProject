/* ====================================================================================================
NAME:			[Page Name Filter]
BEHAVIOR:		Shows PageName Filter.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/26/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.View.Component.Filter.PageName', {
    extend: 'BIA.container.FilterContainer',
    alias: 'widget.App-View-Component-Filter-PageName',
    layout: 'column',
    width: 210,
    items: [
         { xtype: 'label', text: 'PageName:', baseCls: 'UPS_White', width: '48%' },
        {
            xtype: 'textfield',
            itemId: 'pageName',
            emptyText: 'PageName',
            allowBlank: true,
            width: '48%',
            inputWidth: 100
        }
    ],
    GetFilterDisplay: function () {
        var value = this.down('#PageName').getRawValue();
        return (value) ? 'PageName: ' + value : '';
    }
});