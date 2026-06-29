Ext.define('App.View.User.Component.AddBtn', {
    extend: 'Ext.container.Container',
    alias: 'widget.App-View-User-Component-AddBtn',

    cls: 'userComponentAddbtn',
    layout: {
        type: 'hbox',
        align: 'stretch',
        pack: 'start'
    },

    items: [
        {
            xtype: 'iconbutton',
            icon: 'plus-circle',
            //itemId: 'UserProfileAddEmail',
            //tooltip: 'Add Email',
            cls: 'BIAIconButton Grass',
            margin: '0 5 0 5'
        }
    ]
});