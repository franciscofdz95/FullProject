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
Ext.define('App.View.Home.APUTAdmin.AputUserList', {
    extend: 'BIA.container.FilterContainer',
    alias: 'widget.App-View-Home-APUTAdmin-AputUserList',
    layout: 'vbox',
    width: 210,
    items: [
        { xtype: 'label', text: 'Add a new APUT user', baseCls: 'UPS_White' },
        {
            xtype: 'clearCombo',
            allowBlank: false,
            hideLabel: true,
            hideTrigger: true,
            triggerAction: 'all',
            editable: true,
            minChars: 3,
            store: {
                type: 'webapi',
                api: {
                    read: 'api/WebAPIReport/GetUserProfie'
                }
            },
            listConfig: {
                loadingText: 'Searching...',
                getInnerTpl: function () {
                    return '<div>' + '{l_name} , {f_name} ({sysm})' + '</div>';
                }
            },
            valueField: 'sysm',
            displayField: 'sysm',
            onClearClick: function () {
                var me = this;
                me.reset();
                me.getTrigger('clear').hide();
                me.fireEvent('onclear', me, me.getValue());
                me.updateLayout();
            },
            onChange: function (newValue, oldValue, eOpts) {
                var me = this;
                var container = me.up('App-View-Home-AputAdmin-Container');
                if (!Ext.isEmpty(newValue) && newValue.length > 0) {

                    if (container.down('#cmpCodesListId combobox').getValue() != "" && container.down('#cmpCodesListId combobox').getValue() != null) {

                        container.down('#btnAddUser').setDisabled(false);
                    }

                    me.getTrigger('clear').show();
                } else {
                    me.getTrigger('clear').hide();
                    container.down('#btnAddUser').setDisabled(true);
                }
                me.updateLayout();
            },
            listeners: {
                'select': function (combo, records) {

                    var container = combo.up('App-View-Home-AputAdmin-Container');
                    if (combo.getValue() != "" && container.down('#cmpCodesListId combobox').getValue() != "" && container.down('#cmpCodesListId combobox').getValue() != null) {
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