Ext.define('App.View.Role.List.Item.Active', {
    extend: 'App.View.Component.List.Item.ConditionalIcon',
    alias: 'widget.App-View-Role-List-Item-Active',

    cls: 'roleListItemActive',    

    icons: [
        '<i class="fa fa-circle-o" data-qtip="Inactive" style="color: #F31A12;"></i>',
        '<i class="fa fa-circle" data-qtip="Active" style="color: #64A70B;"></i>'
    ]
});