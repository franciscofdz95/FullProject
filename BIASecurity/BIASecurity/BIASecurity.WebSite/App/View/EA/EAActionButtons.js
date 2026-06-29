Ext.define('App.View.EA.EAActionButtons', {
    extend: 'Ext.Container',
    alias: 'widget.App-View-EA-EAActionButtons',
    itemId: 'EAActionButtonsPanelId',
    minWidth: 1280,
    bodyPadding: 20,
    layout: 'center',
    items: [               
          {
            xtype: 'panel',
            layout: 'hbox',
            align: 'middle',
            defaults: {
                xtype: 'button',
                buttonAlign: 'center',
                width: 70,
                margin: '5 5 5 5',
                padding: '5 5 5 5'
            },
            items: [
                { xtype: 'button',  itemId: 'btnEASave', text: 'Save'   },
                { xtype: 'button',  itemId: 'btnEACancel', text: 'Cancel' }
            ]
        }
     ] 
});