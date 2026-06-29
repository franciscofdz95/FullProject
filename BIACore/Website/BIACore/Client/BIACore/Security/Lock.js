BIACore.define('BIACore.Security.Screen', {
    checkInterval: 60,  // how often (in seconds) to check
    timer: null,        // timer that does the check

    template: [
        '<div id="BS_LockScreen" class="BS_Mask"></div>',
        '<div id="BS_LockLogin" class="BS_Center">',
        '<table class="BS_Login">',
        '<th colspan="2">Session Timeout</th>',
        '<tr>',
        '<td align="right">Id:</td>',
        '<td><input id="BS_Login_User" type="text" class="BS_Input"></input></td>',
        '</tr>',
        '<tr>',
        '<td align="right">Password:</td>',
        '<td><input id="BS_Login_Pass" type="password" class="BS_Input"></input></td>',
        '</tr>',
        '<tr>',
        '<td id="BS_Login_Error" colspan="2" align="center"></td>',
        '</tr>',
        '</table>',
        '</div>'
    ],

    // Note: This cannot be used to do full authentication with impersonation -
    // we're only showing/hiding the screen, not forcing a refresh on unlock.
    onLoad: function () {
        var me = this;

        //if (false) {
        //me.timer = BIACore.$.timer(me.CheckSession, me.checkInterval * 1000, BIACore.Security.enabled);
        BIACore.$('body').append(me.template.join(''));
        BIACore.$('#BS_LockScreen').hide();
        BIACore.$('#BS_LockLogin').hide();
        // bind 'enter' to login
        BIACore.$('#BS_Login_Pass').keyup(function (e) {
            if (e.keyCode === 13) {
                me.TryLogin();
            }
        });
        BIACore.Event.fire('ready');
    },

    CheckSession: function () {
        BIACore.Console('Checking if session is active');
        BIACore.ajax({
            url: BIACore.URL.Lock,
            data: {
                AppCode: BIACore.Config.appCode,
                //SessionId: BIACore.Config.sessionId()
                TokenLocal: BIACore.Config.tokenLocal()
            },
            success: function (data) {
                if (data.status !== 1) {
                    BIACore.Console('Session Inactive, locking');
                    BIACore.Security.Screen.Lock();
                }
            }
            // do nothing on error?
        });
    },

    TryLogin: function () {
        BIACore.Console('login');
        this.Unlock();
    },

    Lock: function () {
        var z = BIACore.$.topZIndex() + 1;
        BIACore.$('#BS_LockScreen').show().css('z-index', z);
        BIACore.$('#BS_LockLogin').show().css('z-index', z + 1);
        BIACore.$('#BS_Login_User').val(BIACore.Security.User.authenticatedId);
        BIACore.$('#BS_Login_Pass').focus();
    },

    Unlock: function () {
        BIACore.$('#BS_LockScreen').hide().css('z-index', -2);
        BIACore.$('#BS_LockLogin').hide().css('z-index', -1);
        BIACore.$('#BS_Login_Pass').val('');
    }

});