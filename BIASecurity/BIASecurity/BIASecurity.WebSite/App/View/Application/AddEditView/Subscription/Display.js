Ext.define('App.View.Application.AddEditView.Subscription.Display', {
    extend: 'Ext.container.Container',
    alias: 'widget.App-View-Application-AddEditView-Subscription-Display',

    cls: 'applicationAddeditviewSubscriptionDisplay ChipSm',
    layout: {
        type: 'hbox',
        align: 'stretch',
        pack: 'start'
    },
    margin: '5',
    defaults: { margin: '3 4 0 0'},
    items: [
        { xtype: 'label', dataField: 'SubscriptionTypeName', margin: '3 0 0 0' },
        { xtype: 'label', text: ': ' },
        { xtype: 'label', dataField: 'FirstName' },
        { xtype: 'label', dataField: 'LastName' },
        {
            xtype: 'iconbutton',
            icon: 'times-circle',
            itemId: 'removeSubscriptionButton',
            tooltip: 'Remove Subscription',
            cls: 'BIAIconButton',
            margin: '2 0 0 0'
        }
    ]
});