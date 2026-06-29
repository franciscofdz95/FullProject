/* ====================================================================================================
NAME:			[User Access Profile]
BEHAVIOR:		User access Profile Container.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
03/26/2023        Sagarika Vugge		 Created.
 ======================================================================================================*/
Ext.define('App.View.Component.UserAccess.UserProfile', {
    extend: 'BIA.container.FilterContainer',
    alias: 'widget.App-View-Component-UserAccess-UserProfile',
    layout: 'column',
    items: [
        {
            xtype: 'label', text: 'Select user profile to assign:', width: '45%', style: 'font-size:12px;', padding: '0 0 0 105'
        },
        {
            xtype: 'clearCombo',
            store: {
                type: 'webapi',
                api: {
                    read: 'api/BIASecurityFlote/GetEAInfo',
                },
                remoteFilter: false,
                autoLoad: true
            },
            emptyText: 'UserProfile',
            width: '45%',
            anchor: '100%',
            value: '1',
            itemId: 'UsrProfileID',
            valueField: 'EA_ProfileId',
            displayField: 'EA_ProfileName',
            allowBlank: false,
            editable: false,
            listConfig: {
                loadingText: 'Searching...',
                emptyText: 'No matching posts found.',
                getInnerTpl: function () {
                    return '<div>' + '{EA_ProfileId} - {EA_ProfileName}' + '</div>';
                }
            }
        }

    ]
});