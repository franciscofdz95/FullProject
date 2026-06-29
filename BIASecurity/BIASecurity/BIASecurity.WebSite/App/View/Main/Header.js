Ext.define('App.View.Main.Header', {
    extend: 'BIA.container.Header',
    alias: 'widget.App-View-Main-Header',
    xtype: 'appHeader',
    showMyReports: false,
    showOtherTools: false,
    showTimeout: true,
    style: { LineHeight: 'normal' },
    applicationButtons: [
        {
            title: 'Quick Guide',
            image: 'images/icon_notes.png',
            clickFunction: function clickFunction() {
                BIACore.Window.OpenMax('Documents/QuickGuide.html');
            }
        },
        {
            title: 'User Manual',
            image: 'images/help.png',
            clickFunction: function clickFunction() {
                BIACore.Window.OpenMax('Documents/Manual.html');
            }
        }
    ]
});