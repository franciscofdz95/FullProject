Ext.define('App.View.Admin.ActiveUser.Component.Filter.AppCode', {
    extend: 'App.View.Component.Form.Field.ScrollingTag',
    alias: 'widget.App-View-Admin-ActiveUser-Component-Filter-AppCode',

    //cls: 'adminActiveuserComponentFilterServer',
    //labelWidth: 40,   
    store: { type: 'webapi', api: { read: 'api/BIASecurity/ActiveUserAppcode' } },
    valueField: 'Value',
    displayField: 'Value',
    param: 'appcode',
    fieldLabel: 'AppCode'
});