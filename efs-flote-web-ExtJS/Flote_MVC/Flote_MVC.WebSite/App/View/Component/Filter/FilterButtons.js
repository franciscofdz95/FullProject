/* ====================================================================================================
NAME:			[Filter Button]
BEHAVIOR:		Shows Filter Button.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/26/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.View.Component.Filter.FilterButtons', {
    extend: 'Ext.container.Container',
    alias: 'widget.App-View-Component-Filter-FilterButtons',
    border: 0,
    layout: { type: 'hbox' },
    defaults: { width: 40, margins: '5 5 5 5'},
    items: [
        {
            xtype: 'button', itemId: 'ApplyButton', cls: 'btn', text: '<div style="font-weight: bold; color:white;">Go</div>'
        }
    ]
});