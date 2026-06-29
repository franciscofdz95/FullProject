Ext.define('App.View.EA.EAPopupWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.App-View-EA-EAPopupWindow',
    itemId: 'EAPopupWindowPanelId'
    , layout: 'fit'
    , height: 600
    , minWidth: 600
    , hidden: true
    , closeAction: 'hide'
    , closable: true
    , collapsible: true
    , resizable: true
    , scrollable: true      
    , items: [
        { xtype:'App-View-EA-EAACIP'},
        { xtype:'App-View-EA-ea_Brief'},
        { xtype:'App-View-EA-EACVBAT'},
        { xtype:'App-View-EA-EARegulatedGoods'},
        { xtype:'App-View-EA-EAWVAR'},
        { xtype:'App-View-EA-EASvcMapping'},
        { xtype:'App-View-EA-EAOCM'},
        { xtype:'App-View-EA-EAMyReports'},
        { xtype: 'App-View-EA-EACTP' },
        //{ xtype: 'App-View-EA-EARevRec' },
        //{ xtype: 'App-View-EA-EAFDB' },
        { xtype: 'App-View-EA-EAFLG' }
    ]

});