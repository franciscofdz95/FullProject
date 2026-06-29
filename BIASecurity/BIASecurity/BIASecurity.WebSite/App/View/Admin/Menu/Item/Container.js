Ext.define('App.View.Admin.Menu.Item.Container', {
    extend: 'Ext.container.Container',
    alias: 'widget.App-View-Admin-Menu-Item-Container',
    xtype: 'adminMenuItem',
    cls: 'AdminMenuItem',
    //margin: '2 5 2 10',
    //style:{
    //    cursor: 'pointer',
    //    backgroundColor: '',
    //    //borderRadius: '10px',
    //    border: 'solid #AAA 2px'
    //},
    //padding: 4,

    bind: {
        html: '{menuItemText}'
    }
});