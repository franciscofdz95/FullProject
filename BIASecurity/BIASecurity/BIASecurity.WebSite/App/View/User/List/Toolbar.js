Ext.define('App.View.User.List.Toolbar', {
    extend: 'App.View.Component.ListToolbar.Container',
    alias: 'widget.App-View-User-List-Toolbar',

    cls: 'userListToolbar',
    items: [
        { xtype: 'container', itemId: 'viewTitle', html: 'User List' }
    ]
});