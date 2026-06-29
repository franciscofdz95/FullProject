Ext.define('BIA.Components.Export.Spreadsheet.QuickCSVButton', {
    extend: (Ext.platformTags && Ext.platformTags.modern) ? 'Ext.Button' : 'Ext.button.Button',
    alias: 'widget.BIA-Components-Export-Spreadsheet-QuickCSVButton',
    xtype: 'spreadsheetQuickCSVButton',
    text: 'Export CSV'
});