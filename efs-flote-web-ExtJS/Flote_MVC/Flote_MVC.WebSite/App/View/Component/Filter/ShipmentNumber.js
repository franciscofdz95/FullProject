/* ====================================================================================================
NAME:			[Shipment Number Filter]
BEHAVIOR:		Shows Shipment Number Filter.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/26/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.View.Component.Filter.ShipmentNumber', {
    extend: 'BIA.container.FilterContainer',
    alias: 'widget.App-View-Component-Filter-ShipmentNumber',
    name: 'ShipmentNumber',
    layout: 'column',
    width: 210,
    items: [
          { xtype: 'label', text: 'Shipment Number:', baseCls: 'UPS_White', width: '48%' },
            {
                xtype: 'clearCombo',
                store: {
                    type: 'webapi',
                    api: {
                        read: 'api/WebAPIFilter/ShipmentNo'
                    },
                    remoteFilter: false
                },
                itemId: 'ShipmentNumber',
                emptyText: 'Shipment Number',
                allowBlank: true,
                width: '48%',
                minChars: 3,
                value: '',
                hideLabel: true,
                hideTrigger: true,
                typeAhead: false,
                valueField: 'shpmnt_nbr',
                displayField: 'shpmnt_nbr',
                listConfig: {
                    loadingText: 'Searching...',
                    emptyText: 'No matching posts found.',
                    // Custom rendering template for each item
                    getInnerTpl: function () {
                        return '<div>' + '{shpmnt_nbr}' + '</div>';
                    }
                }//,
                //triggers: {
                //    clear: {
                //        weight: 0,
                //        cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                //        hidden: true,
                //        handler: 'onClearClick',
                //        scope: 'this'
                //    }
                //},
                //onClearClick: function () {
                //    var me = this;
                //    me.reset();
                //    me.getTrigger('clear').hide();
                //    me.fireEvent('onclear', me, me.getValue());
                //    me.updateLayout();
                //    PgAtt.setShipment_number('');
                //    IProcessingSCls.setIsFilterFieldRemoved(true);
                //    this.onChange('');
                //},
                //onChange: function (newValue, oldValue, eOpts) {
                //    var me = this;
                //    if (!Ext.isEmpty(newValue) && newValue.length > 0) {
                //        me.getTrigger('clear').show();
                //        PgAtt.setShipment_number(newValue);
                //    } else {
                //        me.getTrigger('clear').hide();
                //        PgAtt.setShipment_number('');
                //    }                    

                //    me.updateLayout();
                //},
                //listeners: {
                //    afterrender: function () {
                //        var me = this;
                //        if (me.getValue() != '') {
                //            me.getTrigger('clear').show();
                //        }
                //    }
                //}


            }
    ],
    GetFilterDisplay: function () {
        var value = this.down('#shpmnt_nbr').getRawValue();
        return (value) ? 'Shipment Number: ' + value : '';
    }
});