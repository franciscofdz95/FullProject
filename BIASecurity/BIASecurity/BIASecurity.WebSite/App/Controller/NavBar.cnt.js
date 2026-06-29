Ext.define('App.Controller.NavBar', {
    extend: 'Ext.app.Controller',
    refs: [
        { selector: 'App-View-Content-Container[hidden=false][rendered=true]', ref: 'Content' },
        { selector: 'App-View-Navigation-NavBar[hidden=false][rendered=true]', ref: 'NavBar' }
    ],
    init: function init() {
        var me = this;

        me.control({
            'App-View-Navigation-NavBar #NavBarAdminButton': {
                click: this.NavBarAdminButtonClick
            },
            'App-View-Navigation-NavBar #NavBarHomeButton': {
                click: this.NavBarHomeButtonClick
            },
            'App-View-Navigation-NavBar splitbutton': {
                click: this.NavBarSplitButtonClick
            },
            'App-View-Navigation-NavBar splitbutton menu, button menu[eventToFire]': {
                beforerender: this.NavBarSplitButtonBeforeRender,
                click: this.NavBarSplitButtonClick
            },
            'App-View-Navigation-NavBar button menu [eventToFire]': {
                beforerender: this.NavBarSplitButtonBeforeRender
            },
            'App-View-Connections-Header-Container button menu [eventToFire]': {
                //beforerender: this.NavBarSplitButtonBeforeRender,
                click: this.NavBarSplitButtonClick
            },
            'App-View-Navigation-NavBar #NavBarAddButton': {
                click: this.NavBarAddButtonClick
            },
            'App-View-Content-Container': {
                afterMainItemChange: this.AfterMainItemChange
            }
        });
        me.listen({});
    },
    NavBarSplitButtonBeforeRender: function NavBarSplitButtonBeforeRender(menu) {
        if (menu.requiredAccess) {
            var hidden = true;

            if (menu.requiredAccess == 'SA')
                hidden = !BIACore.Security.User.isSA();
            else if (menu.requiredAccess == 'Admin')
                hidden = !BIACore.Security.User.isAdmin();
            else
                hidden = false;

            menu.setHidden(hidden);
        }
    },
    NavBarAdminButtonClick: function NavBarAdminButtonClick(me, event, eOpts) {
        var adminMenu = me.up('viewport').down('adminMenu');
        if (adminMenu) {
            //if(!adminMenu.initialWidth) adminMenu.initialWidth = adminMenu.width;
            //if (adminMenu.hidden) {
            //    adminMenu.width = 0;
            //    adminMenu.show();
            //    adminMenu.animate({ width: adminMenu.initialWidth });
            //}
            //else {
            //    if (adminMenu.width == 0) adminMenu.animate({ easing: 'easeIn', to: { left: adminMenu.x - adminMenu.width } });
            //    else adminMenu.animate({ easing: 'easeIn', to: { left: adminMenu.x + adminMenu.width } });
            //
            //}
            adminMenu.setVisible(adminMenu.hidden);

            if (adminMenu.hidden) me.removeCls('ButtonEnabled');
            else me.addCls('ButtonEnabled');
        }
    },
    NavBarHomeButtonClick: function NavBarHomeButtonClick(me, eOpts) {
        Ext.GlobalEvents.fireEvent('doAppDeepLink', 'gotoNewContent', { xtype: 'App-View-Application-List', flex: 1 });
        //BIA.Components.DeepLink.addEventHistory('gotoNewContent', { xtype: 'App-View-Content-Initial', flex: 1 });
    },
    NavBarSplitButtonClick: function NavBarSplitButtonClick(me, item) {
        var selection = me;
        var content = this.getContent(),
            child = content.child();
        if (!selection.isXType('menuitem') && !selection.isXType('splitbutton')) selection = item;
        if (selection && Ext.isObject(selection.eventToFire)) {
            if (selection.eventToFire.params.class) {
                Ext.create(selection.eventToFire.params.class, {
                    content: content
                }).show();
            } else
            Ext.GlobalEvents.fireEvent('doAppDeepLink', selection.eventToFire.eventName, selection.eventToFire.params);
        }
    },
    AfterMainItemChange: function AfterMainItemChange(content, config, newItem) {
        var navBar = this.getNavBar(),
            addButton = navBar.down('#NavBarAddButton'),
            hidden = true;

        if (!Ext.isEmpty(newItem.addItemXtype) || !Ext.isEmpty(newItem.addItemWindowClass)) {
            if (newItem.addItemRequiredAccess == 'SA')
                hidden = !BIACore.Security.User.isSA();
            else if (newItem.addItemRequiredAccess == 'Admin')
                hidden = !BIACore.Security.User.isAdmin();
            else
                hidden = false;
        }

        addButton.setHidden(hidden);
        navBar.forceResize();
    },
    NavBarAddButtonClick: function NavBarAddButtonClick(me) {
        var content = this.getContent(),
            child = content.child();

        if (child && child.addItemXtype) {
            BIA.Components.DeepLink.addEventHistory('gotoNewContent', Ext.apply(child.addItemXtype, {
                noChangeIfSameXtype: true
            }));
        } else if (child && child.addItemWindowClass) {
            Ext.create(child.addItemWindowClass, {
                content: content
            }).show();
        }
    }
});