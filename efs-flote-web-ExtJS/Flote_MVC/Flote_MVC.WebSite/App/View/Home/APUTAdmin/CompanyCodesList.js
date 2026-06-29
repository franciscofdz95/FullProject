/* ====================================================================================================
NAME:			[Aput User List]
BEHAVIOR:		Add new Aput User List
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
04/27/2017        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.View.Home.APUTAdmin.CompanyCodesList', {
    extend: 'BIA.container.FilterContainer',
    alias: 'widget.App-View-Home-APUTAdmin-CompanyCodesList',
    layout: 'vbox',
    width: 210,
    items: [
        { xtype: 'label', text: 'Select a Company Code', baseCls: 'UPS_White' },
        {
            xtype: 'combobox',
            hideLabel: true,
            allowBlank: false,
            editable: false,
            emptyText: 'Select a Company',
            store: {
                type: 'webapi',
                api: {
                    read: 'api/WebAPIReport/GetCompanyCodesAll'
                }
            },
            listConfig: {
                loadingText: 'Searching...',
                emptyText: 'Select a Company',
                getInnerTpl: function () {
                    return '<div>' + '{ORA_Company} - ({SHORT_DESCRIPTION})' + '</div>';
                }
            },
            valueField: 'ORA_Company',
            displayField: 'ORA_Company',
            listeners: {
                'select': function (combo, records) {
                    var container = combo.up('App-View-Home-AputAdmin-Container');
                    if (combo.getValue() != "" && container.down('#aputUserListId clearCombo').getValue() != "") {
                        container.down('#btnAddUser').setDisabled(false);                     
                    }
                    else {
                        container.down('#btnAddUser').setDisabled(true);
                    }

                }

            }
        }
    ]

});