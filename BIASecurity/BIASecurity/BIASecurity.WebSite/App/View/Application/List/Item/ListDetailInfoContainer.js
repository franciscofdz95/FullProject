Ext.define('App.View.Application.List.Item.ListDetailInfoContainer', {
    extend: 'Ext.container.Container',
    alias: 'widget.App-View-Application-List-Item-ListDetailInfoContainer',

    cls: 'applicationListItemListdetailinfocontainer',
    layout: { type: 'hbox', align: 'stretch', pack: 'start' },
    defaults: { margin: '0 6 0 0' },
    items: [
        {
            xtype: 'container',
            layout: { type: 'hbox', align: 'stretch', pack: 'center' },
            //defaults: { flex: 1 },
            flex: 0,
            width: 18,
            items: [
                { xtype: 'App-View-Application-List-Item-Icon', showOnHeader: false },
                { xtype: 'label', text: ' ', showOnHeader: true }
            ]
        },
        { xtype: 'label', dataField: 'AppCode', flex: 0, width: 175, sort: true, sortDisplay: 'App Code' },
        { xtype: 'label', dataField: 'AppName', flex: 1, padding: '0 15 0 0', sort: true, sortDisplay: 'App Name' },
        //{
        //    xtype: 'container',
        //    layout: { type: 'hbox', align: 'stretch', pack: 'center' },
        //    defaults: { flex: 1 },
        //    flex: 1,
        //    padding: '0 15 0 0',
        //    items: [
        //        { xtype: 'App-View-Application-List-Item-AppName', showOnHeader: false },
        //        { xtype: 'label', dataField: 'AppName', showOnHeader: true, sort: true, sortDisplay: 'App Name' }
        //    ]
        //},
        {
            xtype: 'container',
            layout: { type: 'hbox', align: 'stretch', pack: 'center' },
            //defaults: { flex: 1 },
            flex: 0,
            width: 130,
            items: [
                { xtype: 'App-View-Application-List-Item-Status', showOnHeader: false },
                { xtype: 'label', dataField: 'Status', showOnHeader: true, flex: 0, sort: true, sortOn: 'Status' }
            ]
        },
        {
            xtype: 'container',
            layout: { type: 'hbox', align: 'stretch', pack: 'center' },
            //defaults: { flex: 1 },
            flex: 0,
            width: 180,
            padding: '0 15',
            items: [
                { xtype: 'App-View-Application-List-Item-Stats', showOnHeader: false, maxWidth: 125, flex: 1 },
                { xtype: 'label', dataField: 'Stats', showOnHeader: true, sort: true, sortOn: 'UsersOnlinePercent', sortDisplay: 'Users Online %' }
            ]
        }
    ]
});