(function () {
    if (Ext.getVersion().major >= 5) {
        Ext.define('Ext.app.bind.BaseBinding', {
            override: 'Ext.app.bind.BaseBinding',

            isReadOnly: function () {
                return true;
            }
        });
    }
}());