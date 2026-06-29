BIACore.define('BIACore.Header', {
    template: [
        '<div class="BH_Header">',
        '<div class="BH_Segment BH_Start"><img id="BH_Logo_App" src="{logoPath}" class="BH_Image BH_Logo BH_Clickable" alt="UPS"></div>',
        '<div class="BH_Segment">',
        '<div id="BH_App_Name" class="BH_Segment_Half BH_Text BH_Text_Large BH_Clickable"></div>',
        '<div class="BH_Segment_Half" id="BH_ButtonBar"></div>',
        '</div>',
        '<div class="BH_Segment BH_Right BH_End"><div id="BH_Logo_BIA" class="BH_Image BH_Logo BH_Clickable"></div></div>',
        '<div class="BH_Segment BH_Right BH_Pad_Down">',
        '<div id="BH_User_Name" class="BH_Text BH_Text_Small"></div>',
        '<div id="BH_Session" class="BH_Text BH_Text_Small" title="Session Information: This shows your browser mode (IE8,IE9,etc) along with the server you are currently connected to. If a slash is present with your IE version, the second value is the document mode.  A second slash indicates compatibility mode."></div>',
        '<div id="BH_OtherTool" style="padding: 5px 0px 0px 0px;">',
        '<select id="BH_OtherTools" data-bind="selectedText: dropdownValue" style="background-color: #9CE6FC;width: 200px;">',
        '<option value="">Other Tools</option>',
        '</select>',
        '</div>',
        '</div>',
        '<span class="BH_Env_Watermark"></span>',
        '</div>'
    ],
    mobileTemplate: [
        '<div class="BH_Header Mobile">',
        '<div class="BH_Segment BH_Start"><div id="BH_Mobile_Logo_BIA" class="BH_Image BH_Clickable"></div></div>',
        //'<div class="BH_Segment BH_Start"><img id="BH_Logo_App" src="{logoPath}" class="BH_Image BH_Logo BH_Clickable" alt="UPS"></div>',
        '<div class="BH_Segment">',
        '<div id="BH_App_Name" class="BH_Segment_Half BH_Text BH_Text_Large BH_Clickable"></div>',
        '</div>',
        '<div class="BH_Segment BH_Right">',
        '<div class="BH_Segment_Half" id="BH_ButtonBar"></div>',
        '<div id="BH_User_Name" class="BH_Text BH_Text_Small"></div>',
        '<div id="BH_Session" class="BH_Text BH_Text_Small" title="Session Information: This shows your browser mode (IE8,IE9,etc) along with the server you are currently connected to. If a slash is present with your IE version, the second value is the document mode.  A second slash indicates compatibility mode."></div>',
        '<div id="BH_OtherTool" style="padding: 5px 0px 0px 0px;">',
        '<select id="BH_OtherTools" data-bind="selectedText: dropdownValue" style="background-color: #9CE6FC;width: 200px;">',
        '<option value="">Other Tools</option>',
        '</select>',
        '</div>',
        '</div>',
        '<span class="BH_Env_Watermark"></span>',
        '</div>'
    ]
}, function (me) {

    var _timer = null, _info = {}, _adminLinks = {},
        _showHideMobileComponents = function () {
            if (BIACore.Browser.deviceType == 'Phone') {
                BIACore.$('#BH_Mobile_Logo_BIA').toggle(true);
                BIACore.$('#BH_Logo_BIA').toggle(false);
                BIACore.$('#BH_Logo_App').toggle(false);
                //BIACore.$('.BH_Env_Watermark').toggle(false);
                BIACore.$('#BH_User_Name').toggle(false);
                BIACore.$('#BH_Session').toggle(false);
            }
        },
        _template = function () {
            var config = me.config,
                mode = ((document.documentMode) && (BIACore.Browser.version !== document.documentMode)) ? '/' + document.documentMode  +
                    ((BIACore.Browser.compatibilityMode) ? 'C' : '') : '';

            // set our base Info items
            _info = {
                logoPath: config.applicationLogo || BIACore.URL.EmptyLogo,
                browserMode: BIACore.Browser.browser + BIACore.Browser.version + mode,
                //serverName: BIACore.Config.serverName,
                serverName: BIACore.Config.biaServer,
                domainName: BIACore.Config.biaServerDomain,
                
                //environment: (BIACore.Config.environment !== '') ? ' <span style="color:#ffd124">(' + BIACore.Config.environment + ')</span>' : '',
                //environment: (BIACore.Config.environment !== '') ? ' <div class="BH_Env_Watermark">' + BIACore.Config.environment + '</div>' : '',
                url: config.applicationURL || ''
            };
            if (config.applicationName !== '') {
                _info.name = config.applicationName;
            }

            // clone it.
            me.Info = BIACore.apply({}, _info);

            // add template
            BIACore.$(config.target)
                .addClass('biacore2')
                .css('z-index', BIACore.$.topZIndex() + 1)
                .css('font-size', '12px')
                .append(BIACore.String.format((BIACore.Browser.deviceType != 'Desktop' ? me.mobileTemplate : me.template).join(''), me.Info));

            // apply defaults
            BIACore.$('#BH_Logo_BIA').click(config.logoFunction);
            BIACore.$('#BH_Mobile_Logo_BIA').click(config.logoFunction);
            BIACore.$('#BH_Logo_App').click(config.homeFunction);
            BIACore.$('#BH_App_Name').click(config.homeFunction);

            if (BIACore.Config.environment !== '') {
                var envMapping = {
                    'DEV': 'Development', 'QA': 'QA', 'ALPHA': 'Alpha'
                };
                BIACore.$('.BH_Env_Watermark').text(BIACore.Browser.deviceType == 'Phone' ? BIACore.Config.environment : envMapping[BIACore.Config.environment])

                var watermarkReposition = function () {
                    BIACore.$('.BH_Env_Watermark').css({ left: ((BIACore.$(window).width() - BIACore.$('.BH_Env_Watermark').width()) / 2).toString() + 'px' });
                }

                window.setTimeout(function () {
                    watermarkReposition();
                    BIACore.$(window).on('resize', watermarkReposition);
                }, 100);
            }

            BIACore.Header.Buttons.add();
            BIACore.Header.OtherTools.add();

            _showHideMobileComponents();
        },
        _inject = function (target, config) {
            var config = config || {};

            // if our target doesn't exist, get out of here.
            if (target === null || target === '' || !BIACore.$('#' + target).exists()) {
                BIACore.Console('nowhere to inject: header target (' + target + ') not found');
                return;
            }

            me.config.target = '#' + target;

            // overwrite default config with passed in values (if any)
            BIACore.ifApply(me.config, config);

            // manual re-write until i can get everybody converted.
            if (config.otherTools) {
                me.config.showOtherTools = config.otherTools;
            }

            // header-only mode will have base appCode = '' and a provided appCode on inject.
            if (BIACore.Config.appCode === '' &&
                typeof (config.appCode) === 'string' &&
                config.appCode !== '') {
                BIACore.Config.appCode = config.appCode;
            }

            // and while that's happening, go ahead and draw the header
            _template();
            // and send the request to fill in the details.
            me.update();
            if (window.location.pathname !== '/Login.aspx') {
                // and kick off the timer to update every N seconds
                _timer = BIACore.$.timer(me.update, 1 * 60 * 1000, true);
            }
        },
        _update_final = function () {
            // hit any sections' update function to refresh the on-screen data.
            BIACore.Header.Buttons.update();

            // update application logo
            if (BIACore.$('#BH_Logo_App').attr('src') !== BIACore.String.format('{logoPath}', me.Info)) {
                BIACore.$('#BH_Logo_App').attr('src', BIACore.String.format('{logoPath}', me.Info));
            }

            // refresh application name
            me.refreshApplicationName();

            // refresh user name.
            BIACore.$('#BH_User_Name')
                .html(
                ((me.Info && me.Info.userId)
                    ? BIACore.String.format('{firstName} {lastName} ({userId})', me.Info)
                    : '(Unknown)' // using &nbsp; keeps our space; otherwise date/browser push up.
                ) + ' | BIACore V' + BIACore.Config.getVersion()//+ BIACore.String.format(' | BIACore V{major}.{minor}', BIACore.Config.version)
                );
            // refresh 'date'.
            BIACore.$('#BH_Session')
                .html(((typeof (me.Info.biaServerDomain) !== 'undefined' || me.Info.biaServerDomain !== '')
                    && (typeof (me.Info.biaServer) !== 'undefined' || me.Info.biaServerDomain != '')) ?
                    BIACore.String.format('{date} | {browserMode} | {domainName} ({serverName}) ', me.Info) : 
                    BIACore.String.format('{date} | {browserMode} | BIA? ', me.Info)
                );

            _showHideMobileComponents();

        },
        _qualify = function (url) {
            var temp = (url || '').toLowerCase(),
                result = '';

            if (temp.indexOf('http') < 0) { result += BIACore.Config.server; }
            if (temp.charAt(0) !== '/' && temp.indexOf('http') < 0) { result += '/bia/apps/'; }
            result += url;

            return result;
        };

    BIACore.apply(me, {
        inject: function (target, config) {
            // been having issues with some people forgetting to wait for onReady before injecting.
            // so let's wrap it up for them.
            BIACore.onReady(function () {
                BIACore.ajax({
                    url: BIACore.URL.AdminUserHeaderLinks,
                    data: {
                        //SessionId: BIACore.Config.sessionId()
                        TokenLocal: BIACore.Config.tokenLocal(),
                        AppCode: BIACore.Config.appCode
                    },
                    success: function (data) {
                        for (var i = 0; i < data.length; i++) {
                            _adminLinks[data[i].LinkName] = data[i].LinkString;
                        }
                    }
                });

                _inject(target, config);
            });
        },

        update: function () {
            BIACore.ajax({
                url: BIACore.URL.Application,
                data: {
                    AppCode: BIACore.Config.appCode,
                    //SessionId: BIACore.Config.sessionId()
                    TokenLocal: BIACore.Config.tokenLocal()
                },
                success: function (data) {

                    if (BIACore.Config && BIACore.Config.debug && BIACore.Object.toQueryString(data) != BIACore.Object.toQueryString(me.Info)) BIACore.Console('refreshed Application Info');

                    // copy out our shadow Info object
                    me.Info = BIACore.apply({}, _info);
                    // this is the only override from data that can update the base Info.
                    if (me.Info.logoPath === BIACore.URL.EmptyLogo && data.logoPath) {
                        me.Info.logoPath = _qualify(data.logoPath);
                    }
                    if (me.Info.url === '' && data.returnPath) {
                        me.Info.url = _qualify(data.returnPath);
                    }
                    //if (!/^bia/i.test(me.Info.name)) {
                    //    me.Info.preName = 'BIA - ';
                    //}

                    BIACore.applyIf(me.Info, data);
                    _update_final();
                }
            });
        },

        refreshApplicationName: function () {
            var appNameFormat = (BIACore.Browser.deviceType == 'Phone' ? '{preName}{appCode}' : '{preName}{name}') + (me.config.applicationAltName != null ? me.config.applicationAltName : '');
            // refresh application name
            BIACore.$('#BH_App_Name')
                .html(BIACore.String.format(appNameFormat, me.Info) + (me.Info.active === 'N' ? ' [Offline]' : ''));
        },

        /**
         * @cfg {Boolean} [showButtonBar=true]
         * Show/hide the primary button bar (home/notifications/logout).
         */

        /**
         * @cfg {Boolean} [showNotification=false]
         * Show the Header Notification button
         */

        /**
         * @cfg {Boolean} [showPendingRequests=true]
         * Show the Pending Requests button
         */

        /**
         * @cfg {Boolean} [showLauncher=false]
         * Show the Launcher button
         */

        /**
         * @cfg {Boolean} [showSearch=true]
         * Show the Search button
         */

        /**
         * @cfg {Boolean} [showMyReports=true]
         * Show the MyReports button
         */

        /**
         * @cfg {Boolean} [showUserMenu=true]
         * Show the User Information/Impersonation button
         */

        /**
         * @cfg {Boolean} [showHelpMenu=false]
         * Show the Help button
         */

        /**
         * @cfg {Boolean} [showOtherTools=false]
         * Show the Other Tools combo box
         */

        /**
         * @cfg {Boolean} [showTimeout=false]
         * Show the Timeout button
         */

        /**
         * @cfg {Boolean} [showLauncher=false]
         * Show the Launcher menu
         */

        /**
         * @cfg {Function} homeFunction
         * Function that is called when the user clicks the 'home' button
         */

        /**
         * @private
         * @cfg {Function} logoutFunction
         * Function that is called when the user clicks the 'logout' button
         */

        /**
         * @cfg {Function} logoFunction
         * Function that is called when the user clicks the application icon/name
         */

        /**
         * @cfg {Function} myReportsFunction
         * Function that is called when the user clicks the 'MyReports' button
         */

        /**
         * @cfg {Function} pendingRequestsFunction
         * Function that is called when the user clicks the 'Pending Requests' button
         */

        /**
         * @cfg {Function} searchFunction
         * Function that is called when the user clicks the 'Search' button
         */

        /**
         * @deprecated
         * @cfg {String} applicationURL
         * URL for the 'home' of this application. Provided by Security.
         */

        /**
         * @deprecated
         * @cfg {String} applicationName
         * 'name' of this application. Provided by Security.
         */

        /**
         * @deprecated
         * @cfg {String} applicationLogo
         * URL of the logo for this application. Provided by Security.
         */

        /**
         * @cfg {String} applicationCode
         * The application code; usually provided by biacore.json or web.config.
         * Can be used in conjunction with stand-alone mode to have header work without security being enabled.
         */

        /**
         * @cfg {Object[]} applicationButtons
         * A list of application-provided buttons to place to the right of the header's default button list.
         * Only accepts an object of the form { title: '', clickFunction: function() {} }
         */

        /**
         * @deprecated
         * @cfg {Object[]} helpMenuItems
         * An array of objects to add to the help menu. Left over from Nick's Header, never actually used.
         */

        config: {
            showButtonBar: true,
            showNotification: false,
            showPendingRequests: true,
            showLauncher: false,
            showSearch: false,
            showMyReports: true,
            showUserMenu: true,         // disables impersonation/delegation menu
            showHelpMenu: false,
            showOtherTools: false,
            showTimeout: false,

            homeFunction: function () {
                var url = BIACore.Header.Info.url;
                if (url !== '') {
                    window.location.href = url;
                }
            },
            logoutFunction: function () {
                BIACore.Security.logout();
            },
            logoFunction: function () {
                var url = BIACore.Config.server + '/home/';
                BIACore.Window.Open(url, 'BIAHome', { status: 1, width: 800, height: 600 });
            },
            myReportsFunction: function () {
                var url = BIACore.Config.server + '/bia/apps/MyReports/default.cfm';
                BIACore.Window.Open(url, 'MyReportsWindow', { status: 1, width: 800, height: 600 });
            },
            pendingRequestsFunction: function () {
                var url = 'https://biasecurity.bia.inside.ups.com';
                if (BIACore.Config.environment.toUpperCase() == "ALPHA")
                    url = 'https://biasecurity.biaalpha.inside.ups.com';
                if (BIACore.Config.environment.toUpperCase() == "DEV")
                    url = 'https://biasecurity.biadev.inside.ams1907.com';
                BIACore.Window.Open(url, 'BIAPendingRequests', { status: 1, width: 800, height: 600 });
            },
            logFunction: function () {
                if (BIACore.Security.User.isSA() && _adminLinks["log"] != null) {
                    var url = _adminLinks["log"] + '?historyToken=gotoNewContent~|' + BIACore.Security.Session.appCode.toString().toUpperCase();
                        //BIACore.$.param({
                        //    historyToken: 'gotoNewContent~NULL|' + BIACore.Security.Session.appCode.toString().toUpperCase()
                            //window.JSON.stringify({
                            //    xtype: 'App-View-Admin-Logs-Container',
                            //    noChangeIfSameXtype: true,
                            //    deeplinkData: {
                            //        currentPage: 1,
                            //        filterParams: { AppCode: [BIACore.Security.Session.appCode.toString().toUpperCase()] }
                            //    }
                            //})
                        //});
                    BIACore.Window.Open(url, 'BIAApplicationLogs_' + BIACore.Security.Session.appCode.toString().toUpperCase(), {}, true);
                }
            },
            connectionRefreshFunction: function () {
                if (BIACore.Security.User.isSA() && _adminLinks["connectionReset"] != null) {
                    BIACore.ajax({
                        url: _adminLinks["connectionReset"],
                        dataType: 'json',
                        async: false,
                        data: {
                            TokenLocal: BIACore.Config.tokenLocal()
                        },
                        success: function () {
                            window.alert('Connections refresh completed successfully.');
                        },
                        error: function (jqxhr, status, error) {
                            window.alert('Connections refresh failed.<br/>' + status + ': ' + jqxhr.responseText);
                        }
                    });
                }
            },
            extjsCompliance: function () {
                BIACore.Header.ExtJSVal.Evaluate();
            },
            askMiltonHelp: function () {
                var url = BIACore.Config.server + '/apps/askmilton/default.aspx?' + BIACore.$.param({
                    domain: BIACore.Security.Session.appCode
                });
                BIACore.Window.Open(url, 'AskMiltonHelp', {}, true);
            },
            trackAppPerformance: function () {
                BIACore.Header.PerformanceTracker.StartTracker();
            },
            biaSupportFunction: function () {
                var url = BIACore.Config.serviceURI + 'Support.aspx';
                BIACore.Window.Open(url, 'BIASupportTroubleshooting', {}, true);
            },
            applicationURL: '',
            applicationName: '',
            applicationLogo: '',
            applicationCode: '',
            applicationButtons: [],
            helpMenuItems: []
        }
    });

});

