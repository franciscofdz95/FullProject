Ext.define('App.View.Admin.ComponentCatalog.CardFlip.Card2Back', {
    extend: 'Ext.container.Container',
    alias: 'widget.App-View-Admin-ComponentCatalog-CardFlip-Card2Back',
    flex: 1,

    layout: {
        type: 'vbox',
        align: 'stretch',
        pack: 'start'
    },

    items: [
        {
            xtype: 'container',
            padding: 5,
            style: {
                backgroundColor: '#B0A696',
                borderRadius: '5px',
                fontSize: '16px',
                fontWeight: 'bold'
            },
            layout: {
                type: 'hbox',
                align: 'stretch',
                pack: 'center'
            },
            items: [
                { xtype: 'tbfill', flex: 1 },
                { xtype: 'container', html: 'User Detail' },
                { xtype: 'tbfill', flex: 1 }
            ]
        },
        {
            xtype: 'container',
            layout: 'column',
            defaults: {
                columnWidth: .33,
                margin: '10 0 0'
            },
            items: [
                { xtype: 'textfield', value: 'New', fieldLabel: 'First Name', disabled: true },
                { xtype: 'textfield', value: 'U', fieldLabel: 'Middle Initial', disabled: true },
                { xtype: 'textfield', value: 'Employee', fieldLabel: 'Last Name', disabled: true },
                { xtype: 'textfield', value: '123 Anywhere St', fieldLabel: 'Address', disabled: true, columnWidth: .5 },
                { xtype: 'textfield', value: 'YourTown', fieldLabel: 'City', disabled: true, columnWidth: .3 },
                { xtype: 'textfield', value: 'GA', fieldLabel: 'ST', disabled: true, columnWidth: .2 },
                { xtype: 'textfield', value: '123-456-7890', fieldLabel: 'Work Phone', disabled: true, columnWidth: .25 },
                { xtype: 'textfield', value: '234-567-8901', fieldLabel: 'Home Phone', disabled: true, columnWidth: .25 },
                { xtype: 'textfield', value: 'nemployee@ups.com', fieldLabel: 'Email', disabled: true, columnWidth: .5 }
            ]
        }
    ]
});