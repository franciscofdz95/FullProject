Ext.define('App.View.Application.AddEditView', {
    extend: 'Ext.container.Container',
    alias: 'widget.App-View-Application-AddEditView',

    cls: 'applicationAddeditview',
    layout: {
        type: 'vbox',
        align: 'stretch',
        pack: 'start'
    },
    appCode: null,

    items: [
        { xtype: 'App-View-Application-AddEditView-Title' },
        {
            xtype: 'tabpanel',
            itemId: 'appAddViewEditTabPanel',
            flex: 1,
            items: [
                { xtype: 'App-View-Application-AddEditView-Summary', title: 'Summary' },
                { xtype: 'App-View-Application-AddEditView-Detail', title: 'Detail', requiredAccess: 'SA' }, 
                { xtype: 'App-View-Application-AddEditView-AccessGeos', title: 'Access Geos', requiredAccess: 'SA' }, 
                { xtype: 'App-View-Application-AddEditView-Access', title: 'Access' }
                //{ xtype: 'App-View-Application-AddEditView-Connections', title: 'Connections' }
            ]
        },
        { xtype: 'App-View-Component-ButtonContainer', title: 'Buttons', show_delete: false }
    ]
});