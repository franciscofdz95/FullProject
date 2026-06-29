Ext.define('BIA.Components.Export.Spreadsheet.PromptWindow.Exports.Formatted', {
    extend: (Ext.platformTags && Ext.platformTags.modern) ? 'Ext.Container' : 'Ext.container.Container',
    alias: 'widget.BIA-Components-Export-Spreadsheet-PromptWindow-Exports-Formatted',
    xtype: 'exportSpreadsheetPromptWindowExportsFormatted',

    layout: {
        type: 'vbox',
        align: 'middle',
        pack: 'start'
    },

    padding: '5 10 10',

    items: [
        {
            xtype: 'container',
            layout: {
                type: 'hbox',
                align: 'stretch',
                pack: 'start'
            },
            items: [
                {
                    xtype: 'container',
                    html: 'Export top'
                },
                {
                    xtype: 'numberfield',
                    minValue: 1,
                    bind: {
                        maxValue: '{getStoreRecords}',
                        value: '{getStoreRecords}'
                    },
                    margin: '0 5',
                    width: 75
                },
                {
                    xtype: 'container',
                    html: 'rows'
                }
            ]
        },
        {
            xtype: 'container',
            html: 'using Advanced Formatting'
        },
        {
            xtype: 'container',
            bind: {
                html: '(max {getMaxRecords} rows)'
            }
        },
        {
            xtye: 'container',
            layout: {
                type: 'hbox',
                align: 'stretch',
                pack: 'center'
            },
            margin: '20 0 0',
            style: {
                borderColor: 'ebebe6',
                backgroundColor: '#ebebe6'
            },
            bodyStyle: {
                border: 'none',
                backgroundColor: '#ebebe6'
            },
            
            items: [
                {
                    xtype: 'tbfill',
                    flex: 1,
                    style: {
                        borderColor: 'ebebe6',
                        backgroundColor: '#ebebe6'
                    }
                },
                { xtype: 'button', text: 'Export', itemId: 'FormattedExportButton' },
                {
                    xtype: 'tbfill',
                    flex: 1,
                    style: {
                        borderColor: 'ebebe6',
                        backgroundColor: '#ebebe6'
                    }
                }
            ]
        }
    ]
});