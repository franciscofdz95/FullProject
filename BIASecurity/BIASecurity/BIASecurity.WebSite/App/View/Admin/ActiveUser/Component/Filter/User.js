Ext.define('App.View.Admin.ActiveUser.Component.Filter.User', {
    extend: 'Ext.form.field.Text',
    alias: 'widget.App-View-Admin-ActiveUser-Component-Filter-User',

    cls: 'adminActiveuserComponentFilterUser',
    tooltip: 'Seperate search terms divide by a comma',
    param: 'userList',
    fieldLabel: 'User SYSM Search',
    labelWidth: 115
});