/* ====================================================================================================
NAME:			[Bill Reports TBar Fields]
BEHAVIOR:		Shows Bill Reports Tbar Info.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
10/13/2016        Sudhir Dandale		 Created.
======================================================================================================*/
Ext.define('App.View.ImportExcel.Validate.TBar', {
    extend: 'Ext.container.Container',
    alias: 'widget.App-View-ImportExcel-Validate-TBar',
    width: '100%',
    border: 0,
    style: 'background:#DFE8F6 !important;',
    layout: 'vbox',
    items: [
        {
            xtype: 'container',
            margin: '5 5 5 5',
            layout: 'hbox',
            items: [
                { xtype: 'button', iconCls: 'icon_reimport', text: 'ReImport', itemId: 'btnreImportValidate', cls: 'uButton', margin: '0 5 0 5' },
                { xtype: 'button', iconCls: 'icon_toggle', enableToggle: true, pressed: true, text: 'All Errors Only', itemId: 'btnShowErrors', cls: 'uButton', margin: '0 5 0 5' },
                { xtype: 'button', iconCls: 'icon_ExportExcel', text: 'Excel Export', cls: 'uButton', itemId: 'btnExcelExport', margin: '0 5 0 5' },
                { xtype: 'button', iconCls: 'icon_validate', text: 'Recommended CBOL', itemId: 'btnUpdateCBOL', cls: 'uButton', margin: '0 5 0 5' },
                { xtype: 'button', iconCls: 'icon_deleteAll', text: 'Delete All', itemId: 'btnDeleteAllGrid', cls: 'uButton', margin: '0 5 0 5' },
                { xtype: 'button', iconCls: 'icon_toggle', text: 'CBOLN', tooltip: 'CBOL does not exist in e2k.', itemId: 'btnShowCBOLN', cls: 'uButton', margin: '0 5 0 5' },
                { xtype: 'button', iconCls: 'icon_toggle', text: 'CBOLR', tooltip: 'CBOL does not match exactly. Use recommendation?', itemId: 'btnShowCBOLR', cls: 'uButton', margin: '0 5 0 5' },
                { xtype: 'button', iconCls: 'icon_toggle', text: 'CHGCD', tooltip: 'Charge description is missing in the mapping table.', itemId: 'btnShowCHGCD', cls: 'uButton', margin: '0 5 0 5' },
                { xtype: 'button', iconCls: 'icon_toggle', text: 'DUPS', tooltip: 'Duplicate records using CBOL, charge description, job number, container type, HBL and container number fields.', itemId: 'btnShowDUPS', cls: 'uButton', margin: '0 5 0 5' },
                { xtype: 'button', iconCls: 'icon_toggle', text: 'HBLR', tooltip: 'HBL does not match exactly. Use recommendation?', itemId: 'btnShowHBLR', cls: 'uButton', margin: '0 5 0 5' },
                { xtype: 'button', iconCls: 'icon_toggle', text: 'HBLN', tooltip: 'HBL does not exist in e2k.', itemId: 'btnShowHBLN', cls: 'uButton', margin: '0 5 0 5' },
                { xtype: 'button', iconCls: 'icon_ProcessToFlote', text: 'Process To Flote', hidden: true, itemId: 'btnProcessToFlote', cls: 'uButton', margin: '0 5 0 5' },

            ]
        },
        {
            xtype: 'container',
            margin: '5 5 5 5',
            layout: 'hbox',
            cls: 'price-rise',
            items: [
                { xtype: 'label', itemId: 'lblName', text: 'Import Excel Message :', cls: 'titlLabel' },
                {
                    xtype: 'label', itemId: 'lblErrorMsg', text: '', autoSize: true, Style: 'float:right;margin-right:5%;', cls: 'price-rise', hidden: true
                }
            ]
        }

    ]

});