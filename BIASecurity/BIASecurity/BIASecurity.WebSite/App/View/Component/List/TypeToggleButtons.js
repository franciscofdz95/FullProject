Ext.define('App.View.Component.List.TypeToggleButtons', {
    extend: 'Ext.container.Container',
    alias: 'widget.App-View-Component-List-TypeToggleButtons',

    cls: 'appViewComponentListTypetogglebuttons',
    layout: {
        type: 'hbox',
        align: 'stretch',
        pack: 'begin'
    },
    hideGridView: false,
    hideListView: false,
    hideDetailView: false,
    items: [
        { xtype: 'label', text: 'Views:', margin: '0 10 0 0', cls: 'ListTypeToggleButtonLabel' },
        {
            xtype: 'segmentedbutton',
            itemId: 'ListTypeToggleButtonViewToggle',
            defaults: { padding: '0 5 2 0', height: 28, width: 28, margin: 0 },
            items: [
                {
                    iconCls: 'fa fa-th',
                    tooltip: 'Grid View',
                    xtypeProperty: 'gridItemXtype',
                    hideProperty: 'hideGridView'
                },
                {
                    iconCls: 'fa fa-align-justify',
                    tooltip: 'List View',
                    xtypeProperty: 'listItemXtype',
                    hideProperty: 'hideListView'
                },
                {
                    iconCls: 'fa fa-server',
                    tooltip: 'Detail View',
                    xtypeProperty: 'detailItemXtype',
                    hideProperty: 'hideDetailView'
                }
            ]
        }
    ]
});