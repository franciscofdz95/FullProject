Ext.define('BIA.Components.Export.Spreadsheet.PromptWindow.Options.Exports', {
    extend: (Ext.platformTags && Ext.platformTags.modern) ? 'Ext.Container' : 'Ext.container.Container',
    alias: 'widget.BIA-Components-Export-Spreadsheet-PromptWindow-Options-Exports',
    xtype: 'exportSpreadsheetPromptWindowExports',

    padding: '10 0',

    layout: {
        type: 'hbox',
        align: 'stretch',
        pack: 'center'
    },

    defaults: {
        style: {
            lineHeight: '25px'
        }
    },

    items: [
        { xtype: 'exportSpreadsheetPromptWindowExportsFormatted', flex: 1 },
        { xtype: 'container', itemId: 'exportTypeDivider', width: '2px', style: { backgroundColor: '#908474' } },
        { xtype: 'exportSpreadsheetPromptWindowExportsAll', flex: 1 }
    ]
});