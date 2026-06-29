Ext.define('App.View.Application.List.Toolbar', {
    extend: 'App.View.Component.ListToolbar.Container',
    alias: 'widget.App-View-Application-List-Toolbar',
    cls: 'ApplicationListToolbar',
    defaultButtonUI: 'default',
    items: [
        {
            xtype: 'container',
            itemId: 'ApplicationListLevelToggle',
            cls: 'ApplicationListLevelToggle',
            layout: {
                type: 'hbox',
                align: 'middle',
                pack: 'start'
            },
            defaults: {
                margin: '0 3 0 0'
            },
            items: [
                {
                    xtype: 'container',
                    itemId: 'ApplicationListLevelToggleApp',
                    html: 'Application List',
                    cls: 'ApplicationListLevelToggleSection'
                }
            ]
        }
    ],
    filter: [
        {
            xtype: 'segmentedbutton',
            filterProperty: 'active',
            toggleText: true,
            allowMultiple: true,
            defaults: { padding: '0 5 2 0', height: 28, width: 28, margin: 0 },
            items: [
                {
                    text: 'Online',
                    tooltip: 'Online Applications',
                    value: 1
                },
                {
                    text: 'Offline',
                    tooltip: 'Offline Applications',
                    value: 0
                }
            ]
        }
    ]
});