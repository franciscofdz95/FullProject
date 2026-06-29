BIA.application({
    name: 'App',
    namespaces: ['App'], //Namespaces (aka directories) to search for controllers, used by autoAddControllers.
    enableQuickTips: true,
    autoAddControllers: true,
    loadDeepLinkOnStartup: true,

    launch: function launch() {
        
        //Add ViewModel overrides to have binding throw 'bindingcomplete' event on view when all bound items have finished being inserted
        BIA.BindingOverrides.doOverrides();
        // launch a viewport
        Ext.setGlyphFontFamily('font-awesome');
        // the default 'landing page' for the application
        var viewport = 'App-View-Viewport';        

        Ext.widget(viewport, {
            templateVersion: {
                major: 1,
                minor: 3,
                toString: function toString() {
                    return this.major + '.' + this.minor;
                }
            }
        });
    }
});