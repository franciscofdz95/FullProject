Ext.define('App.View.CBOL.Selected.Report', {
    extend: 'App.View.Component.Common.GridContainer',
    alias: 'widget.App-View-CBOL-Selected-Report',
    Report: { xtype: 'App-View-CBOL-Grid' },
    tabNo: 3,    
    CbolStatusName: 'Selected'
});