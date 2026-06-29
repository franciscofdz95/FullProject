Ext.define('App.View.Component.List.Item.Usage.TypeToggle', {
    extend: 'Ext.button.Segmented',
    alias: 'widget.App-View-Component-List-Item-Usage-TypeToggle',

    cls: 'componentListItemUsageTypetoggle',
    defaults: { padding: '5 5 3' },
    items: [
        { iconCls: 'fa fa-heartbeat', tooltip: 'Hits', pressed: true },
        { iconCls: 'fa fa-users', tooltip: 'Logins' },
        { iconCls: 'fa fa-exclamation-triangle', tooltip: 'Errors' }
    ]
});