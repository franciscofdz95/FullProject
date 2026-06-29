Ext.define('BIA.controller.ExportSpreadsheetPromptWindow', {
    extend: 'Ext.app.Controller',

    init: function () {
        this.control({
            'BIA-Components-Export-Spreadsheet-PromptWindow': {
                beforerender: this.PromptWindowBeforeRender,
                boxready: this.PromptWindowBoxReady
            },
            'BIA-Components-Export-Spreadsheet-PromptWindow-Exports-Formatted #FormattedExportButton': {
                click: this.FormattedExportButtonClick
            },
            'BIA-Components-Export-Spreadsheet-PromptWindow-Exports-All #AllExportButton': {
                click: this.AllExportButtonClick
            },
            'exportSpreadsheetPromptWindowOptionsExportAll': {
                change: this.ExportAllColumnsChange
            }
        });
    },
    PromptWindowBeforeRender: function PromptWindowBeforeRender(me, eOpts) {
        if (me.allowAllColumns) me.down('exportSpreadsheetPromptWindowOptionsExportAll').show();
        if (me.allowCSV) me.down('exportSpreadsheetPromptWindowOptionsExportCSV').show();
        if (!me.allowAllColumns && !me.allowCSV) me.down('exportSpreadsheetPromptWindowOptions').hide();

        if (!me.showExportAll) {
            me.down('#exportTypeDivider').hide();
            me.down('exportSpreadsheetPromptWindowExportsAll').hide();
        }

        if (me.quickExcel != null || me.quickCSV != null) {
            me.down('exportSpreadsheetPromptWindowExportsFormatted').hide();
            me.down('#exportTypeDivider').hide();
            me.down('exportSpreadsheetPromptWindowExportsAll').hide();
            me.down('exportSpreadsheetPromptWindowOptions').hide();
        }
    },
    PromptWindowBoxReady: function PromptWindowBoxReady(me, eOpts) {
        if (me.quickExcel != null || me.quickCSV != null) {
            var message = me.down('exportSpreadsheetPromptWindowMessage');
            var maxRecords = (me.quickExcel != null && Ext.isObject(me.quickExcel) && me.quickExcel.maxRecords != null)
                                ? me.quickExcel.maxRecords
                                : ((me.quickCSV != null && Ext.isObject(me.quickCSV) && me.quickCSV.maxRecords != null) ? me.quickCSV.maxRecords : null);

            if (message && maxRecords != null) {
                message.setConfig('html', message.html + '  ' + maxRecords + ' max records to export.');
            }

            if (!me.isMasked()) me.mask('Exporting');


            Ext.defer(function () {
                var exportResult = null,
                    exportConfig = {
                        filename: me.fileName,
                        store: me.viewStore,
                        columns: null,
                        exportCount: me.quickExcel.maxRecords,
                        dataTypeFormats: null,
                        columnDefinitionId: me.buttonId,
                        allColumns: false,
                        sheetTitle: me.sheetTitle,
                        filterDisplay: me.filterDisplay,
                        wrapHeaderText: me.wrapHeaderText,
                        customExcelStyles: me.customExcelStyles
                    };
                //var filterDisplay = me.filterDisplay != null && Ext.isFunction(me.filterDisplay) ? me.filterDisplay.apply(Ext.ComponentQuery.query('#' + me.buttonId)[0]) : null;

                if (me.quickExcel != null) {
                    if (Ext.isObject(me.quickExcel) && me.quickExcel.lockExportType == 'Formatted') {
                        if (Ext.isObject(me.quickExcel) && me.quickExcel.maxRecords != null) {                            
                            exportResult = BIA.Components.Export.SpreadsheetInterface.ExportExcelFormatted(Ext.apply(exportConfig, {}));
                        }
                        else {
                            exportResult = BIA.Components.Export.SpreadsheetInterface.ExportExcelFormatted(Ext.apply(exportConfig, {
                                exportCount: me.getFormattedRecordCount()
                            }));
                        }
                    }
                    else {
                        if (Ext.isObject(me.quickExcel) && me.quickExcel.maxRecords != null) {
                            BIA.Components.Export.SpreadsheetInterface.ExportExcelBulk(Ext.apply(exportConfig, {}));
                        }
                        else {
                            BIA.Components.Export.SpreadsheetInterface.ExportExcelBulk(Ext.apply(exportConfig, {
                                exportCount: null
                            }));
                        }
                    }
                }

                if (me.quickCSV != null) {
                    if (Ext.isObject(me.quickCSV) && me.quickCSV.lockExportType == 'Formatted') {
                        if (Ext.isObject(me.quickCSV) && me.quickCSV.maxRecords != null) {
                            exportResult = BIA.Components.Export.SpreadsheetInterface.ExportCSVFormatted(Ext.apply(exportConfig, {
                                exportCount: me.quickCSV.maxRecords
                            }));
                        }
                        else {
                            exportResult = BIA.Components.Export.SpreadsheetInterface.ExportCSVFormatted(Ext.apply(exportConfig, {
                                exportCount: me.getFormattedRecordCount()
                            }));
                        }
                    }
                    else {
                        if (Ext.isObject(me.quickCSV) && me.quickCSV.maxRecords != null) {
                            BIA.Components.Export.SpreadsheetInterface.ExportCSVBulk(Ext.apply(exportConfig, {}));
                        }
                        else {
                            BIA.Components.Export.SpreadsheetInterface.ExportCSVBulk(Ext.apply(exportConfig, {
                                exportCount: null
                            }));
                        }
                    }
                }

                //TODO: Handle exportResult return of error


                if (exportResult || exportResult == null) me.close();
            }, 10, this);
        }
    },
    FormattedExportButtonClick: function FormattedExportButtonClick(me, event, eOpts) {
        var win = me.up('exportSpreadsheetPromptWindow');
        if (win) {
            if (!win.isMasked()) win.mask('Exporting');

            Ext.defer(function () {
                var exportResult = null,
                    exportConfig = {
                        filename: win.fileName,
                        store: win.viewStore,
                        columns: null,
                        exportCount: win.getFormattedRecordCount(),
                        dataTypeFormats: null,
                        columnDefinitionId: win.buttonId,
                        allColumns: true,
                        sheetTitle: win.sheetTitle,
                        filterDisplay: win.filterDisplay,
                        wrapHeaderText: win.wrapHeaderText,
                        customExcelStyles: win.customExcelStyles
                    };
                //var filterDisplay = win.filterDisplay != null && Ext.isFunction(win.filterDisplay) ? win.filterDisplay() : null;
                if (win.useCSV && win.useCSV()) {
                    if (win.useAllColumns && win.useAllColumns()) {
                        exportResult = BIA.Components.Export.SpreadsheetInterface.ExportCSVFormatted(Ext.apply(exportConfig, {}));
                    }
                    else {
                        exportResult = BIA.Components.Export.SpreadsheetInterface.ExportCSVFormatted(Ext.apply(exportConfig, {
                            allColumns: false
                        }));
                    }
                }
                else {
                    if (win.useAllColumns && win.useAllColumns()) {
                        exportResult = BIA.Components.Export.SpreadsheetInterface.ExportExcelFormatted(Ext.apply(exportConfig, {}));
                    }
                    else {
                        exportResult = BIA.Components.Export.SpreadsheetInterface.ExportExcelFormatted(Ext.apply(exportConfig, {
                            allColumns: false
                        }));
                    }
                }

                //TODO: Handle exportResult return of error


                if (exportResult) win.close();
            }, 10, this);
        }
        //TODO: Handle no window ref error
    },
    AllExportButtonClick: function AllExportButtonClick(me, event, eOpts) {
        var win = me.up('exportSpreadsheetPromptWindow');
        if (win) {
            if (!win.isMasked()) win.mask('Exporting');

            Ext.defer(function () {
                var exportResult = null,
                    exportConfig = {
                        filename: win.fileName,
                        store: win.viewStore,
                        columns: null,
                        exportCount: null,
                        dataTypeFormats: null,
                        columnDefinitionId: win.buttonId,
                        allColumns: true,
                        sheetTitle: win.sheetTitle,
                        filterDisplay: win.filterDisplay,
                        wrapHeaderText: win.wrapHeaderText,
                        customExcelStyles: win.customExcelStyles
                    };
                //var filterDisplay = win.filterDisplay != null && Ext.isFunction(win.filterDisplay) ? win.filterDisplay() : null;
                if (win.useCSV && win.useCSV()) {
                    if (win.useAllColumns && win.useAllColumns()) {
                        exportResult = BIA.Components.Export.SpreadsheetInterface.ExportCSVBulk(Ext.apply(exportConfig, {}));
                    }
                    else {
                        exportResult = BIA.Components.Export.SpreadsheetInterface.ExportCSVBulk(Ext.apply(exportConfig, {
                            allColumns: false
                        }));
                    }
                }
                else {
                    if (win.useAllColumns && win.useAllColumns()) {
                        exportResult = BIA.Components.Export.SpreadsheetInterface.ExportExcelBulk(Ext.apply(exportConfig, {}));
                    }
                    else {
                        exportResult = BIA.Components.Export.SpreadsheetInterface.ExportExcelBulk(Ext.apply(exportConfig, {
                            allColumns: false
                        }));
                    }
                }

                //TODO: Handle exportResult return of error


                Ext.defer(function () { win.close(); }, 100, this);
            }, 10, this);
        }
        //TODO: Handle no window ref error
    },
    ExportAllColumnsChange: function ExportAllColumnsChange(me, newValue, oldValue, eOpts) {
        var win = me.up('exportSpreadsheetPromptWindow');
        if(win) {
            var winMsg = win.down('exportSpreadsheetPromptWindowMessage');
            if (winMsg) winMsg.setConfig('html',newValue == true ? winMsg.allColumnMsg : winMsg.visibleColumnMsg);
        }
    }
});