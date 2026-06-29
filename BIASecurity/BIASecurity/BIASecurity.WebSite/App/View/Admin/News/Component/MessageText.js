Ext.define('App.View.Admin.News.Component.MessageText', {
    extend: 'App.View.Connections.Component.FieldContainer',
    alias: 'widget.App-View-Admin-News-Component-MessageText',
    layout: {
        type: 'hbox',
        align: 'middle',
        pack: 'start'
    },

    items: [
        {
            xtype: 'newsTextfield', itemId: 'MessageText', fieldLabel: 'Message', flex: 1,
            plugins: { ptype: 'componentstorebind', dataField: 'MessageText' }
        }       
    ]
});