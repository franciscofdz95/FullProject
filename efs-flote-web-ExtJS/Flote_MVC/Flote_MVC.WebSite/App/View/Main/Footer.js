Ext.define('App.View.Main.Footer', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.App-View-Main-Footer',
    height: 40,
    layout: {
        type: 'vbox'
    },
    items: [
          {
              xtype: 'label',
              margin: '0 0 0 5',
              align: 'left',
              html: '<div style="font:bold;"><b>Note(s):</b> FLOTE does not reflect the same complete financial period as GPR, Khalix or other financial reports.</div> '
          },
         {
             xtype: 'container',
             width: '100%',
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