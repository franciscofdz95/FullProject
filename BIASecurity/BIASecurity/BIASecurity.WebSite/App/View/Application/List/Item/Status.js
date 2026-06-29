Ext.define('App.View.Application.List.Item.Status', {
    extend: 'Ext.container.Container',
    alias: 'widget.App-View-Application-List-Item-Status',
    cls: 'ApplicationListStatus',
    layout: {
        type: 'hbox',
        align: 'stretch',
        pack: 'center'
    },
    items: [
        { xtype: 'App-View-Application-List-Item-Status-Online' },
        { xtype: 'App-View-Application-List-Item-Status-Visible' },
        { xtype: 'App-View-Application-List-Item-Status-Requestable' }
    ]
});