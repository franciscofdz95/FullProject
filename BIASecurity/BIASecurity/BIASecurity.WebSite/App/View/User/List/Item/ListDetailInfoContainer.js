Ext.define('App.View.User.List.Item.ListDetailInfoContainer', {
    extend: 'Ext.container.Container',
    alias: 'widget.App-View-User-List-Item-ListDetailInfoContainer',

    cls: 'userListItemListdetailinfocontainer',
    layout: { type: 'vbox', align: 'stretch', pack: 'start' },

    items: [
        {
            xtype: 'container',
            layout: { type: 'hbox', align: 'stretch', pack: 'start' },
            items: [
                {
                    xtype: 'container',
                    layout: { type: 'hbox', align: 'stretch', pack: 'center' },
                    //defaults: { flex: 1 },
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
                    //defaults: { flex: 1 },
                    flex: 0,
                    width: 18,
                    defaults: { flex: 1 },
                    items: [
                        { xtype: 'App-View-User-List-Item-Status', showOnHeader: false },
                        { xtype: 'label', text: ' ', showOnHeader: true, sort: true, sortOn: 'Status' }
                    ]
                },
                { xtype: 'label', dataField: 'LoginId', minWidth: 108, flex: .5, sort: true, sortDisplay: 'Login ID' },
                {
                    xtype: 'container',
                    layout: { type: 'hbox', align: 'stretch', pack: 'start' },
                    flex: 1,
                    defaults: { flex: 1 },
                    padding: '0 15 0 0',
                    items: [
                        {
                            xtype: 'container',
                            layout: { type: 'hbox', align: 'stretch', pack: 'start' },
                            showOnHeader: false,
                            items: [
                                { xtype: 'label', dataField: 'Name' },
                                { xtype: 'App-View-User-Component-Email' },
                                { xtype: 'tbfill', flex: 1 }
                            ]
                        },
                        { xtype: 'label', dataField: 'Name', showOnHeader: true, sort: true }
                    ]
                },
                { xtype: 'label', dataField: 'Phone', minWIdth: 150, flex: .25, sort: true },
                { xtype: 'label', dataField: 'LastLoginDT', renderer: Ext.util.Format.dateRenderer('m/d/y'), flex: 0, width: 113, sort: true, sortDisplay: 'Last Login' },
                { xtype: 'label', dataField: 'Logins', flex: 0, width: 123, cls: 'RightLabelText', sort: true },

            ]
        },
        {
            xtype: 'container',
            layout: { type: 'hbox', align: 'stretch', pack: 'start' },
            padding: '10 0 0',
            items: [
                { xtype: 'tbfill', width: 36, flex: 0 },
                { xtype: 'label', dataField: 'Region', flex: 0, width: 43, cls: 'CenterLabelText UserLocation UserRegion', locationLabel: true, sort: true },
                { xtype: 'label', dataField: 'District', flex: 0, width: 43, cls: 'CenterLabelText UserLocation UserDistrict', locationLabel: true, sort: true },
                { xtype: 'label', dataField: 'Center', flex: 0, width: 93, cls: 'CenterLabelText UserLocation UserCenter', locationLabel: true, sort: true },
                { xtype: 'label', dataField: 'Country', flex: 0, width: 43, cls: 'CenterLabelText UserLocation UserCountry', locationLabel: true, sort: true },
                { xtype: 'tbfill' },
                { xtype: 'label', dataField: 'LastActivityDT', renderer: Ext.util.Format.dateRenderer('m/d/y H:i'), flex: 0, width: 113, sort: true, sortDisplay: 'Last Activity' },
                { xtype: 'label', dataField: 'AppAccess', flex: 0, width: 123, cls: 'RightLabelText help', renderer: Utility.Formatting.UserAppAccess, sort: true, itemId: 'appAccess', sortDisplay: 'Applications'}
            ]
        }
    ]
});