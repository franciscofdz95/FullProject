Ext.define('BIA.controller.ExportSpreadsheetButtonContainer', {
    extend: 'Ext.app.Controller',

    init: function () {
        this.control({
            'BIA-Components-Export-Spreadsheet-ButtonContainer' : {
                added: this.ButtonContainerAdded
            },
            'BIA-Components-Export-Spreadsheet-PromptButton': {
                click: this.PromptButtonClick
            },
            'BIA-Components-Export-Spreadsheet-QuickExcelButton': {
                click: this.QuickExcelButtonClick
            },
            'BIA-Components-Export-Spreadsheet-QuickCSVButton': {
                click: this.QuickCSVButtonClick
            }
        });
    },
    ButtonContainerAdded: function ButtonContainerAdded(me, eOpts) {
        me.add(me.getVisibleButtons());
    },
    PromptButtonClick: function PromptButtonClick(me, event, eOpts) {
        this.ShowExportPrompt(me);
    },
    QuickExcelButtonClick: function QuickExcelButtonClick(me, event, eOpts) {
        this.ShowExportPrompt(me, true);
    },
    QuickCSVButtonClick: function QuickCSVButtonClick(me, event, eOpts) {
        this.ShowExportPrompt(me, false, true);
    },
    ShowExportPrompt: function ShowExportPrompt(me, quickExcel, quickCSV) {
        var config = me.up('spreadsheetExportButtonContainer');

        BIA.Components.Export.SpreadsheetInterface.setColumnDefinitions(config.getId(), config.getVisibleColumns(), config.getAllColumns());
        BIA.Components.Export.SpreadsheetInterface.setDefaultDataTypeFormats(config.getId(), config.getDataTypeDefaultFormats());
        var promptWindow = Ext.create({
            xtype: 'exportSpreadsheetPromptWindow',
            buttonId: config.getId(),
            storeRecords: config.getStoreRecordCounts(),
            maxRecords: config.getMaxRecords(),
            allowAllColumns: config.forceAllColumns ? false : config.allowAllColumns,
            allowCSV: config.allowCSV,
            forceAllColumns: config.forceAllColumns,
            fileName: config.getExportFileName(),
            sheetTitle: config.getSheetTitle(),
            viewStore: config.getExportViewComponentStore(),
            showExportAll: config.allowExportAllShow(),
            filterDisplay: config.showFilter && Ext.isFunction(config.getFilterDisplay) ? config.getFilterDisplay.apply(config) : null,
            wrapHeaderText: config.wrapHeaderText === false ? false : true,
            customExcelStyles: config.customExcelStyles,
            quickExcel: quickExcel && config.quickExcelButton != null ? (Ext.isObject(config.quickExcelButton) ? config.quickExcelButton : true) : null,
            quickCSV: quickCSV && config.quickCSVButton != null ? (Ext.isObject(config.quickCSVButton) ? config.quickCSVButton : true) : null
        });

        promptWindow.show();
    }
});