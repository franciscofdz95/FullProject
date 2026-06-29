/* ====================================================================================================
NAME:			[LV Acc Number]
BEHAVIOR:		Shows LV ACC Number Filter.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/26/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.View.LogVendor.Filter.ACCNo', {
    extend: 'BIA.container.FilterContainer',
    alias: 'widget.App-View-LogVendor-Filter-ACCNo',
    layout: 'vbox',
    items: [
        { xtype: 'label', text: 'ACC Name:', baseCls: 'UPS_Black' },
        {
            xtype: 'clearCombo',
            itemId: 'Number',
            name: 'AccNumber',
            width: 230,
            autoLoad: false,
            store:
            {
                type: 'webapi',
                api: {
                    read: 'api/WebAPIReport/GetAccName'
                },
                remoteFilter: false,
                listeners: {
                    beforeload: function (store, operation, eOpts) {
                        var record = LogVendorSCls.getDataRecord();
                        store.getProxy().extraParams = {
                            LocCode: PgAtt.getLocation_code(),
                            InvDate: ""
                        };
                        var query = record.AccNumber;
                        operation._params.query = query;
                    }
                }
            },
            triggerAction: 'all',
            emptyText: 'None',
            valueField: 'Number',
            displayField: 'Name',
            onChange: function (newValue, oldValue, eOpts) {
                var me = this;
                var win = me.up('window');
                LogVendorSCls.getAccName(me, win, true);
            }

        }
    ],
    GetFilterDisplay: function () {
        var value = this.down('#Number').getRawValue();
        return (value) ? 'Number: ' + value : '';
    }

});