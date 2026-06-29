(function () {
    if (Ext.getVersion().major < 5) {
        // make ext 4 have the same methods we (ab)use in ext 5.
        Ext.override(Ext.data.Request, {
            getOperation: function () { return this.operation; },
            getParams: function () { return this.params; },
            getJsonData: function () { return this.jsonData; },
            setJsonData: function (value) { this.jsonData = value; }
        });
    }
}());