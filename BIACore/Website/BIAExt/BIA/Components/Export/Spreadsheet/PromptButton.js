Ext.define('BIA.Components.Export.Spreadsheet.PromptButton', {
    extend: (Ext.platformTags && Ext.platformTags.modern) ? 'Ext.Button' : 'Ext.button.Button',
    alias: 'widget.BIA-Components-Export-Spreadsheet-PromptButton',
    xtype: 'spreadsheetExportButton',
    text: 'Export Spreadsheet'
});