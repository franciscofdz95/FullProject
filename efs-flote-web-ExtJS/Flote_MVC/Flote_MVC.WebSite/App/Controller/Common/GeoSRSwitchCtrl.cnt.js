/* ====================================================================================================
NAME:			[GeoSRSwitch Common Controller ]
BEHAVIOR:		Connects to flote common function/actions for different components.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
11/15/2017        Sriram Sundara		 Created.
======================================================================================================*/
Ext.define('App.Controller.Common.GeoSRSwitchCtrl', {
    extend: 'Ext.app.Controller',
    itemId: 'geoSRSwitchCtrlId',    
    init: function () {
        var me = this;

        me.control({
            '[xtype="App-View-Component-Common-GeoSRSwitchButton"] #btnGeoSRSwitchId': {
                click: me.Showwindow
            },
            '[xtype="App-View-Component-Common-GeoSRSwitchWindow"] #btnClose': {
                click: me.Closewindow
            },
            'App-View-Component-Common-GeoSRSwitchWindow': {
                beforerender: me.GetGeoSRPermissions
            },

            'App-View-Component-Container-FilterPanelBase' : {
              
            }
        });
    },    

    Showwindow: function Showwindow(me) {
        var geoSRSwitchWindow = Ext.widget('App-View-Component-Common-GeoSRSwitchWindow');
        geoSRSwitchWindow.show();
        geoSRSwitchWindow.alignTo(Ext.getBody(), "tr-tr", [0, 95]);
    },

    Closewindow: function Closewindow(me) {
        var geoSRSwitchWindow = me.up('#geoSRWindowId');
        geoSRSwitchWindow.close();      
    },


    GetGeoSRPermissions: function GetGeoSRPermissions(me) { 
        var geoSRSwitchWindow = me;
        var panelpermission = me.down('#panelUserPermissions');       

        for (var index = 0; index < BIACore.Security.User.permissions.length; index++)
        {
            var x = index;
            panelpermission.add({
                xtype: 'component',                
                autoEl: {
                    tag: 'a', href: '#', itemId: index,
                    html: BillsSingCls.getUserNameById(BIACore.Security.User.permissions[index].userId) + '-' + PgAtt.getBusinessUnit(BIACore.Security.User.permissions[index].businessUnitId) + '-' + PgAtt.selectDesc(BIACore.Security.User.permissions[index].geoCode)  + BIACore.Security.User.permissions[index].geoId,
                    style: (PgAtt.getGeoCode() == BIACore.Security.User.permissions[index].geoCode && PgAtt.getUserId() == BIACore.Security.User.permissions[index].userId &&
                        PgAtt.getGeoId() == BIACore.Security.User.permissions[index].geoId) ?
                        "font-weight:bold; font-size:12px;color:black;font-family:Verdana, Arial,sans-serif; " : 'color:black;font-family:Verdana, Arial,sans-serif;'
                },
                listeners: {

                    render: function(c){
                        c.getEl().on('click', function () {                            
                            PgAtt.setUserId(BIACore.Security.User.permissions[c.autoEl.itemId].userId);
                            PgAtt.setGeoCode(BIACore.Security.User.permissions[c.autoEl.itemId].geoCode);
                            PgAtt.setGeoId(BIACore.Security.User.permissions[c.autoEl.itemId].geoId);
                            PgAtt.getSecurity(BIACore.Security.User.permissions[c.autoEl.itemId].geoCode, BIACore.Security.User.permissions[c.autoEl.itemId].geoId);                            
                            geoSRSwitchWindow.close();                           
                        }, c);
                    }                    
                }
            });
            panelpermission.doLayout();
        }
    }    

});

