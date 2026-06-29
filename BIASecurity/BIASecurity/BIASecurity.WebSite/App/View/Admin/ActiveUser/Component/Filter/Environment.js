Ext.define('App.View.Admin.ActiveUser.Component.Filter.Environment', {
    extend: 'App.View.Component.Form.Field.ScrollingTag',
    alias: 'widget.App-View-Admin-ActiveUser-Component-Filter-Environment',

    //cls: 'connectionsConnectionComponentEnvironmentfilter',
    fieldLabel: 'Environment',
    //labelWidth: 70,   
    valueField: 'Value',
    displayField: 'Value',
    param: 'environment',
    store: { type: 'webapi', api: { read: 'api/BIASecurity/ActiveUserEnvironment' } }
});