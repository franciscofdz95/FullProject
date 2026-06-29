Ext.define('BIA.Components.Export.Spreadsheet.PromptWindow.Options.ExportCSV', {
    extend: (Ext.platformTags && Ext.platformTags.modern) ? 'Ext.field.Checkbox' : 'Ext.form.field.Checkbox',
    alias: 'widget.BIA-Components-Export-Spreadsheet-PromptWindow-Options-ExportCSV',
    xtype: 'exportSpreadsheetPromptWindowOptionsExportCSV',
    boxLabel: 'Export as CSV',
    hidden: true,
    fieldStyle: 'margin-top: 7px;'
});