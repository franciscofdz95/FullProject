Ext.define('App.View.User.List.ItemGrid', {
    extend: 'App.View.Component.List.Item',
    alias: 'widget.App-View-User-List-ItemGrid',

    componentCls: 'userListItem',
    cls: 'Card CardSlim',
    padding: 3,
    user: undefined,
    layout: {
        type: 'hbox',
        align: 'stretch',
        pack: 'start'
    },

    defaults: { flex: 1, margin: '0 5' },
    items: [
        {
            xtype: 'container',
            layout: { type: 'hbox', align: 'stretch', pack: 'center' },
            flex: 0,
            width: 18,
            defaults: { flex: 1 },
            items: [
                { xtype: 'App-View-User-List-Item-Icon', showOnHeader: false },
                { xtype: 'label', text: ' ', showOnHeader: true, sort: true, sortOn: 'UserType', sortDisplay: 'User Type' }
            ]
        },
        {
            xtype: 'container',
            layout: { type: 'hbox', align: 'stretch', pack: 'center' },
            flex: 0,
            width: 18,
            defaults: { flex: 1 },
            items: [
                { xtype: 'App-View-User-List-Item-Status', showOnHeader: false  },
                { xtype: 'label', text: ' ', showOnHeader: true, sort: true, sortOn: 'Status' }
            ]
        },
        { xtype: 'label', dataField: 'LoginId', minWidth: 108, flex: 0.3, sort: true, sortDisplay: 'Login ID' },
        {
            xtype: 'container',
            layout: { type: 'hbox', align: 'stretch', pack: 'center' },
            defaults: { flex: 1 },
            padding: '0 15 0 0',
            items: [
                {
                    xtype: 'container',
                    layout: { type: 'hbox', align: 'stretch', pack: 'start' },
                    items: [
                        { xtype: 'label', dataField: 'Name', showOnHeader: true, sort: true },
                        { xtype: 'tbfill', flex: 1 },
                        { xtype: 'App-View-User-Component-Email' }
                    ]
                }

            ]
        },
        { xtype: 'label', dataField: 'Phone', minWIdth: 150, flex: 0.3, sort: true },
        { xtype: 'label', dataField: 'Region', flex: 0, width: 43, cls: 'CenterLabelText UserLocation UserRegion', locationLabel: true, sort: true },
        { xtype: 'label', dataField: 'District', flex: 0, width: 43, cls: 'CenterLabelText UserLocation UserDistrict', locationLabel: true, sort: true },
        { xtype: 'label', dataField: 'Center', flex: 0, width: 93, cls: 'CenterLabelText UserLocation UserCenter', locationLabel: true, sort: true },
        { xtype: 'label', dataField: 'Country', flex: 0, width: 43, cls: 'CenterLabelText UserLocation UserCountry', locationLabel: true, sort: true },
        { xtype: 'label', dataField: 'LastActivityDT', renderer: Ext.util.Format.dateRenderer('m/d/y H:i'), flex: 0, width: 113, sort: true, sortDisplay: 'Last Activity' },
        { xtype: 'label', dataField: 'LastLoginDT', renderer: Ext.util.Format.dateRenderer('m/d/y'), flex: 0, width: 113, sort: true, sortDisplay: 'Last Login' },
        { xtype: 'label', dataField: 'Logins', flex: 0, width: 98, cls: 'RightLabelText', sort: true },
        { xtype: 'label', dataField: 'AppAccess', flex: 0, width: 123, cls: 'RightLabelText help', renderer: Utility.Formatting.UserAppAccess, sort: true, itemId: 'appAccess', sortDisplay: 'Applications' }
    ]
});