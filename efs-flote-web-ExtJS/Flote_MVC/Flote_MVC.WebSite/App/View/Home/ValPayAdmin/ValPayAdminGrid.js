/* ====================================================================================================
NAME:			[ValPay Admin Location Details]
BEHAVIOR:		Shows Valpay Admin location details
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
05/19/2017        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.View.Home.ValPayAdmin.ValPayAdminGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.App-View-Home-ValPayAdmin-ValPayAdminGrid',
    border: true,
    hidden: true,
    store: {
        type: 'webapi',
        api: {
            read: 'api/WebAPIReport/GetValuePayByRLoc'
        }
    },
    selModel: 'cellmodel',
    plugins: {
        ptype: 'cellediting',
        clicksToEdit: 1
    },
    columnLines: true,
    cls: 'UBlue',
    defaults: { menuDisabled: false, align: 'left', autoColumnResize: true, cls: 'UBlue', sortable: false, border: 1 },
    columns: [
    {
        text: 'Req Location:', dataIndex: 'req_location', width: 250
    },
    {
        text: 'Invoice Type Code:', dataIndex: 'invoice_type_code', width: 250
    },
    {
        xtype: 'widgetcolumn', dataIndex: 'value_pay_location', width: 180, text: 'Value Pay Location:',
        widget: {
            xtype: 'textfield',
            autoColumnResize: true,
            listeners: {
                change: function (text, newValue, OldValue) {
                    var value = this.getValue();
                    if (value.length > 0) {
                        var record = text.getWidgetRecord();
                        record.set('value_pay_location', Ext.util.Format.trim(value));
                    }

                }
            }
        }
    },
    {
        xtype: 'widgetcolumn',
        itemId: 'btnValAdminLocUpdate',
        width: 120,
        text: '',
        widget: {
            xtype: 'button',
            text: 'Update',
            listeners: {
                'click': function (btn, records) {
                    var record = btn.getWidgetRecord();
                    var grid = this.up('grid');
                    if (record != '' && record != null && record.get('req_location') != undefined && record.get('req_location') != '') {
                        grid.fireEvent('btnValAdminLocUpdate', record);
                        record.dirty = false;
                    }
                    else {
                        alert("Valid record is missing for selected row.")
                    }
                }
            }
        }
    }
    ]

});
