Ext.define('App.View.Admin.News.Component.ActiveFlag', {
    extend: 'App.View.Connections.Component.FieldContainer',
    alias: 'widget.App-View-Admin-News-Component-ActiveFlag',
    layout: {
        type: 'hbox',
        align: 'stretch',
        pack: 'start'
    },

    items: [
        {
            xtype: 'checkbox', itemId: 'Active', fieldLabel: 'Active', value: true,
            plugins: { ptype: 'componentstorebind', dataField: 'Active' }
        }
    ]
});