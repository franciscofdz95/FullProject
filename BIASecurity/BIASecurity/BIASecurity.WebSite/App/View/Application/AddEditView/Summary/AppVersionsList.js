Ext.define('App.View.Application.AddEditView.Summary.AppVersionsList', {
    extend: 'Ext.container.Container',
    alias: 'widget.App-View-Application-AddEditView-Summary-AppVersionsList',

    cls: 'applicationAddeditviewSummaryAppversionslist',
    layout: {
        type: 'hbox',
        align: 'stretch',
        pack: 'start'
    },
    plugins: { ptype: 'borderfloatingtitle', position: 't', titleConfig: 'Versions' },
    minHeight: 25,
    items: [
    ]
});