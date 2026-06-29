/* ====================================================================================================
NAME:			[Grid Page sort]
BEHAVIOR:		Performs grid page sort.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/26/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.View.Component.Grid.PagedSort', {
    extend: 'BIA.grid.PagedPanel',
    alias: 'widget.App-View-Component-Grid-PagedSort',
    xtype: 'gridpagedsort',
    dockedItems: [
        { xtype: 'multisorttoolbar', dock: 'top' },
        {
            xtype: 'pagingtoolbar', dock: 'bottom', displayInfo: true            
        }
    ]
});