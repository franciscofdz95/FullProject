Ext.define('App.View.Application.AddEditView.Component.InfoList', {
    extend: 'Ext.container.Container',
    alias: 'widget.App-View-Application-AddEditView-Component-InfoList',

    cls: 'applicationAddeditviewComponentInfoList',
    layout: {
        type: 'hbox',
        align: 'stretch',
        pack: 'start'
    },

    loadStoreOnInit: true,
    getAppOnStoreLoad: true,
    itemXtype: null,
    delayAdd: 0,
    loadingText: 'Loading',
    padding: '15 10 10'
    //height: 60
});