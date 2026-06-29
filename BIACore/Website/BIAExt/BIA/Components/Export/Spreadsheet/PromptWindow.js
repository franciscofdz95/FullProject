Ext.define('BIA.Components.Export.Spreadsheet.PromptWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.BIA-Components-Export-Spreadsheet-PromptWindow',
    xtype: 'exportSpreadsheetPromptWindow',
    title: 'Spreadsheet Export Options',
    
    draggable: false,
    resizable: false,
    modal: true,
    storeRecords: 1000,
    maxRecords: BIA.Components.Export.SpreadsheetInterface.MAX_FORMATTED_RECORDS,
    

    allowAllColumns: true,
    allowCSV: true,

    viewModel: {
        formulas: {
            getStoreRecords: function (get) {
                var storeRecords = this.getView().storeRecords;
                var maxRecords = this.getView().maxRecords;
                if (storeRecords < maxRecords) return storeRecords;
                else return maxRecords;
            },
            getMaxRecords: function (get) {
                return this.getView().maxRecords;
            }
        }
    },

    layout: {
        type: 'vbox',
        align: 'stretch',
        pack: 'start'
    },

    style: {
        backgroundColor: '#ebebe6'
    },
    padding: 10,
    bodyStyle: {
        border: 'none',
        backgroundColor: '#ebebe6'
    },

    defaults: {
        style: {
            fontSize: '18px'
        }
    },

    items: [
        //{ xtype: 'exportSpreadsheetPromptWindowTitle' },
        { xtype: 'exportSpreadsheetPromptWindowMessage' },
        { xtype: 'exportSpreadsheetPromptWindowOptions' },
        { xtype: 'tbfill', height: 2, style: { backgroundColor: '#908474' } },
        { xtype: 'exportSpreadsheetPromptWindowExports' }
    ],

    constructor: function () {
        var me = this;

        this.cls = (this.cls != null ? this.cls + ' ' : '') + 'BIAExportSpreadsheetPromptWindow';

        this.useAllColumns = function useAllColumns() {
            return me.forceAllColumnns === true ? true : me.down('exportSpreadsheetPromptWindowOptionsExportAll').getValue();
        };
        this.useCSV = function useCSV() {
            return me.down('exportSpreadsheetPromptWindowOptionsExportCSV').getValue();
        };
        this.getFormattedRecordCount = function getFormattedRecordCount() {
            return me.down('exportSpreadsheetPromptWindowExportsFormatted numberfield').getValue() || 0;
        }

        this.callParent(arguments);
    }
});