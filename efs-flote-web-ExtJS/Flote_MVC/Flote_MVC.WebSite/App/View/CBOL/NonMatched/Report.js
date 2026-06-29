Ext.define('App.View.CBOL.NonMatched.Report', {
    extend: 'App.View.Component.Common.GridContainer',
    alias: 'widget.App-View-CBOL-NonMatched-Report',
    Report: { xtype: 'App-View-CBOL-Grid' },
    tabNo: 2,   
    CbolStatusName: 'NonMatched'
});