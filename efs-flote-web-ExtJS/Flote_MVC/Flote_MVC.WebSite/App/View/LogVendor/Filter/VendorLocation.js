/* ====================================================================================================
NAME:			[LV Vendor Location]
BEHAVIOR:		Shows LV Vendor location Filter.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/26/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.View.LogVendor.Filter.VendorLocation', {
    extend: 'BIA.container.FilterContainer',
    alias: 'widget.App-View-LogVendor-Filter-VendorLocation',
    name: 'vendLoc',
    layout: 'vbox',
    items: [
        { xtype: 'label', text: 'Vendor Bill Processing Location:', baseCls: 'UPS_Black' },
        {
            xtype: 'clearCombo',
            itemId: 'VendorLocationID',
            store: {
                type: 'webapi',
                api: {
                    read: 'api/WebAPIFilter/LocationCode'
                },

                listeners: {
                    beforeload: function (store, operation, eOpts) {
                        var geocode = PgAtt.getGeoCode();
                        var geoid = PgAtt.getGeoId(), query = '';

                        if (Ext.ComponentQuery.query('container[name=vendLoc] textfield').length > 1) {
                            query = geocode + ',' + geoid + ',' + Ext.ComponentQuery.query('container[name=vendLoc] textfield')[1].getValue();
                        } else {
                            query = geocode + ',' + geoid + ',' + Ext.ComponentQuery.query('container[name=vendLoc] textfield')[0].getValue();
                        }

                        operation._params.query = query;
                    }
                },
                remoteFilter: false
            },
            valueField: 'location_code',
            displayField: 'location_code',
            typeAhead: false,
            hideLabel: true,
            hideTrigger: true,
            anchor: '100%',
            minChars: 2,
            listConfig: {
                loadingText: 'Searching...',
                emptyText: 'No matching posts found.',
                // Custom rendering template for each item
                getInnerTpl: function () {
                    return '<div>' + '{location_code} - {location_name}' + '</div>';
                }
            },
            triggers: {
                clear: {
                    weight: 0,
                    cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                    hidden: true,
                    handler: 'onClearClick',
                    scope: 'this'
                }
            },
            onClearClick: function () {
                var me = this;
                var win = me.up('window');
                me.reset();
                me.getTrigger('clear').hide();
                me.fireEvent('onclear', me, me.getValue());
                win.down('#filACCNoLVB clearCombo').setDisabled(true);
                me.updateLayout();
            },
            onChange: function (newValue, oldValue, eOpts) {
                var me = this;
                var win = me.up('window');
                var vendor = win.down('App-View-LogVendor-Filter-Vendor').items.items[1],
                    vendorStore = vendor.store;
                if (!Ext.isEmpty(newValue) && newValue.length > 0 && me.store.data.length != 0) {
                    LogVendorSCls.GetTWHCodesByLoc(newValue);
                    PgAtt.setVendor_location(newValue);
                    me.getTrigger('clear').show();
                    var grid = win.down('grid'),
                        store = grid.getStore();
                    // set the parameters on the proxy                                              
                    store.getProxy().extraParams.LocCode = newValue;
                    store.getProxy().extraParams.InvoiceId = LogVendorSCls.getInvoiceId();
                    // load new data
                    store.load({
                        callback: function (records) {
                            if (records.length > 0) {
                                win.down('#filVatPtDateLVB datefield').setDisabled(false);
                                win.down('#filVatPtDateLVB label').setDisabled(false);
                                win.down('#filVatPtDateLVB datefield').show();
                                win.down('#filVatPtDateLVB label').show();
                            } else {
                                win.down('#filVatPtDateLVB datefield').setDisabled(true);
                                win.down('#filVatPtDateLVB label').setDisabled(true);
                                win.down('#filVatPtDateLVB datefield').hide();
                                win.down('#filVatPtDateLVB label').hide();
                            }
                        }
                    });
                    var record = LogVendorSCls.getDataRecord();
                    // set the parameters on the proxy of vendor
                    if (record != null && record != "") {
                        vendorStore.getProxy().extraParams = {
                            'loc_code': newValue,
                            'vendor': record.VendorValueField
                        };
                    } else {
                        vendorStore.getProxy().extraParams = {
                            'loc_code': newValue,
                            'vendor': vendor.value
                        };
                    }
                    // load new data
                    vendorStore.load();
                    if (LogVendorSCls.getTaxWthgInd() == 'Y') {
                        grid.down('#taxWhldCol').show();
                    } else {
                        grid.down('#taxWhldCol').hide();
                    }

                    if (LogVendorSCls.getVocInd() == 'Y') {
                        win.down('#filACCNoLVB clearCombo').setDisabled(false);
                    } else {
                        win.down('#filACCNoLVB clearCombo').setDisabled(true);
                    }
                } else {
                    me.getTrigger('clear').hide();
                }
                me.updateLayout();
            },
            // override default onSelect to do redirect
            listeners: {
                afterrender: function (combo) {
                    var loc_Code = '';
                    if (Ext.ComponentQuery.query('container[name=vendLoc] textfield').length > 1) {
                        loc_Code = Ext.ComponentQuery.query('container[name=vendLoc] textfield')[1];
                    } else {
                        loc_Code = Ext.ComponentQuery.query('container[name=vendLoc] textfield')[0];
                    }

                    combo.setValue(loc_Code.value);

                    if (combo.getValue() != '') {
                        combo.getTrigger('clear').show();
                    }
                }
            }
        }

    ]
});