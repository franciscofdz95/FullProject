Ext.define('App.View.Application.AddEditView.Summary', {
    extend: 'Ext.container.Container',
    alias: 'widget.App-View-Application-AddEditView-Summary',

    cls: 'applicationAddeditviewSummary',
    layout: {
        type: 'vbox',
        align: 'stretch',
        pack: 'start'
    },
    store: {
        type: 'webapi',
        api: {
            read: 'api/BIASecurity/AppSummary'
        }
    },
    loadStoreOnInit: true,
    getAppOnStoreLoad: true,
    showFieldEditPencil: true,
    scrollable: true,
    defaults: { margin: '0 10 10' },
    items: [
        {
            xtype: 'container', layout: { type: 'hbox', align: 'stretch', pack: 'start' }, padding: '10 0 0', defaults: { margin: '0 10 0 0' },
            items: [
                {
                    xtype: 'textfield', fieldLabel: 'App Code', labelAlign: 'top', itemId: 'App_AppCode', margin: '0 10 0 0', labelWidth: 100, editable: false,
                    plugins: { ptype: 'componentstorebind', dataField: 'Application_Code' }
                },
                
                { xtype: 'tbfill', flex: 1 },
                {
                    xtype: 'textfield', fieldLabel: 'APRS App Key', labelAlign: 'top', itemId: 'App_APRSAppKey', editable: true,
                    plugins: { ptype: 'componentstorebind', dataField: 'APRSAppKey' }
                },
                { xtype: 'tbfill', flex: 1 },
                {
                    xtype: 'textfield', fieldLabel: 'APRS App Id', labelAlign: 'top', itemId: 'App_APRSAppId', editable: true,
                    plugins: { ptype: 'componentstorebind', dataField: 'APRSAppId' }
                }
            ]
        },
        {
            xtype: 'textfield', fieldLabel: 'Name', labelAlign: 'top', itemId: 'App_Name', editable: true,
            plugins: { ptype: 'componentstorebind', dataField: 'Application_Name' }
        },
        {
            xtype: 'textarea', fieldLabel: 'Description', labelAlign: 'top', itemId: 'App_Description', height: 102, emptyText: 'No Description',
            plugins: { ptype: 'componentstorebind', dataField: 'Description' }
        },
        {
            xtype: 'container', layout: { type: 'vbox', align: 'stretch', pack: 'start' }, padding: '10 0 0', flex: 1,
            items: [
                { xtype: 'App-View-Application-AddEditView-Summary-ContactsList' }
            ]
        }
    ]
});