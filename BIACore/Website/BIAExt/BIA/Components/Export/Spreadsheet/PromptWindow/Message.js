Ext.define('BIA.Components.Export.Spreadsheet.PromptWindow.Message', {
    extend: (Ext.platformTags && Ext.platformTags.modern) ? 'Ext.Container' : 'Ext.container.Container',
    alias: 'widget.BIA-Components-Export-Spreadsheet-PromptWindow-Message',
    xtype: 'exportSpreadsheetPromptWindowMessage',
    padding: '0 10',
    html: 'Export data using the current filters, visible columns and sort.',
    visibleColumnMsg: 'Export data using the current filters, visible columns and sort.',
    allColumnMsg: 'Export data using the current filters, all columns and sort.'
});