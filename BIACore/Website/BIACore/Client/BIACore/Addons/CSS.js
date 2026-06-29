BIACore.define('BIACore.Addons.CSS', {
    onLoad: function () {
        //BIACore.Loader.font((BIACore.isLocalHost() && BIACore.Config.appCode === "BIACore" ? '/' : BIACore.Config.serviceURI) + '/fonts/fontawesome-webfont.woff2?v=4.7.0','woff2');
        BIACore.Loader.css((BIACore.Config.serviceURI) + 'css/Header/Header.css');
        BIACore.Loader.css((BIACore.Config.serviceURI) + 'css/Security/Security.css');

        //Ext not defined by this point of execution :'( -- Drew 2020-06-26
        /*if (!Ext.theme || Ext.theme.name !== 'Material') 
            BIACore.Loader.css((BIACore.Config.serviceURI) + 'css/font-awesome.css');*/

        BIACore.Event.fire('ready');


        //see if the theme is material after Ext is defined and ready
        BIACore.onReady(function () {
            if (typeof (Ext) == 'undefined' || !Ext.theme || Ext.theme.name !== 'Material')
                BIACore.Loader.css((BIACore.Config.serviceURI) + 'css/font-awesome.css');
        });
    }
});