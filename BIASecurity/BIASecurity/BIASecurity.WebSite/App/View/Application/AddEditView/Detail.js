Ext.define('App.View.Application.AddEditView.Detail', {
    extend: 'Ext.container.Container',
    alias: 'widget.App-View-Application-AddEditView-Detail',

    cls: 'applicationAddeditviewDetail',
    layout: 'fit',
    //scrollable: true,
    items: [
        { xtype: 'App-View-Application-AddEditView-Detail-View', itemId: 'Detail' }
    ]
});