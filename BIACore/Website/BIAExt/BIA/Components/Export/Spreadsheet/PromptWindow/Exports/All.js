Ext.define('BIA.Components.Export.Spreadsheet.PromptWindow.Exports.All', {
    extend: (Ext.platformTags && Ext.platformTags.modern) ? 'Ext.Container' : 'Ext.container.Container',
    alias: 'widget.BIA-Components-Export-Spreadsheet-PromptWindow-Exports-All',
    xtype: 'exportSpreadsheetPromptWindowExportsAll',

    layout: {
        type: 'vbox',
        align: 'middle',
        pack: 'start'
    },

    padding: '5 10 10',

    items: [
        {
            xtype: 'container',
            html: 'Export all matching rows'
        },
        {
            xtype: 'container',
            html: 'using Basic Formatting'
        },
        {
            xtype: 'container',
            html: '&nbsp;'
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
                { xtype: 'button', text: 'Export All', itemId: 'AllExportButton' },
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