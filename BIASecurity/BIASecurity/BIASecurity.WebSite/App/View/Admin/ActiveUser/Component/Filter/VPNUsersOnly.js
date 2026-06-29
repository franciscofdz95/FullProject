Ext.define('App.View.Admin.ActiveUser.Component.Filter.VPNUsersOnly', {
    extend: 'Ext.form.field.Checkbox',
    alias: 'widget.App-View-Admin-ActiveUser-Component-Filter-VPNUsersOnly',

    cls: 'adminActiveuserComponentFilterVpnusersonly',
    value: false,
    param: 'vpnUsersOnly',
    fieldLabel: 'VPN Users Only'
});