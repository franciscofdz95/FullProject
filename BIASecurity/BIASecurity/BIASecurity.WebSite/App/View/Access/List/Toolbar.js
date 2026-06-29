Ext.define('App.View.Access.List.Toolbar', {
    extend: 'App.View.Component.ListToolbar.Container',
    alias: 'widget.App-View-Access-List-Toolbar',

    cls: 'accessListToolbar',
    defaultButtonUI: 'default',

    hideGridView: true,
    hideDetailView: true,
    layout: 'hbox',
    items: [
        { xtype: 'label', text: 'Access List' }
    ],
    filter: [
        {
            xtype: 'segmentedbutton',
            filterProperty: 'access',
            toggleText: true,
            allowMultiple: true,
            defaults: { padding: '0 5 2 0', height: 28, width: 28, margin: 0 },
            items: [
                {
                    text: 'Has Access',
                    tooltip: 'User has Access',
                    value: 'Yes'
                },
                {
                    text: 'Pending',
                    tooltip: 'Access is Pending',
                    value: 'Pending'
                }
            ]
        }
    ]
});