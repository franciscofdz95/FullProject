Ext.define('App.View.Application.AddEditView.Summary.ContactsList', {
    extend: 'Ext.container.Container',
    alias: 'widget.App-View-Application-AddEditView-Summary-ContactsList',
    cls: 'applicationAddeditviewSummaryContactslist',
    layout: {
        type: 'vbox',
        align: 'stretch',
        pack: 'start'
    },
    minHeight: 25,
    items: [
        {plugins: { ptype: 'borderfloatingtitle', position: 't', titleConfig: 'Contacts' }},
        {
            xtype: 'label',
            //padding: '20 0 0 0',
            text: '*Only visible to administrators'
        }
    ]
});