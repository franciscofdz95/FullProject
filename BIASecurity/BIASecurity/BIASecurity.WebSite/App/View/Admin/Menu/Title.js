Ext.define('App.View.Admin.Menu.Title', {
    extend: 'Ext.container.Container',
    alias: 'widget.App-View-Admin-Menu-Title',
    xtype: 'adminMenuTitle',

    layout: {
        type: 'hbox',
        align: 'stretch',
        pack: 'center'
    },
    //margin: 5,
    style: {
        //borderBottom: 'solid #3892d3 2px'
        backgroundColor: '#3892d3',
        color: 'white'
    },

    items: [
        { xtype: 'tbfill', flex: 1 },
        { 
            xtype: 'container',
            style: {
                fontSize: '16px',
                fontWeight: 'bold'
            },
            margin: 10,
            html: 'Admin Tools'
        },
        { xtype: 'tbfill', flex: 1 }
    ]
});