Ext.define('App.View.Application.List.Item.Stats', {
    extend: 'Ext.container.Container',
    alias: 'widget.App-View-Application-List-Item-Stats',
    cls: 'ApplicationListStats',
    layout: {
        type: 'hbox',
        align: 'stretch',
        pack: 'begin'
    },
    defaults: {
        margin: '0 5',
        flex: 1
    },
    items: [
        {
            xtype: 'label',
            dataField: 'CurrentUsers',
            margin: '0 5 0 0',
            renderer: Utility.Formatting.NumFormat_Thousands_0Decimals,
            hoverWindow: {
                showOnClick: false,
                showOnHover: true,
                items: [
                    {
                        itemId: 'AppOnlineHoverWindow',
                        xtype: 'label',
                        minWidth: 100,
                        text: 'Current users online'
                    }
                ]
            }
        },
        {
            xtype: 'label',
            text: '/',
            flex: 0
        },
        {
            xtype: 'label',
            dataField: 'TotalUsers',
            renderer: Utility.Formatting.NumFormat_Thousands_0Decimals,
            hoverWindow: {
                showOnClick: false,
                showOnHover: true,
                items: [
                    {
                        itemId: 'AppUsersHoverWindow',
                        xtype: 'label',
                        minWidth: 100,
                        text: 'Users with permissions'
                    }
                ]
            }
        },
        {
            xtype: 'label',
            dataField: 'UsersOnlinePercent',
            cls: 'UsersOnlinePercent',
            margin: '0 0 0 5',
            width: 28,
            flex: 0,
            renderer: Utility.Formatting.NumFormat_Percent_0Decimals,
            hoverWindow: {
                showOnClick: false,
                showOnHover: true,
                items: [
                    {
                        itemId: 'AppOnlinePercentHoverWindow',
                        xtype: 'label',
                        minWidth: 100,
                        text: 'Percentage of users online'
                    }
                ]
            }
        }
    ]
});