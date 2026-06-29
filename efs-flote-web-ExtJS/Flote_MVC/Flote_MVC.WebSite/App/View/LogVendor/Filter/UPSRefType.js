/* ====================================================================================================
NAME:			[LV UPS Reference Type]
BEHAVIOR:		Shows LV UPS Reference Type Filter.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/26/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.View.LogVendor.Filter.UPSRefType', {
    extend: 'BIA.container.FilterContainer',
    alias: 'widget.App-View-LogVendor-Filter-UPSRefType',
    layout: 'vbox',
    items: [
         { xtype: 'label', text: 'UPS Reference Type:', baseCls: 'UPS_Black' },
        {
            xtype: 'clearCombo',
            itemId: 'DisplayCurr',
            emptyText: 'UPS Reference Type',
            width: 170,
            store: new Ext.data.SimpleStore({
                data: [
                    [1, 'Shipment Number'],
                    [2, 'MBL Number'],
                    [6, 'E2k Carrier Code'],
                    [5, 'Vendor Code'],
                    [4, 'Container Number'],
                    [3, 'Carrier BOL'],
                    [99, 'Excel Upload']
                ],
                fields: ['value', 'text']
            }),
            valueField: 'value',
            value: 1,
            displayField: 'text',
            triggerAction: 'all',
            editable: false,
            onChange: function (newValue, oldValue, eOpts) {
                var me = this.up('window');
                if (LogVendorSCls.getInvoiceId() != '' && LogVendorSCls.getInvoiceId() != 0) {
                    if (['Logged', 'Pending', 'Verified'].indexOf(me.dataRecord.invoice_status) >= 0) {

                        if (newValue == 99) {
                            me.down('#SaveProcess').hide();
                            me.down('#LogNext').show();
                            me.down('#LogNext').setText('Save');
                            me.down('#ExcelUpload').show();
                            me.down('#Cancel').hide();
                        }
                        else {
                            me.down('#SaveProcess').show();
                            me.down('#LogNext').show();
                            me.down('#ExcelUpload').hide();
                            me.down('#Cancel').show();

                        }
                    }
                }
                else {
                    if (newValue == 99) {
                        me.down('#SaveProcess').hide();
                        me.down('#LogNext').show();
                        me.down('#LogNext').setText('Save');
                        me.down('#ExcelUpload').show();
                        me.down('#Cancel').hide();
                        me.down('#SaveCheckInfo').hide();
                    }
                    else {
                        me.down('#SaveProcess').show();
                        me.down('#LogNext').show();
                        me.down('#ExcelUpload').hide();
                        me.down('#Cancel').show();
                        me.down('#SaveCheckInfo').hide();
                    }

                }
            },
            listeners: {
                beforerender: function (me) {
                    var win = me.up('window');
                    if (win && win.dataRecord && Ext.isObject(win.dataRecord) && win.dataRecord.Invoice_id > 0) {
                        me.setValue(win.dataRecord.Reference_id);
                    }
                }

            }
        }
    ],
    GetFilterDisplay: function () {
        var value = this.down('#DisplayCurr').getRawValue();
        return (value) ? 'DisplayCurr: ' + value : '';
    }
});