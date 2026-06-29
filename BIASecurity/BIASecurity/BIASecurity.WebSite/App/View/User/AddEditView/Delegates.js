Ext.define('App.View.User.AddEditView.Delegates', {
    extend: 'Ext.container.Container',
    alias: 'widget.App-View-User-AddEditView-Delegates',

    cls: 'userAddeditviewDelegates',
    layout: {
        type: 'hbox',
        align: 'stretch',
        pack: 'start'
    },
    defaults: {
        flex: 1,
        layout: {
            type: 'vbox',
            align: 'stretch'
        }
    },
    items: [
        {
            xtype: 'container',
            plugins: {
                ptype: 'borderfloatingtitle', position: 't',
                titleConfig: {
                    xtype: 'container',
                    layout: {
                        type: 'hbox'
                    },
                    items: [
                        { xtype: 'container', width: 10, text: '', cls: 'BorderFloatingTitleBottom', style: 'margin: 12px 5px 0 0;' },
                        {
                            xtype: 'container', html: 'My Delegated Users', cls: 'BorderFloatingTitle', style: 'margin-top: 3px'
                        },
                        {
                            xtype: 'iconbutton',
                            icon: 'plus-circle',
                            itemId: 'addDelegateButton',
                            cls: 'BIAIconButton',
                            margin: '0 0 0 5',
                            hidden: true
                        },
                        { xtype: 'container', flex: 1, text: '', cls: 'BorderFloatingTitleBottom', style: 'margin: 12px 20px 0 5px;' }
                    ]
                }
            },
            items: [
                { xtype: 'App-View-User-AddEditView-DelegateList-View', flex: 1 }
            ]
        },
        {
            xtype: 'container',
            plugins: { ptype: 'borderfloatingtitle', position: 't', titleConfig: 'Users Delegated For' },
            items: [
                { xtype: 'App-View-User-AddEditView-DelegatorList-View', flex: 1 }
            ]
        }
    ]
});