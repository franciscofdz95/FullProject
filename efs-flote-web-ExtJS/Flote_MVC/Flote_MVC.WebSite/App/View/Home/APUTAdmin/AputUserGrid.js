/* ====================================================================================================
NAME:			[Aput User Grid]
BEHAVIOR:		Shows Aput User Grid
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/26/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.View.Home.APUTAdmin.AputUserGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.App-View-Home-APUTAdmin-AputUserGrid',
    border: true,
    store: {
        type: 'webapi',
        api: {
            read: 'api/WebAPIReport/GetAputUserList'
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
            text: 'Aput Users', dataIndex: 'f_name', width: 250, renderer: HSCls.homeScreenRenderer
        }, {
            xtype: 'widgetcolumn', itemId: 'cmpCodesListId', width: 180, text: 'Company Codes',
            widget: {
                xtype: 'combobox',
                valueField: 'ORA_Company',
                displayField: 'ORA_Company',
                emptyText: 'Select a Company',
                editable: false,
                border: 1,
                listConfig: {
                    loadingText: 'Searching...',
                    // Custom rendering template for each item
                    getInnerTpl: function () {
                        return '<div>' + '{ORA_Company} - ({SHORT_DESCRIPTION})' + '</div>';
                    }
                },
                listeners: {
                    'select': function (combo, records) {
                        var record = combo.getWidgetRecord();                        
                        var value = this.getValue();
                        if (value.length > 0) {
                            record = combo.getWidgetRecord();
                            record.set('CompanyCode', Ext.util.Format.trim(value));
                        }
                        else {
                            record.set('CompanyCode', '');
                        }
                    }
                }
            },
            onWidgetAttach: function (column, widget, record) {
                var cmpCodeData = HSCls.getCompanyCodeList();
                widget.setStore(Ext.create('Ext.data.Store', {
                    fields: ['ORA_Company', 'SHORT_DESCRIPTION'],
                    data: cmpCodeData
                }));
                widget.setValue('');
            }
        },
        {
            xtype: 'widgetcolumn',
            itemId: 'colCmpCodesAddId',
            width: 120,
            text: '',
            widget: {
                xtype: 'button',
                text: 'Add Company',
                listeners: {
                    'click': function (btn, records) {
                        var record = btn.getWidgetRecord();
                        var grid = this.up('grid');
                        if (record != '' && record != null && record.get('CompanyCode') != undefined && record.get('CompanyCode') != '') {
                            grid.fireEvent('addcompanycodes', record.get('sysm'), record.get('CompanyCode'));
                            record.dirty = false;
                        }
                        else {
                            alert("Valid CompanyCode is missing for selected row.")
                        }
                    }
                }
            }
        }
    ]

});
