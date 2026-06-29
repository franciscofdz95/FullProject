Ext.define('App.View.Access.ActionWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.App-View-Access-ActionWindow',

    cls: 'accessActionwindow',
    layout: {
        type: 'vbox',
        align: 'stretch',
        pack: 'start'
    },
    modal: true,
    bodyPadding: 10,
    width: 725,
    scrollable: true,

    defaults: {
        margin: '5 0 0 0'
    },
    items: [
        { xtype: 'label', style: { fontSize: '20px', fontWeight: 'bold' }, margin: 0, html: 'User' },
        { xtype: 'App-View-Access-ActionWindow-User' },
        { xtype: 'label', style: { fontSize: '20px', fontWeight: 'bold' }, html: 'Request' },
        {
            xtype: 'container',
            layout: {
                type: 'column'
            },
            defaults: {
                labelWidth: 80,
                minHeight: 25,
                padding: '5 5',
                columnWidth: 0.33
            },
            items: [
                { xtype: 'displayfield', fieldLabel: 'Application', dataField: 'AppName', columnWidth: 0.66, labelAlign: 'top' },
                { xtype: 'displayfield', fieldLabel: 'Access Level', dataField: 'AccessLevel', columnWidth: 0.34, labelAlign: 'top' },
                { xtype: 'displayfield', fieldLabel: 'Bus. Unit', dataField: 'BusinessUnit' },
                { xtype: 'displayfield', fieldLabel: 'Geo Group', dataField: 'GeoGroupCode' },
                { xtype: 'displayfield', fieldLabel: 'Geo', dataField: 'GeoCode' },
                { xtype: 'displayfield', fieldLabel: 'Geo ID', dataField: 'GeoId', columnWidth: .34 },
                { xtype: 'displayfield', fieldLabel: 'Geo Name', dataField: 'GeoName', columnWidth: .67 },
                { xtype: 'displayfield', fieldLabel: 'Request Reason', dataField: 'RequestReason', hideOnNull: true, columnWidth: 1, labelAlign: 'top' }
            ]
        },
        { xtype: 'container', style: { borderTop: '1px black solid' }, margin: '10 0 0 0' },
        { xtype: 'label', itemId: 'actionMessage', margin: '10 0 0 0' },
        {
            xtype: 'textfield',
            itemId: 'reasonField',
            fieldLabel: 'Reason',
            labelAlign: 'top',
            allowBlank: false
        }
    ],
    buttons: [
        { itemId: 'confirmButton' },
        { itemId: 'cancelButton', text: 'Cancel' }
    ]
});