Ext.define('App.View.Application.List.Item.AppName', {
    extend: 'Ext.container.Container',
    alias: 'widget.App-View-Application-List-Item-AppName',

    cls: 'applicationListItemAppname',
    layout: {
        type: 'hbox',
        align: 'stretch',
        pack: 'start'
    },

    items: [
        {
            xtype: 'label',
            flex: 1,
            dataField: 'AppName',
            showOnHeader: true,
            sort: true, 
            sortDisplay: 'App Name'
        },        
        {
            xtype: 'container',
            cls: 'ApplicationListIcon ClickableIcon',
            itemId: 'ApplicationDescription',
            padding: '0 3',
            showOnHeader: false,
            html: '<i class="fa fa-info-circle"></i>',
            hoverWindow: {
                showOnClick: false,
                showOnHover: true,
                parentDataProperties: 'application',
                items: [
                    {
                        itemId: 'AppDescriptionHoverWindow',
                        xtype: 'label',
                        minWidth: 250
                    }
                ]
            }
        }
    ]
});