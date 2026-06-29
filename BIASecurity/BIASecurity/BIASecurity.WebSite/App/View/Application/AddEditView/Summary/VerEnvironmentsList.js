Ext.define('App.View.Application.AddEditView.Summary.VerEnvironmentsList', {
    extend: 'Ext.container.Container',
    alias: 'widget.App-View-Application-AddEditView-Summary-VerEnvironmentsList',

    cls: 'applicationAddeditviewSummaryVerenvironmentslist',
    layout: {
        type: 'hbox',
        align: 'stretch',
        pack: 'start'
    },
    plugins: { ptype: 'borderfloatingtitle', position: 't', titleConfig: 'Environments' },
    minHeight: 25,
    items: [
    ]
});