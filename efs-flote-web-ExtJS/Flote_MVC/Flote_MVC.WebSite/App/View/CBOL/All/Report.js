Ext.define('App.View.CBOL.All.Report', {
    extend: 'App.View.Component.Common.GridContainer',
    alias: 'widget.App-View-CBOL-All-Report',
    Report: { xtype: 'App-View-CBOL-Grid' },
    tabNo: 0,  
    CbolStatusName: 'All'
});