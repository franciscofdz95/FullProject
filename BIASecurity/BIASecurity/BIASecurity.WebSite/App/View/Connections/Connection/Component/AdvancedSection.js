Ext.define('App.View.Connections.Connection.Component.AdvancedSection', {
    extend: 'App.View.Connections.Component.FieldContainer',
    alias: 'widget.App-View-Connections-Connection-Component-AdvancedSection',
    //plugins: { ptype: 'borderfloatingtitle', position: 't', titleConfig: 'Advanced' },
    cls: 'connectionsConnectionComponentAdvancedsection',
    layout: {
        type: 'vbox',
        align: 'stretch',
        pack: 'start'
    },
    
    items: [
        { plugins: { ptype: 'borderfloatingtitle', position: 't', titleConfig: 'Advanced' } },
        { xtype: 'checkbox', itemId: 'IncludeProvider', fieldLabel: 'Include Provider', plugins: { ptype: 'componentstorebind', dataField: 'IncludeProvider' } },
        { xtype: 'connectionsTextfield', itemId: 'ProviderOverride', fieldLabel: 'Provider Override', plugins: { ptype: 'componentstorebind', dataField: 'ProviderOverride' } },
    ]
});