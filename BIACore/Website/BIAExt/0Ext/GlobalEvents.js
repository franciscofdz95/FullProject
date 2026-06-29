(function () {
    var win;
    if (Ext.getVersion().major >= 5) win = Ext.getWin();
    else Ext.get('window');

    if (win) win.addListener('beforeunload', function (e) { return Ext.GlobalEvents.fireEvent('beforewindowunload', win); });
})();