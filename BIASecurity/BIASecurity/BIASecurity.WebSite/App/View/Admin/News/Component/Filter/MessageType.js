Ext.define('App.View.Admin.News.Component.Filter.MessageType', {
    extend: 'App.View.Component.Form.Field.ScrollingTag',
    alias: 'widget.App-View-Admin-News-Component-Filter-MessageType',

    //cls: 'adminActiveuserComponentFilterServer',
    store: { type: 'webapi', api: { read: 'api/BIASecurity/BIAMessageType' } },
    valueField: 'Value',
    displayField: 'Value',
    //param: 'server',
    fieldLabel: 'Message Type'
});