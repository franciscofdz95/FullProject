Ext.define('BIA.Components.Export.Spreadsheet.QuickExcelButton', {
    extend: (Ext.platformTags && Ext.platformTags.modern) ? 'Ext.Button' : 'Ext.button.Button',
    alias: 'widget.BIA-Components-Export-Spreadsheet-QuickExcelButton',
    xtype: 'spreadsheetQuickExcelButton',
    text: 'Export Excel'
});