Ext.define('App.View.Access.List.ItemDetail.ValueContainer', {
    extend: 'Ext.container.Container',
    alias: 'widget.App-View-Access-List-ItemDetail-ValueContainer',

    cls: 'accessListItemdetailValuecontainer', 
    layout: { 
        type: 'hbox', 
        align: 'stretch', 
        pack: 'center' 
    }, 
    showOnHeader: false, 
    padding: '0 2'
});