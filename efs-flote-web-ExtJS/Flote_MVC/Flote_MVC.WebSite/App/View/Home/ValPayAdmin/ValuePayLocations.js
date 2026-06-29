/* ====================================================================================================
NAME:			[Value Pay Locations]
BEHAVIOR:		Shows Value Pay Locations
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
04/21/2017        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.View.Home.ValPayAdmin.ValuePayLocations', {
    extend: 'BIA.container.FilterContainer',
    alias: 'widget.App-View-Home-ValPayAdmin-ValuePayLocations',
    layout: 'column',
    width: 210,
    items: [
        // { xtype: 'label', text: 'Value Pay Locations: ', width: '48%' },
        {
            xtype: 'combobox',
            hideLabel: true,
            allowBlank: false,
            editable: false,
            emptyText: 'Select Value Pay Location',            
            store: {
                type: 'webapi',
                api: {
                    read: 'api/WebAPIFilter/GetValuePayList'
                }
            },
            valueField: 'req_location',
            displayField: 'req_location',
            listeners: {
                'select': function (combo, records) {

                    if (combo.getValue() != "") {

                        var tabPanel = combo.up('#tabPanelId');
                        tabPanel.down('#msgLocUpdateId').setVisible(false);
                        if (tabPanel.activeTab.tab.text != 'Home') {
                            tabPanel.setActiveTab(0);
                        }
                        tabPanel.down('#homeDateContainerId').setVisible(false);
                        tabPanel.down('#adminMessage2').setVisible(false);
                        tabPanel.down('#homeValPayAdminLocation').setVisible(true);
                        tabPanel.down('#valPayAdminLocComboId').setVisible(false);
                        var store = tabPanel.down('#homeValPayAdminLocation').getStore();
                        store.getProxy().extraParams.LocCode = combo.getValue();
                        store.load();
                        combo.clearValue();
                    }
                }
            }
        }
    ]

});