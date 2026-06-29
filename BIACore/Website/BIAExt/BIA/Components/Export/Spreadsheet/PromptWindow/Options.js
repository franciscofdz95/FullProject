Ext.define('BIA.Components.Export.Spreadsheet.PromptWindow.Options', {
    extend: (Ext.platformTags && Ext.platformTags.modern) ? 'Ext.Container' : 'Ext.container.Container',
    alias: 'widget.BIA-Components-Export-Spreadsheet-PromptWindow-Options',
    xtype: 'exportSpreadsheetPromptWindowOptions',

    layout: {
        type: 'hbox',
        align: 'middle',
        pack: 'start'
    },

    padding: '5 10',
    //style: {
    //    borderBottom: 'solid #908474 2px'
    //},

    defaults: {
        cls: 'PromptWindowOptionsCheckboxLabels'
    },

    items: [
        { xtype: 'tbfill', flex: 1 },
        { xtype: 'exportSpreadsheetPromptWindowOptionsExportAll', margin: '0 0 0 20' },
        { xtype: 'tbfill', flex: 1 },
        { xtype: 'exportSpreadsheetPromptWindowOptionsExportCSV', margin: '0 20 0 0' },
        { xtype: 'tbfill', flex: 1 }
    ]
});