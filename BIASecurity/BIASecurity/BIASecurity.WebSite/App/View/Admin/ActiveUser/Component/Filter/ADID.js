Ext.define('App.View.Admin.ActiveUser.Component.Filter.ADID', {
    extend: 'Ext.form.field.Text',
    alias: 'widget.App-View-Admin-ActiveUser-Component-Filter-ADID',

    cls: 'adminActiveuserComponentFilterAdid',
    tooltip: 'Seperate search terms divide by a comma',
    param: 'userADIDList',
    fieldLabel: 'AD ID Search'
});