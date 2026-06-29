BIACore.define('BIACore.Header.Impersonation', {
    templates: {
        Menu: [
            '<div class="biacore2" style="width:250px;">',
            '<ul id="BH_Menu_User">',
            '<li><a href="#">Search</a></li>',
            '</ul>',
            '</div>'
        ],
        MenuItem: [
            '<li userId="{userId}"><a href="#">{lastName}, {firstName} ({userId})</a></li>'
        ],
        MenuSpacer: [
            '<li></li>'
        ],
        Search: [
            '<div id="BH_Dialog_Impersonation">',
            '<label for="BH_Impersonation_Search">Search: </label>',
            '<input id="BH_Impersonation_Search" type="text" autofocus />',
            '</div>'
        ]
    },

    add: function () {
        var me = this,
            templates = me.templates,
            spacer = templates.MenuSpacer.join(''),
            config = BIACore.Header.config || {},
            info = BIACore.Header.Info || {};

        var button = BIACore.$('#BH_Button_UserMenu').toggle(config.showUserMenu);
        if (!config.showUserMenu) { return; }

        var dialog = BIACore.$(templates.Search.join('')).dialog({
            appendTo: config.target,
            title: 'User Search',
            dialogClass: 'biacore2',
            modal: true,
            resizable: false,
            autoOpen: false,
            draggable: false
        });

        // can't do the $(html) trick with the menu that we can with the dialog.
        BIACore.$(config.target).append(templates.Menu.join(''));
        var menu = BIACore.$('ul#BH_Menu_User').menu({
            select: function (event, ui) {
                var userId = ui.item.attr('userId');
                if (userId) {
                    me.impersonate(userId);
                } else if (ui.item.text() === 'Search') {
                    // open search dialog.
                    dialog.dialog('open');
                    BIACore.$('#BH_Impersonation_Search').focus();
                } else {
                    // edit user profile.
                    var url = BIACore.Config.server + '/bia/apps/BIASecurity/index.cfm?' + BIACore.$.param({
                        action: 'UserAdmin.ModifyProfile',
                        modal: false,
                        sysm: BIACore.Header.Info.authenticatedId
                    });
                    BIACore.Window.Open(url, 'EditProfile', { status: 1, width: 800, height: 600 });
                }
            }
        }).hide();

        button.click(function () {
            menu.css('z-index', BIACore.$.topZIndex() + 1).show().position({
                my: "left top",
                at: "left bottom",
                of: this
            });
            // Register a click outside the menu to close it
            BIACore.$(document).one("click", function () {
                menu.hide();
            });
            // and cancel any other handlers
            return false;
        });

        if (info.authenticatedId === info.userId) {
            menu.prepend(spacer);
            menu.prepend('<li><a href="#">Edit User Profile</a></li>');

            menu.menu('refresh');
        }

        // load the user window list
        BIACore.ajax({
            url: BIACore.URL.ImpersonationList,
            data: {
                AppCode: BIACore.Config.appCode,
                //SessionId: BIACore.Config.sessionId()
                TokenLocal: BIACore.Config.tokenLocal()
            },
            success: function (response) {
                BIACore.Console('loaded Impersonation List');
                if (response === null || response.length === 0) { return; }
                var template = templates.MenuItem.join('');

                menu.append(spacer);

                BIACore.$.each(response, function (i, item) {
                    menu.append(BIACore.String.format(template, item));
                    if (item.type === 'self') {
                        menu.append(spacer);
                    }
                });

                menu.menu('refresh');
            }
        });

        // set up the autocomplete functions
        BIACore.$('#BH_Impersonation_Search').autocomplete({
            minLength: 3, // characters to start auto-complete
            autoFocus: true,
            source: function (request, response) {
                BIACore.ajax({
                    url: BIACore.URL.ImpersonationSearch,
                    data: {
                        AppCode: BIACore.Config.appCode,
                        //SessionId: BIACore.Config.sessionId()
                        TokenLocal: BIACore.Config.tokenLocal(),
                        Query: request.term
                    },
                    success: function (data) {
                        response(BIACore.$.map(data, function (item) {
                            return {
                                label: BIACore.String.format('{lastName}, {firstName} ({userId})', item),
                                value: item.userId
                            };
                        }));
                    }
                });
            },
            select: function (event, ui) {
                if (ui.item) {
                    dialog.dialog('close');
                    me.impersonate(ui.item.value);
                }
            }
            //open: function () { BIACore.$(this).removeClass("ui-corner-all").addClass("ui-corner-top"); },
            //close: function () { BIACore.$(this).removeClass("ui-corner-top").addClass("ui-corner-all"); }
        });

        // move the autocomplete to just outside of the dialog - this no longer limits display height to that of the dialog.
        BIACore.$('#BH_Impersonation_Search')
            .autocomplete('widget')
            .insertAfter(dialog.parent());
    },

    impersonate: function (userId) {
        if (BIACore.String.isNullOrEmpty(userId)) { return; }

        BIACore.ajax({
            url: BIACore.URL.Impersonate,
            data: {
                AppCode: BIACore.Config.appCode,
                //SessionId: BIACore.Config.sessionId()
                TokenLocal: BIACore.Config.tokenLocal(),
                ImpersonateId: userId
            },
            success: function (response) {
                if (response === null || response.Error !== 0) {
                    BIACore.Console('Impersonation failed ' + response.Message);
                    alert(response.Message);
                } else {
                    BIACore.Config.sessionId(response.SessionId);
                    // window reload.
                    window.location.href = window.location.protocol + '//' + window.location.host + window.location.pathname;
                }
            }
        });
    }
});