Ext.define('BIA.Components.Export.Spreadsheet.PromptWindow.Options.ExportAll', {
    extend: (Ext.platformTags && Ext.platformTags.modern) ? 'Ext.field.Checkbox' : 'Ext.form.field.Checkbox',
    alias: 'widget.BIA-Components-Export-Spreadsheet-PromptWindow-Options-ExportAll',
    xtype: 'exportSpreadsheetPromptWindowOptionsExportAll',
    boxLabel: 'Export all columns',
    hidden: true,
    fieldStyle: 'margin-top: 7px;'
});