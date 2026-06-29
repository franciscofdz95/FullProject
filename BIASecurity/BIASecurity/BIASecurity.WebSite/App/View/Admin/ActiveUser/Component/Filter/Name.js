Ext.define('App.View.Admin.ActiveUser.Component.Filter.Name', {
    extend: 'Ext.form.field.Text',
    alias: 'widget.App-View-Admin-ActiveUser-Component-Filter-Name',

    cls: 'adminActiveuserComponentFilterName',
    tooltip: 'Seperate search terms divide by a comma',
    param: 'userNameList',
    fieldLabel: 'User Name Search',
    labelWidth: 115
});