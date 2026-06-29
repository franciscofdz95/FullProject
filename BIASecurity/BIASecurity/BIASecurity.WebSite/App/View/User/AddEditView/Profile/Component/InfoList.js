Ext.define('App.View.User.AddEditView.Profile.Component.InfoList', {
    extend: 'Ext.container.Container',
    alias: 'widget.App-View-User-AddEditView-Profile-Component-InfoList',

    componentCls: 'userAddeditviewProfileComponentInfolist',
    layout: {
        type: 'hbox',
        align: 'stretch',
        pack: 'start'
    },
    loadStoreOnInit: true,
    getUserOnStoreLoad: true,
    itemXtype: null,
    delayAdd: 0,
    loadingText: 'Loading',
    padding: '15 10 10',
    height: 60
});