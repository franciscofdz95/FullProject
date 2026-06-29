Ext.define('App.Controller.Access.Item.Access', {
    extend: 'Ext.app.Controller',

    init: function init() {
        var me = this;

        me.control({
            'App-View-Access-List-Item-Actions': {
                afterrender: this.AfterRenderAccessActions
            },
            'App-View-Access-List-Item-Actions-Approve': {
                afterrender: this.ActionAfterRender,
                click: this.ApproveClick
            },
            'App-View-Access-List-Item-Actions-Deny': {
                afterrender: this.ActionAfterRender,
                click: this.DenyClick
            },
            'App-View-Access-List-Item-Actions-EA': {
                afterrender: this.ActionAfterRender,
                click: this.EAClick
            },
            'App-View-Access-List-Item-Actions-Remove': {
                afterrender: this.ActionAfterRender,
                click: this.RemoveClick
            }
        });
        me.listen({});
    },
    AfterRenderAccessActions: function AfterRenderAccessActions(me) {
        var comp = me.up("[access]");
        if (comp.docked != "top") {
            var approve = me.down('App-View-Access-List-Item-Actions-Approve'),
                deny = me.down('App-View-Access-List-Item-Actions-Deny'),
                EA = me.down('App-View-Access-List-Item-Actions-EA'),
                remove = me.down('App-View-Access-List-Item-Actions-Remove');

            if (!BIACore.Security.User.isSA()) {
                EA.hide();
                approve.hide();
                deny.hide();
                remove.hide();
            }
            if (comp.access.Access == "Pending" && (comp.access.hasAccessLevel == 'SA' || comp.access.hasAccessLevel == 'Admin') && (BIACore.Security.User.isSA() || BIACore.Security.User.isAdmin())) {
                approve.show();
                deny.show();
                EA.hide();
                remove.hide();
            } else if ((comp.access.hasAccessLevel == 'SA' || comp.access.hasAccessLevel == 'Admin') && (BIACore.Security.User.isSA() || BIACore.Security.User.isAdmin())) {
                approve.hide();
                deny.hide();
                if (comp.access.ExtendedAttribPath != null && comp.access.ExtendedAttribPath != "" && BIACore.Security.Session.userId != comp.access.LoginId)
                    EA.show();
                else EA.hide();////VP Uncomment before check-in               
                remove.show();
            }
            if (BIACore.Security.Session.userId.toLowerCase() == 'dqc0jmp')
                EA.show(); ////VP Comment before check-in
        }
    },
    ActionAfterRender: function ActionAfterRender(me) {
        me.getEl().on('click', function (event, target) {
            me.fireEvent('click', me);
        });
    },
    ApproveClick: function ApproveClick(me) {
        this.doAction(me, 'Approve');
    },
    DenyClick: function DenyClick(me) {
        this.doAction(me, 'Deny');
    },
    EAClick: function EAClick(me) {
        // open a new browser window
        // NEW EA - this needs to be dynamically opening either a HTTPS URI or an XType
        var comp = me.up("[access]"),
            baseURL = 'bia',
            addSlash = '';
        if (BIACore.Config.environment == 'DEV') baseURL = 'biadev';
        if (BIACore.Config.environment == 'ALPHA') baseURL = 'biaalpha';
        if (BIACore.Config.environment == 'QA') baseURL = 'biaqa';
        if (comp.access.ExtendedAttribPath.charAt(0) != '/') addSlash = '/';
        switch (comp.access.AppCode.toUpperCase()) {
            case "BRIEF1":
                {
                    let Brief_popup = Ext.create('Ext.window.Window', {
                        title: 'BRIEF EA for ' + comp.access.LoginId
                        , id: 'BriefPopUpId'
                        , ItemId: 'tstBPID'
                        , width: 350
                        , layout: 'fit'
                        , height: 600
                        , minWidth: 600
                        , hidden: true
                        , closeAction: 'hide'
                        , closable: true
                        , collapsible: true
                        , resizable: true
                        , scrollable: false
                        , modal: true
                        , access: comp.access
                        , items: [
                            {
                                xtype: 'App-View-EA-ea_Brief'
                            },
                            {
                                xtype: 'hiddenfield',
                                name: 'hidden_field_1',
                                id: 'hdnLoginId',
                                value: '' + comp.access.LoginId
                            }
                        ]
                    });
                    Brief_popup.show();
                }
                break;
            case "ACIP":
            case "REGULATED_GOODS":            
            case "WVAR":            
            case "SVC_MAPPING":            
            case "OCM":            
            case "MYREPORTS":            
            case "CTP":            
            case "CVBAT":            
            case "BRIEF":
            //case "REVREC":
            //case "DASADVB":
            case "FLG":
            case "FDB":
                {
                    var win = Ext.create('App.View.EA.EAPopupWindow', {
                        access: comp.access
                    });
                    win.show();
                }
            break;
            // MME - 4/27/2023
            //case "QUOTEASSIST":
            case "FLOTE_V2":
            case "SCS_EPRICE":
            case "SCS_EPQR":
            case "PM_OCEAN":
            case "FREIGHTMODEL":
            case "TDPQR":
            case "PM_IAF":
            case "OCEAN_ADDLFEES":
            case "DWH_UPLOAD": {
                var OpenWindow = window.open(comp.access.ExtendedAttribPath + '?eaId=' + comp.access.UserId, 'EA', 'resizable=1');
                
            }
            break;
            default:
                if (Ext.String.startsWith(comp.access.ExtendedAttribPath, 'https', true)) {
                    var OpenWindow = window.open(comp.access.ExtendedAttribPath + '?EXTAPPCODE=' + comp.access.AppCode + '&usrSysm=' + comp.access.LoginId + '&returnURI=' + comp.access.ExtendedAttribPath, 'EA', 'width=450,height=400,resizable=1');
                }
                else {
                    var OpenWindow = window.open('https://' + baseURL + '.inside.ups.com' + addSlash + comp.access.ExtendedAttribPath + '?EXTAPPCODE=' + comp.access.AppCode + '&usrSysm=' + comp.access.LoginId + '&returnURI=' + comp.access.ExtendedAttribPath, 'EA', 'width=450,height=400,resizable=1');
                }
            break;

        }
        
    },

    RemoveClick: function RemoveClick(me) {
        this.doAction(me, 'Remove');
    },
    doAction: function doAction(me, action) {
        var view = me.up('App-View-Access-List-View'),
            comp = me.up("[access]");
        if (comp.access.SecUserId != BIACore.Security.Session.UserId) {
            var win = Ext.create('App.View.Access.ActionWindow', {
                view: view,
                access: comp.access,
                action: action
            });
            win.show();
        }
        else {
            Ext.Msg.alert('Error', 'You can\'t approve your own request.');
        }

    }
});
