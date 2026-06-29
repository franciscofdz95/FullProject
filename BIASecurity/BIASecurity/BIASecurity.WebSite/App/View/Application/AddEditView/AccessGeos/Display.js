Ext.define('App.View.Application.AddEditView.AccessGeos.Display', {
    extend: 'Ext.container.Container',
    alias: 'widget.App-View-Application-AddEditView-AccessGeos-Display',

    cls: 'applicationAddeditviewAccessgeosDisplay ChipSm',
    layout: {
        type: 'hbox',
        align: 'stretch',
        pack: 'start'
    },
    margin: '1',
    defaults: { margin: '4 2 0 0' },
    items: [
        { xtype: 'checkbox', dataField: 'Selected', margin: '0 2 0 0' },
        { xtype: 'label', dataField: 'businessUnitName' },
        { xtype: 'label', dataField: 'businessUnitId' },
        //{ xtype: 'label', text: ': ' },
        { xtype: 'label', dataField: 'geoGroupName' },
        { xtype: 'label', dataField: 'geoGroupCode' },
        { xtype: 'label', dataField: 'geoCode' },
        { xtype: 'label', dataField: 'geoCodeName' }
        
    ]
});