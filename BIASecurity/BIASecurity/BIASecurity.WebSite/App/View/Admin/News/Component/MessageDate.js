Ext.define('App.View.Admin.News.Component.MessageDate', {
    extend: 'App.View.Connections.Component.FieldContainer',
    alias: 'widget.App-View-Admin-News-Component-MessageDate',
    layout: {
        type: 'hbox',
        align: 'middle',
        pack: 'start'
    },
    items: [
        {
            xtype: 'datefield', itemId: 'MessageDate', fieldLabel: 'Date', width:'20px',
            plugins: { ptype: 'componentstorebind', dataField: 'MessageDateDisplay' }
        }
    ]
});