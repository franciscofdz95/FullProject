var BIA = BIA || {};
// Centralized start point, to synchronize all the security and other items together.
BIA.application = function (config) {
    Ext.require('BIA.app.Application');

    BIACore.onReady(function () {

        if (Ext.getVersion().major >= 5) {
            BIACore.Loader.css((BIACore.isLocalHost() && BIACore.Config.appCode === "BIACore" ? '/' : BIACore.Config.serviceURI) + 'css/Ext5/Fixes.css');
        }

        if (Ext.getVersion().major >= 7) {
            BIACore.Loader.css((BIACore.isLocalHost() && BIACore.Config.appCode === "BIACore" ? '/' : BIACore.Config.serviceURI) + 'css/Ext7/Fixes.css');
        }

        Ext.onReady(function () {
            new BIA.app.Application(config);
        });
    });
};