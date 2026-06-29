/* ====================================================================================================
NAME:			[Excel Sheet Select Window]
BEHAVIOR:		Excel Sheet Select Window
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
12/12/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.View.ImportExcel.Excel.SheetSelect', {
    extend: 'Ext.window.Window',
    alias: 'widget.App-View-ImportExcel-Excel-SheetSelect',
    title: '<span style="font-weight:bold; color:white;font-size:12px;">Select Sheet</span>',
    height: 150,
    bodyPadding: 10,
    autoShow: true,
    modal: true,
    bodyStyle: 'background-color:white',
    items: [
            {
                xtype: 'form', bodyStyle: {
                    background: 'none',
                    border: '0'
                },
                layout: {
                    type: 'table',
                    columns: 2
                },
                items: [
                    { xtype: 'label', text: 'File:', margin: '4 5 5 5' },
                    { xtype: 'label', itemId: 'lblSheetFileName', text: '' },
                    { xtype: 'label', text: 'Sheet (Tab):', margin: '4 5 5 5' },
                    {
                        xtype: 'combobox',
                        itemId: 'cbxTabList',
                        name: 'cbxTabList',
                        forceSelection: true,
                        store: {
                            type: 'webapi',
                            api: {
                                read: 'api/WebAPIReport/ExcelTabList'
                            },
                            autoLoad: true,
                            listeners: {
                                beforeload: function (store, operation, eOpts) {
                                    store.getProxy().extraParams = {
                                        Filename: ImportExcelSCls.getTargetPath()
                                    };
                                }
                            }
                        },
                        valueField: 'TABLE_NAME',
                        displayField: 'TABLE_NAME',
                        typeAhead: true,
                        allowBlank: false,
                        width: 225

                    }, {
                        xtype: 'button', itemId: 'btnOkSS', text: 'Ok', width: 70, margin: '4 5 5 10'
                    }, {
                        xtype: 'button', itemId: 'btnCancelSS', text: 'Cancel', width: 70, margin: '4 5 5 10'
                    }
                ]
            }
    ]
});