Ext.define('App.View.User.History.Window', {
    extend: 'Ext.window.Window',
    alias: 'widget.App-View-User-History-Window',

    cls: 'userHistoryWindow',
	title: 'Application Access Summary',
	titleAlign: 'center',
	floating: true,
	closable: true,
	height: 500,
	width: 900,
	resizable: false,
	monitorResize: true,
	autoScroll: true,
	draggable: false,
	modal: true,
	bodyPadding: '5',
	items: [
		{
			xtype: 'App-View-User-History-Grid',
			itemId: 'userHistory',
			flex: 1
		}
    ]
});