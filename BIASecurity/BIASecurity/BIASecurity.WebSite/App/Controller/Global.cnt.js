Ext.define('App.Controller.Global', {
    extend: 'Ext.app.Controller',
    refs: [
        { selector: 'App-View-Content-Container[hidden=false][rendered=true]', ref: 'Content' }
    ],
    init: function init() {
        var me = this;

        me.control({
            'button menu': {
                beforeshow: this.ButtonMenuBeforeShow,
                //show: this.ButtonMenuShow,
                //hide: this.ButtonMenuHide,
                beforehide: this.ButtonMenuBeforeHide,
                beforerender: this.ButtonMenuBeforeRender//,
                //render: this.ButtonMenuRender,
                //afterrender: this.ButtonMenuAfterRender
            },
            'tooltip': {
                beforerender: this.ClearOtherTooltips,
                show: this.ClearOtherTooltips
            },
            '[store][loadStoreOnInit=true]': {
                afterrender: this.StoreCmpLoadStoreOnInitAfterRender
            },
            'field': {
                beforerender: this.FieldBeforeRender,
                focusenter: { fn: this.FieldFocusEnter, delay: 1 },
                focusleave: { fn: this.FieldFocusLeave, delay: 2 }
            },
            'segmentedbutton': {
                beforerender: this.SegmentedButtonBeforeRender,
                change: this.SegmentedButtonChange
            }
        });
        //me.listen({
        //    //store: {
        //    //    '*': {
        //    //        load: this.WebAPIStoreLoad
        //    //    }
        //    //}
        //});
    },
    ButtonMenuBeforeRender: function ButtonBeforeRender(me, eOpts) {
        me.slideDuration = 250;
        me.shadow = false;
    },
    //ButtonMenuRender: function ButtonMenuRender(me, eOpts) {        

    //},
    //ButtonMenuAfterRender: function ButtonMenuAfterRender(me, eOpts) {
    //},
    ButtonMenuBeforeShow: function ButtonMenuBeforeShow(me, eOpts) {
        if (me.getEl()) {
            if (!me.menuSlideIn) {
                if (me.getEl()) {
                    me.getEl().slideIn('tr', {
                        callback: function callback() {
                            this.shadow = true;
                            this.updateLayout({ root: true });
                            this.up('button').showMenu();
                        },
                        scope: me,
                        duration: me.slideDuration
                    });
                    me.menuSlideIn = true;
                    return false;
                }
            }
            else {
                delete me.menuSlideIn;
            }
        }
    },
    //ButtonMenuShow: function ButtonMenuShow(me, eOpts) {
    //},
    ButtonMenuBeforeHide: function ButtonMenuBeforeHide(me, eOpts) {
        me.shadow = false;
        me.updateLayout({ root: true });
        if (!me.menuSlideOut) {
            if (me.getEl()) {
                me.getEl().slideOut('tr', {
                    callback: function callback() {
                        var menuItems = this.query('>');
                        for (index in menuItems) {
                            menuItems[index].getEl().removeCls('x-menu-item-active')
                        }
                        this.hide();
                    },
                    scope: me,
                    duration: me.slideDuration * 2
                });
                me.menuSlideOut = true;
                return false;
            }
        }
        else {
            delete me.menuSlideOut;
        }
    },
    //ButtonMenuHide: function ButtonMenuHide(me, eOpts) {
    //},
    //WebAPIStoreLoad: function WebAPIStoreLoad(store, records, success, eOpts) {
    //    //Ext.log({ msg: 'WebAPIStoreLoad Global Handler', dump: arguments });
    //},
    //This is to cleanup the annoying hovers that stay displayed after focus is lost on their element
    ClearOtherTooltips: function ClearOtherTooltips(me) {
        var otherVisibleAutohideTooltips = Ext.ComponentQuery.query('tooltip[hidden=false][autoHide=true][id!="' + me.id + '"]');
        for (var i = 0; i < otherVisibleAutohideTooltips.length; i++) {
            otherVisibleAutohideTooltips[i].hide();
        }
    },
    StoreCmpLoadStoreOnInitAfterRender: function StoreCmpLoadStoreOnInitAfterRender(me) {
        if (me.store && !me.store.isLoading() && !me.store.isLoaded()) me.store.load();
    },
    FieldBeforeRender: function FieldBeforeRender(me) {
        if (Ext.isFunction(me.setEditable)) {
            Ext.Function.interceptAfter(me,'setEditable', this.FieldSetEditableCls);
            this.FieldSetEditableCls.call(me);
        }
    },
    FieldSetEditableCls: function FieldSetEditableCls() {
        var me = this;
        if (BIACore.Security.User.isSA()) me.editable = true;
        if (me.editable === true) me.addCls(Ext.baseCSSPrefix + 'form-editable');
        else me.removeCls(Ext.baseCSSPrefix + 'form-editable');

        var fieldSetEditableIcon = function fieldSetEditableIcon(field) {
            if (field.rendered) {
                if (field.up("[showFieldEditPencil=true]")) {
                    if (field.editable === true) {
                        var editIcon = '<i class="fa fa-pencil" style="float: right; margin-top: {marginTop}px;"></i>',
                            marginTop = (Math.floor((me.inputWrap.getHeight() - 12) / 2) + 12) * -1;
                        Ext.DomHelper.insertHtml('beforeEnd', me.inputWrap.dom, editIcon.replace('{marginTop}',marginTop));
                    }
                    else {
                        var editIconDom = me.inputWrap.down('.fa.fa-pencil');
                        if (editIconDom) editIconDom.destroy();
                    }
                }
            }
            else {
                field.addListener({
                    afterrender: { fn: arguments.callee, scope: me, single: true, args: [arguments[0]] }
                });
            }
        }

        fieldSetEditableIcon(me);
    },
    FieldFocusEnter: function FieldFocusEnter(me) {
        if (me.inputEl && me.inputEl.dom && me.inputEl.dom.selectionStart > 0 && me.inputEl.dom.readOnly !== true) me.addCls(Ext.baseCSSPrefix + 'form-active');
    },
    FieldFocusLeave: function FieldFocusLeave(me) {
        me.removeCls(Ext.baseCSSPrefix + 'form-active')
    },
    SegmentedButtonBeforeRender: function SegmentedButtonBeforeRender(me) {
        if (me.toggleText) {
            var buttons = me.query('button');
            Ext.each(buttons, function (a) {
                a.originalText = a.getText();
                a.setText(a.originalText + ': ' + Ext.String.capitalize(a.pressed.toString()));
            });
        }
    },
    SegmentedButtonChange: function SegmentedButtonChange(me, button, isPressed) {
        if (me.toggleText) {
            var buttons = me.query('button');
            Ext.each(buttons, function (a) {
                a.setText(a.originalText + ': ' + Ext.String.capitalize(a.pressed.toString()));
            });
        }
    }
});