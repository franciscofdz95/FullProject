Ext.define('App.View.User.AddEditView.Profile.AccessSummaryList.Display', {
    extend: 'App.View.Component.List.Item',
    alias: 'widget.App-View-User-AddEditView-Profile-AccessSummaryList-Display',

    cls: 'userAddeditviewProfileRolesummarylistDisplay Chip',
    layout: {
        type: 'hbox',
        align: 'center',
        pack: 'start'
    },
    margin: '3 5',
    height: 32,
    padding: null,
    defaults: {
        padding: '0 5'
    },
    items: [
        { xtype: 'App-View-Access-List-Item-Icon', iconProperty: 'AccessGroup' },
        { xtype: 'label', dataField: 'RoleName' },
        { xtype: 'label', dataField: 'RoleCode', preText: '(', postText: ')' },
    ]
});