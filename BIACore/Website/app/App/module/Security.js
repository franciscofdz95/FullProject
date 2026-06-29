Ext.define('App.module.Security', {
    extend: 'App.desktop.Module',
    alias: 'widget.App-module-Security',

    title: 'Security',
    iconCls: 'icon-report',

    hideFromStart: function () { return !BIACore.Security.User.isSA(); },

    layout: 'border',
    items: [
        {
            xtype: 'tabpanel', region: 'center',
            defaults: { border: false },
            items: [
                { xtype: 'App-Security-Active', title: 'Active' },
                { xtype: 'App-Security-Stats', title: 'Stats' },
                { xtype: 'App-Security-History', title: 'History' },
                { xtype: 'App-Security-Unlock', title: 'Unlock' }
            ]
        }
    ]
});
