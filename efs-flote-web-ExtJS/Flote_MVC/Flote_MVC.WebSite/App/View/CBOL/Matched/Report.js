Ext.define('App.View.CBOL.Matched.Report', {
    extend: 'App.View.Component.Common.GridContainer',
    alias: 'widget.App-View-CBOL-Matched-Report',
    Report: { xtype: 'App-View-CBOL-Grid' },
    tabNo: 1,    
    CbolStatusName: 'Matched'
});