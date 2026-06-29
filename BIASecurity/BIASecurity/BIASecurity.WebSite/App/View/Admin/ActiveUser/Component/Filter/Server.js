Ext.define('App.View.Admin.ActiveUser.Component.Filter.Server', {
    extend: 'App.View.Component.Form.Field.ScrollingTag',
    alias: 'widget.App-View-Admin-ActiveUser-Component-Filter-Server',

    cls: 'adminActiveuserComponentFilterServer',
    store: { type: 'webapi', api: { read: 'api/BIASecurity/ActiveUserServer' } },
    valueField: 'Value',
    displayField: 'Value',
    param: 'server',
    fieldLabel: 'Server'
});