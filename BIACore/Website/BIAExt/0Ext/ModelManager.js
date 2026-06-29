(function () {
    // fix the Ext.ModelManager to create based on object definition, instead of only doing lookups.
    var version = Ext.getVersion() || {};
    if (version.major === 4) {
        Ext.override(Ext.ModelManager, {
            getModel: function (id) {
                var model = id;
                if (typeof (model) === 'string') {
                    // this is the default path.
                    model = this.types[model];
                } else if (typeof (model) === 'object') {
                    // if id is an object, create it as a model defition like an xtype.
                    model = Ext.define('Ext.data.ImplicitModel-' + Ext.id(),
                        Ext.apply({ extend: 'Ext.data.Model' }, id));
                }
                return model;
            }
        });
    }
}());