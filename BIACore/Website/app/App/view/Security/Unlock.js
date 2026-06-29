Ext.define('App.view.Security.Unlock', {
    extend: 'BIA.grid.PagedPanel',
    alias: 'widget.App-Security-Unlock',
    store: {
        type: 'webapi',
        api: {
            read: 'api/AppSecurity/Lockout',
            destroy: 'api/AppSecurity/Unlock'
        }
    },
    //dockedItems: [
    //    {
    //        xtype: 'multisorttoolbar', dock: 'top',
    //        items: [
    //            { text: 'LastName', sortData: { property: 'LastName', direction: 'DESC' } }
    //        ]
    //    }
    //],
    dockedItems: [
        {
            xtype: 'container',
            layout: 'hbox',
            items: [
                {
                    xtype: 'comboarray', itemId: 'UserId', emptyText: 'User Id', minChars: 2,
                    store: { type: 'webapi', api: { read: 'api/AppSecurity/UserId' }, remoteFilter: true }
                },
                { xtype: 'tbfill', flex: 1 }
            ]
        }
    ],
    columns: {
        defaults: { menuDisabled: true },
        items: [
            {
                xtype: 'actioncolumn', width: 45, align: 'center', sortable: false,
                items: [
                    {
                        iconCls: 'icon icon-lock_open',
                        tooltip: 'Unlock',
                        handler: function (grid, rowIndex, colIndex, item, e, record) { grid.ownerCt.fireEvent('unlock', grid, rowIndex, colIndex, item, e, record); }
                    }
                ]
            },
            { text: 'UserId', dataIndex: 'UserId', width: 60 },
            { text: 'Last Name', dataIndex: 'LastName' },
            { text: 'First Name', dataIndex: 'FirstName' },
            { text: 'Failures', dataIndex: 'Failures', align: 'right' },
            { text: 'Remaining', dataIndex: 'Lockout', align: 'right', renderer: BIA.util.Format.customRenderer('Lockout') }
        ]
    },
    Lockout: function (v) {
        if (v > 0) {
            var hours = (v / 3600) >> 0,
                minutes = ((v - hours * 3600) / 60) >> 0,
                seconds = v % 60;

            return ((hours) ? hours + ':' : '') +
                ((hours) ? ('00' + minutes).slice(-2) : minutes) +
                ':' + ('00' + seconds).slice(-2);
        }
        return '';
    }
});
