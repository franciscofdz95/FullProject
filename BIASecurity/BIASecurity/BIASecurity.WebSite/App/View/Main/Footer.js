Ext.define('App.View.Main.Footer', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.App-View-Main-Footer',
    xtype: 'appFooter',
    height: 16,
    items: [
        {
            xtype: 'container',
            layout: {
                type: 'vbox',
                align: 'center'
            },
            style: {
                backgroundColor: '#D4CCBF',
                fontSize: '11px',
                borderTop: '#60513A 1px solid'
            },
            defaults: { padding: '0 2 4 2' },
            layoutConfig: {
                align: 'center'
            },
            items: [
                {
                    xtype: 'label',
                    html: 'Copyright &copy; ' + (new Date()).getFullYear() + ', United Parcel Service of America, Inc. All Rights Reserved.'
                }
            ]

        }
    ]
});