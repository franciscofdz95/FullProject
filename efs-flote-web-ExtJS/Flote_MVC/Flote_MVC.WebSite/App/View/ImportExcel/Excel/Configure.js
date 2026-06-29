/* ====================================================================================================
NAME:			[Excel Configuration]
BEHAVIOR:		Shows all import excel configuration.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
03/07/2017        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.View.ImportExcel.Excel.Configure', {
    extend: 'Ext.form.Panel',
    alias: 'widget.App-View-ImportExcel-Excel-Configure',
    border: true,
    baseCls: 'UPS_Blue_2',
    init: function () {
        this.callParent(arguments);
    },
    items: [
        {
            xtype: 'button', itemId: 'btnImportTemplate', fieldLabel: 'Upload', margin: '2 0 6 0', scale: 'large', cls: 'uButton',
            icon: 'images/Office-Excel-icon-32.png', text: '<span style="font-weight:bold; font-size:14px;">Import Vendor Template</span>'
        },
         {
             xtype: 'fieldcontainer',
             layout: 'hbox',
             baseCls: 'UPS_Blue_2',
             items: [
                 {
                     xtype: 'numberfield', itemId: 'edtIdentifier', fieldLabel: '<span style="font-weight:bold;color: #FFFFFF;">Invoice Id</span>', width: 180, allowBlank: false, minValue: 0, hideTrigger: true,
                     keyNavEnabled: false, mouseWheelEnabled: false, labelWidth: 65, margin: '5 0 5 0', readOnly: true
                 }, {
                     xtype: 'button', itemId: 'btnDeleteAll', margin: "5 0 5 5", hidden: true, iconCls: 'icon_deleteAll', cls: 'uButton',
                     text: ''
                 }
             ]
         },
        {
            xtype: 'label', itemId: 'edtPQRWarning', width: 175, html: '<span style="font-weight:bold;color: #ffd700 ;">Invoice Id already exists</span>',
            hidden: true, margin: '2 5 5 5', cls: 'font-size'
        },
            {
                xtype: 'fieldset',
                title: '<span style="color: #FFFFFF;">Worksheet Info</span>',
                baseCls: 'UPS_Blue_2',
                items: [
                            {
                                xtype: 'numberfield', itemId: 'edtHeaderRow', fieldLabel: '<span style="font-weight:bold;color: #FFFFFF;">Header Row</span>',
                                value: 1, maxValue: 99, minValue: 1, labelWidth: 120, anchor: '100%', margin: '5 5 5 5', border: true, width: 200
                            },
                            {
                                xtype: 'numberfield', itemId: 'edtDataRowStart', fieldLabel: '<span style="font-weight:bold;color: #FFFFFF;">Data Row Start</span>',
                                value: 2, maxValue: 99, minValue: 2, labelWidth: 120, anchor: '100%', margin: '5 5 5 5', border: true, width: 200
                            },
                            {
                                xtype: 'numberfield', itemId: 'edtDataRowEnd', fieldLabel: '<span style="font-weight:bold;color: #FFFFFF;">Data Row End</span>',
                                value: 9999, maxValue: 9999, minValue: 1, labelWidth: 120, anchor: '100%', margin: '5 5 5 5', border: true, width: 200
                            }
                            //,
                             //{
                             //    xtype: 'combobox', fieldLabel: '<span style="font-weight:bold;color: #FFFFFF;">Reference Type</span>', border: true,
                             //    emptyText: 'Reference Type', labelWidth: 120, width: 180,
                             //    store: new Ext.data.SimpleStore({
                             //        data: [
                             //            [1, 'CBOL'],
                             //            [2, 'Manifested']
                             //        ],
                             //        fields: ['value', 'text']
                             //    }),
                             //    valueField: 'value', value: 'CBOL', displayField: 'text', triggerAction: 'all', editable: false, anchor: '90%', margin: '5 5 5 5'
                             //}

                ]
            },
        {
            xtype: 'button', itemId: 'btnCommitExcelImport', text: '<span style="font-weight:bold;">Commit</span>',
            width: 82, cls: 'uButton', icon: 'images/Check_16x16.png', margin: "5 5 5 5", disabled: true
        },
        {
            xtype: 'button', itemId: 'btnCancelExcelImport', text: '<span style="font-weight:bold;">Cancel</span>',
            width: 82, cls: 'uButton', icon: 'images/Cancel_16x16.png', margin: "5 5 5 5"
        }
    ]
});

