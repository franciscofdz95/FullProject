Ext.define('App.View.Access.List.Item.AccessLevel', {
    extend: 'App.View.Component.List.Item.ConditionalIcon',
    alias: 'widget.App-View-Access-List-Item-AccessLevel',

    cls: 'accessListItemAccesslevel',
    
    icons: {
        User: '<div class="IconCnt User"><i class="fas fa-user" data-qtip="User"></i></i></div>',
        Admin: '<div class="IconCnt Admin"><i class="fas fa-user-cog" data-qtip="Administrator"></i></div>',
        SA: '<div class="IconCnt SA"><i class="fas fa-user-shield" data-qtip="System Administrator"></i></div>'
    }
});