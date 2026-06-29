Ext.define('App.View.Admin.ComponentCatalog.Container', {
    extend: 'Ext.container.Container',
    alias: 'widget.App-View-Admin-ComponentCatalog-Container',
    class: 'ComponentCatalogContainer',

    //biaPageView: true,
    //biaPageViewTitle: 'Component Catalog',

    layout: {
        type: 'vbox',
        align: 'stretch',
        pack: 'start'
    },
    items: [
        {
            xtype: 'container', html: 'BIACore Component Catalog'
        },
        {
            xtype: 'container',
            flex: 1,
            layout: 'column',
            defaults: { 
                columnWidth: .25,
                height: 500
            },
            items: [
                {
                    xtype: 'cardflip',
                    frontItems: [{ xtype: 'App-View-Admin-ComponentCatalog-CardFlip-Card1Front' }],
                    backItems: [{ xtype: 'App-View-Admin-ComponentCatalog-CardFlip-Card1Back' }]
                },
                {
                    xtype: 'cardflip',
                    frontItems: [{ xtype: 'App-View-Admin-ComponentCatalog-CardFlip-Card2Front' }],
                    backItems: [{ xtype: 'App-View-Admin-ComponentCatalog-CardFlip-Card2Back' }]
                },
                {
                    xtype: 'cardflip',
                    frontItems: [{ xtype: 'App-View-Admin-ComponentCatalog-CardFlip-Card3Front' }],
                    backItems: [{ xtype: 'App-View-Admin-ComponentCatalog-CardFlip-Card3Back' }]
                },                
                { xtype: 'fusionchartsangulargauge' }
            ]
        }
    ]
});