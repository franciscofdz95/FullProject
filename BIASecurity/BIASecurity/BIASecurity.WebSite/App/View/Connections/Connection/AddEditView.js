Ext.define('App.View.Connections.Connection.AddEditView', {
    extend: 'App.View.Connections.Component.AddEditViewWindow',
    alias: 'widget.App-View-Connections-Connection-AddEditView',

    title: 'Connection',
    cls: 'connectionsConnectionAddeditview',
    ConnectionId: null,
    store: { type: 'webapi', api: { read: 'api/BIASecurity/ConnectionInfo' } },
    environmentMismatchTest: {
        PROD: { tests: ['_dev', '_qa'], match: true },
        DEV: { tests: ['_dev'], match: false },
        QA: { tests: ['_qa'], match: false }
    },
    items: [
        { xtype: 'App-View-Connections-Connection-Component-ConnectionIdDisplay' },
        { xtype: 'App-View-Connections-Connection-Component-AppCodeSelect' },
        { xtype: 'App-View-Connections-Connection-Component-ConnectionNameEntry' },
        { xtype: 'App-View-Connections-Component-EnvironmentSelect' },
        { xtype: 'App-View-Connections-Connection-Component-ServerSelect' },
        { xtype: 'App-View-Connections-Connection-Component-DatabaseSelect' },
        { xtype: 'App-View-Connections-Connection-Component-LoginSelect' },
        { xtype: 'App-View-Connections-Connection-Component-EnvironmentMismatchErrorText', hidden: true },
        { xtype: 'App-View-Connections-Connection-Component-TechnologySelect' },
        { xtype: 'App-View-Connections-Connection-Component-RawFlag', value: false },
        { xtype: 'App-View-Connections-Component-ActiveFlag', value: true },
        { xtype: 'App-View-Connections-Connection-Component-AdvancedSection' },
        { xtype: 'connectionsAddEditButtonContainer', show_delete:true }
    ]
});