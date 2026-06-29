Ext.define('App.Utility.UserMapping', {
    singelton: true
}, function (me) {
    var currentMappedUser = {};


    BIA.Ajax.request({
        url: 'api/BIASecurity/UserMapping',
        async: false,
        method: 'POST',
        callback: function callback(request, success, response) {
            currentMappedUser = response.responseJSON.data[0];
        },
        scope: me
    });

    Ext.apply(me, {
        getCurrentUserId: function getCurrentUserId() {
            return currentMappedUser.UserId;
        }
    });
});