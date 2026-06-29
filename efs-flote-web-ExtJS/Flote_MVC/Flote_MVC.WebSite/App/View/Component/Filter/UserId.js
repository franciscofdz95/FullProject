/* ====================================================================================================
NAME:			[User Id Filter]
BEHAVIOR:		Shows User Id Filter.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/26/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.View.Component.Filter.UserId', {
    extend: 'BIA.container.FilterContainer',
    alias: 'widget.App-View-Component-Filter-UserId',
    items: [
        {
            xtype: 'clearCombo',
            itemId: 'Ad_Id',
            emptyText: 'User Id',
            width: 120,
            store: {
                type: 'webapi',
                api: {
                    read: 'api/WebAPIFilter/userId'
                }
            },
            minChars: 3
        }
    ],
    GetFilterDisplay: function () {
        var value = this.down('#Ad_Id').getRawValue();
        return (value) ? 'User Id: ' + value : '';
    }
});