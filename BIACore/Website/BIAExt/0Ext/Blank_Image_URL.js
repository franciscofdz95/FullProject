(function () {
    // Override BLANK_IMAGE_URL to something local.
    //var version = Ext.getVersion() || {};
    //if (version.major === 4) {
        if (Ext.BLANK_IMAGE_URL.indexOf('s.gif') < 0) {
            Ext.BLANK_IMAGE_URL = BIACore.Config.server + '/Library/extjs/s.gif';
        }
    //}
}());