Ext.define('App.View.Admin.ComponentCatalog.CardFlip.Card3Front', {
    extend: 'Ext.container.Container',
    alias: 'widget.App-View-Admin-ComponentCatalog-CardFlip-Card3Front',
     
    layout: {
        type: 'hbox',
        align: 'stretch',
        pack: 'center'
    },
    flex: 1,
    //width: 300,
    items: [{ xtype: 'statuspie', cls: 'Card3FrontChart' }]
});