BIACore.define('BIACore.Header.Buttons', {
    template: [
        '<div id="{id}" title="{title}" class="BH_Button BH_Image BH_Clickable BH_Text BH_Text_Small BH_Text_Center {class}" {dropdown} style="{style}">',
        '<i class="fa fa-{icon} BH_Icon {iconCls}" style="{iconStyle}"></i>',
        '<span></span>',
        '</div>'
    ],

    /**
     * @cfg {String} [itemId]
     * Set the Ext Component id of the button element.
     */

    /**
     * @cfg {String} [title]
     * Sets the hover text of the button
     */

    /**
     * @cfg {String} [class]
     * CSS Classes to be added to the button.
     */

    /**
     * @cfg {String} [dropdown]
     * A reference to the id of the container to be displayed as a dropdown when the button is clicked.
     * EX: 'data-dropdown=[Id Of Dropdown Window]
     */

    /**
     * @cfg {String} [style]
     * CSS Style definition for the button
     */

    /**
     * @cfg {String} [icon]
     * FontAwesome name of the icon to be displayed in the button
     */

    /**
     * @cfg {String} [iconStyle]
     * CSS Style definition for the FontAwesome icon in the button
     */

    /**
     * @cfg {String} [image]
     * URL for image to be used as background of button
     */

    /**
     * @cfg {Function} clickFunction
     * The function to be called when the button is clicked.
     * @cfg {Ext.button.Button} clickFunction.button This button.
     * @cfg {Event} clickFunction.e The event object      
     */

    /**
     * @cfg {Boolean} [spacer]
     * Set this config element only to true to create a defalut-sized space.  Used to create seperation between groups of buttons
     */

    buttons: [
        { id: 'BH_Button_Home', title: 'Home', icon: 'home', iconCls: '', hideOnPhone: true },
        { id: 'BH_Button_AskMiltonHelp', icon: 'question', title: 'AskMilton Help', iconCls: '', hideOnPhone: true },
        //{ id: 'BH_Button_Search', icon: 'search', dropdown: 'data-dropdown="#BH_SearchWindow"', title: 'Search: This will show the local/global search screen.  If the application supports a local search, it will be selectable otherwise the global search will be used.', iconCls: '', hideOnTablet: true },
        { id: 'BH_Button_Pending', icon: 'bell', title: 'Pending Requests: The number of pending approval requests you have', iconCls: '', hideOnTablet: true },
        { id: 'BH_Button_Notify', icon: 'flag', title: 'Notifications: This display the total number of unread notifications', iconCls: '', hideOnTablet: true },
        { id: 'BH_Button_MyReports', icon: 'clipboard', title: 'MyReports: Opens a window to the MyReports web site', iconCls: '', hideOnTablet: true },
        { id: 'BH_Button_LaunchApp', icon: 'rocket', dropdown: 'data-dropdown="#BH_LaunchWindow"', title: 'Launch Application', iconCls: '', hideOnTablet: true },
        //{ id: 'BH_Button_UserMenu', dropdown: 'data-dropdown="#BH_UserWindow"' },
        { id: 'BH_Button_UserMenu', icon: 'user', title: 'User Profile and Impersonation', iconCls: '', hideOnPhone: true },
        { id: 'BH_Button_Help', icon: 'question', dropdown: 'data-dropdown="#BH_HelpWindow"', title: 'Help', iconCls: '', hideOnTablet: true },
        { id: 'BH_Button_Timer', icon: 'clock-o fa-clock', title: 'Session timeout', iconCls: 'far', hideOnPhone: true },
        { id: 'BH_Button_Logout', icon: 'sign-out fa-sign-out-alt', title: 'Logout: Logs you out of the BIA system', iconCls: '' },
        { id: 'BH_Button_SASpacer', spacer: true, hideOnPhone: true },
        { id: 'BH_Button_Support', title: 'BIA Troubleshooting Support Page', icon: 'medkit', iconCls: 'BH_SAIcon', hideOnPhone: true },
        { id: 'BH_Button_ExtJSVal', icon: 'eye', title: 'Evaluate BIA ExtJS Standards and Consistency', iconCls: 'BH_SAIcon', hideOnTablet: true },
        { id: 'BH_Button_Logs', title: 'Application Log', icon: 'copy', iconCls: 'BH_SAIcon far', hideOnTablet: true },
        { id: 'BH_Button_ConnectionRefresh', title: 'Force refresh Application Connections', icon: 'plug', iconCls: 'BH_SAIcon', hideOnTablet: true },
        { id: 'BH_Button_PerformanceTracker', title: 'Track AJAX performance', iconCls: 'BH_SAIcon', hideOnTablet: true },
        //{ id: 'BH_Button_PerformanceTrackerSparkline', title: 'AJAX requests/min over Last Hour', iconCls: 'BH_SAIcon' },
        { spacer: true, appButtonSpacer: true },
    ],

    add: function () {
        var config = BIACore.Header.config,
            info = BIACore.Header.Info,
            template = this.template.join(''),
            items = [].concat(this.buttons, config.applicationButtons),
            i, item, ln = items.length, hideButton = false;

        for (i = 0; i < ln; ++i) {
            var addButton = true;
            if (BIACore.Browser.deviceType == 'Tablet' && items[i].hideOnTablet) addButton = false;
            if (BIACore.Browser.deviceType == 'Phone' && (items[i].hideOnTablet || items[i].hideOnPhone)) addButton = false;

            if (addButton) {
                //if ((!items[i].hideOnTablet && !items[i].hideOnPhone) || 
                //    (items[i].hideOnTablet && ['Tablet','Phone'].indexOf(BIACore.Browser.deviceType) == -1) || 
                //    (items[i].hideOnPhone && BIACore.Browser.deviceType != 'Phone')) {
                item = BIACore.applyIf(items[i] || {}, {
                    id: 'BH_CustomButton' + i,
                    title: '',
                    dropdown: '',
                    iconCls: 'BH_CustomIcon'
                });

                //if ((item.hideOnTablet && ['Tablet', 'Phone'].indexOf(BIACore.Browser.deviceType) > -1) || (item.hiddenOnPhone && BIACore.Browser.deviceType == 'Phone'))
                //    hideButton = true;
                //
                //if (item.style != null && hideButton) {
                //    item.style += ' display: none;';
                //}
                //else if(hideButton) {
                //    item.style = 'display: none;'
                //}

                if (item.spacer) {
                    if (!item.appButtonSpacer || (item.appButtonSpacer && config.applicationButtons.length > 0))
                        BIACore.$('#BH_ButtonBar').append('<div class="BH_Button_Spacer"></div>');

                    continue;
                }

                BIACore.$('#BH_ButtonBar').append(BIACore.String.format(template, item));

                if (item.clickFunction) {
                    BIACore.$('#BH_CustomButton' + i).click(item.clickFunction);
                }

                if (item.image) {
                    BIACore.$('#BH_CustomButton' + i).css({ 'background-image': BIACore.String.format('url({image})', item) });
                }
            }
        }

        // click events
        if (BIACore.$('#BH_Button_MyReports')) BIACore.$('#BH_Button_MyReports').click(config.myReportsFunction);
        if (BIACore.$('#BH_Button_Logout')) BIACore.$('#BH_Button_Logout').click(config.logoutFunction);
        if (BIACore.$('#BH_Button_AskMiltonHelp')) {
            if (BIACore.Security.Session.appCode != 'askmilton')
                BIACore.$('#BH_Button_AskMiltonHelp').click(config.askMiltonHelp);
            else
                BIACore.$('#BH_Button_AskMiltonHelp').toggle(false);
        }

        // visibility
        if (BIACore.$('#BH_Button_Home')) BIACore.$('#BH_Button_Home').toggle(typeof (config.homeFunction) === 'function')
            .click(config.homeFunction);
        if (BIACore.$('#BH_Button_MyReports')) BIACore.$('#BH_Button_MyReports').toggle(config.showMyReports);

        // pending requests
        if (BIACore.$('#BH_Button_Pending span')) BIACore.$('#BH_Button_Pending span').html((info.pendingRequests > 99) ? '99' : info.pendingRequests)    // foreground text
        if (BIACore.$('#BH_Button_Pending')) {
            BIACore.$('#BH_Button_Pending')
                .click(config.pendingRequestsFunction)          // click operation
                .addClass('BH_Pending')
                .toggle(config.showPendingRequests || info.pendingRequests === 0);            // visibility
        }
        if (BIACore.$('#BH_Button_Pending').length > 0) {
            BIACore.$('#BH_Button_Pending')[0].title = info.pendingRequests + ' ' +
                BIACore.$('#BH_Button_Pending')[0].title.substring(BIACore.$('#BH_Button_Pending')[0].title.indexOf('P'));
        }

        // notification count
        if (BIACore.$('#BH_Button_Notify span')) BIACore.$('#BH_Button_Notify span').html((info.notificationCount > 99) ? '99' : info.notificationCount)// foreground text
        if (BIACore.$('#BH_Button_Notify')) BIACore.$('#BH_Button_Notify').addClass('BH_Notify').toggle(config.showNotification || info.notificationCount === 0);               // visibility

        if (BIACore.$('#BH_Button_Notify').length > 0) {
            BIACore.$('#BH_Button_Notify')[0].title = info.pendingRequests + ' ' +
                BIACore.$('#BH_Button_Notify')[0].title.substring(BIACore.$('#BH_Button_Notify')[0].title.indexOf('N'));
        }

        // timeout
        var time = {
            days: Math.floor(info.minutesRemaining / 1440),
            hours: Math.floor((info.minutesRemaining % 1440) / 60),
            minutes: Math.floor(info.minutesRemaining % 60)
        };
        time.days = (time.days > 0) ? time.days + 'd ' : '';
        time.hours = (time.hours > 0) ? time.hours + 'h ' : '';
        time.minutes = time.minutes + 'm';

        if (BIACore.$('#BH_Button_Timer span')) {
            BIACore.$('#BH_Button_Timer span')
                .html(time.days + time.hours + time.minutes)
            BIACore.$('#BH_Button_Timer')
                .addClass('BH_Timer')
                .toggle(config.showTimeout);
        }

        if (BIACore.$('#BH_Button_Timer').length > 0) {
            BIACore.$('#BH_Button_Timer')[0].title = time.days + time.hours + time.minutes + ' til ' +
                BIACore.$('#BH_Button_Timer')[0].title.substring(BIACore.$('#BH_Button_Timer')[0].title.indexOf(' S') + 1);
        }

        //SA Buttons
        if (BIACore.$('.BH_Button_Spacer:first')) BIACore.$('.BH_Button_Spacer:first').toggle(BIACore.Security.User.isSA());
        if (BIACore.$('#BH_Button_Logs')) BIACore.$('#BH_Button_Logs').toggle(BIACore.Security.User.isSA());
        if (BIACore.$('#BH_Button_ConnectionRefresh')) BIACore.$('#BH_Button_ConnectionRefresh').toggle(BIACore.Security.User.isSA());
        if (BIACore.Security.User.isSA()) {
            if (BIACore.$('#BH_Button_Logs')) BIACore.$('#BH_Button_Logs').click(config.logFunction);
            if (BIACore.$('#BH_Button_ConnectionRefresh')) BIACore.$('#BH_Button_ConnectionRefresh').click(config.connectionRefreshFunction);
        }
        if (BIACore.$('#BH_Button_Support')) BIACore.$('#BH_Button_Support').click(config.biaSupportFunction);

        //Tools Buttons
        var isDEVorQA = BIACore.Config.environment == 'DEV' || BIACore.Config.environment == 'QA';
        if (BIACore.$('#BH_Button_AskMiltonHelp')) BIACore.$('#BH_Button_AskMiltonHelp').toggle(isDEVorQA);

        var showExtJSValButton = typeof Ext != "undefined" && (isDEVorQA || (BIACore.Security.User.isSA() && !isDEVorQA)) //&& !/localhost/i.test(window.location.host);
        if (BIACore.$('#BH_Button_ExtJSVal')) BIACore.$('#BH_Button_ExtJSVal').toggle(showExtJSValButton);
        if (showExtJSValButton && BIACore.$('#BH_Button_ExtJSVal')) {
            BIACore.$('#BH_Button_ExtJSVal').click(config.extjsCompliance);
        }
        var showPerformancTracker = typeof Ext != "undefined" && (isDEVorQA || (BIACore.Security.User.isSA() && !isDEVorQA)) //&& !/localhost/i.test(window.location.host);
        if (BIACore.$('#BH_Button_PerformanceTracker')) BIACore.$('#BH_Button_PerformanceTracker').toggle(showPerformancTracker);
        if (showPerformancTracker && BIACore.$('#BH_Button_PerformanceTracker')) {
            BIACore.$('#BH_Button_PerformanceTracker').click(config.trackAppPerformance);
        }

        //if (BIACore.$('#BH_Button_Search')) BIACore.Header.Search.add();
        if (BIACore.$('#BH_Button_UserMenu')) BIACore.Header.Impersonation.add();
        if (BIACore.$('#BH_Button_Help')) BIACore.Header.Help.add();
        if (BIACore.$('#BH_Button_LaunchApp')) BIACore.Header.Launch.add();

        if (BIACore.$('#BH_Button_Notify')) BIACore.Header.Notification.add();

        // and toggle it all off if we are supposed to hide the button bar.
        BIACore.$('#BH_ButtonBar').toggle(config.showButtonBar);
    },

    update: function () {
        var info = BIACore.Header.Info,
            config = BIACore.Header.config,
            time = {
                days: Math.floor(info.minutesRemaining / 1440),
                hours: Math.floor((info.minutesRemaining % 1440) / 60),
                minutes: Math.floor(info.minutesRemaining % 60)
            };

        time.days = (time.days > 0) ? time.days + 'd ' : '';
        time.hours = (time.hours > 0) ? time.hours + 'h ' : '';
        time.minutes = time.minutes + 'm';

        // any periodic on-screen button updates need to go here.
        if (config.showPendingRequests && BIACore.$('#BH_Button_Pending')) {
            BIACore.$('#BH_Button_Pending span')
                .html((info.pendingRequests > 99) ? '99+' : info.pendingRequests)
            BIACore.$('#BH_Button_Pending')
                .toggle(info.pendingRequests > 0);

            BIACore.$('#BH_Button_Pending')[0].title = info.pendingRequests + ' ' +
                BIACore.$('#BH_Button_Pending')[0].title.substring(BIACore.$('#BH_Button_Pending')[0].title.indexOf('P'));
        }
        if (config.showNotification && BIACore.$('#BH_Button_Notify')) {
            BIACore.$('#BH_Button_Notify span')
                .html((info.notificationCount > 99) ? '99+' : info.notificationCount)
            BIACore.$('#BH_Button_Notify')
                .toggle(info.notificationCount > 0);

            BIACore.$('#BH_Button_Notify')[0].title = info.pendingRequests + ' ' +
                BIACore.$('#BH_Button_Notify')[0].title.substring(BIACore.$('#BH_Button_Notify')[0].title.indexOf('N'));
        }

        if (BIACore.$('#BH_Button_Timer span')) BIACore.$('#BH_Button_Timer span')
            .html(time.days + time.hours + time.minutes);

        if (BIACore.$('#BH_Button_Timer').length > 0) {
            BIACore.$('#BH_Button_Timer')[0].title = time.days + time.hours + time.minutes + ' til ' +
                BIACore.$('#BH_Button_Timer')[0].title.substring(BIACore.$('#BH_Button_Timer')[0].title.indexOf(' S') + 1);
        }
    }
});