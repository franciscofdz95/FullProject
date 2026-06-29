/* ====================================================================================================
NAME:			[E2k User Id]
BEHAVIOR:		Shows E2k User Id Filter.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
03/30/2023        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.View.Component.UserAccess.E2kUserId', {
    extend: 'BIA.container.FilterContainer',
    alias: 'widget.App-View-Component-UserAccess-E2kUserId',
    layout: 'column',
    items: [
        { xtype: 'label', text: 'E2K UserId:', width: '45%', style: 'font-size:12px;', padding: '0 0 0 190' },
        {
            xtype: 'textfield',
            itemId: 'e2kuserid',
            width: '45%',
            anchor: '100%'
        }

    ]
});