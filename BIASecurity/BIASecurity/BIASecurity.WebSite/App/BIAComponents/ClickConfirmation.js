Ext.define('BIA.Components.ClearConfirmationPopup', {
    extend: 'Ext.container.Container',
    alias: 'widget.BIA-Components-ClearConfirmationPopup',

    floating: true,
    hidden: true,
    alwaysOnTop: true,
    animateShadow: true,
    constrain: true,
    defaultAlign: 'r-r?',
    border: false,
    shadow: false,
    hideMode: 'offsets',

    style: {
        backgroundColor: '#ddd',
        borderRadius: '5px'
    },

    defaults: {
        padding: '5 10',
        margin: 5
    },
    items: [
        {
            xtype: 'button',
            itemId: 'ConfirmButton',
            cls: 'RedButton',
            focusCls: 'RedButtonFocus',
            overCls: 'RedButtonHover x-btn-hover'
        },
        {
            xtype: 'button',
            itemId: 'CancelButton',
            margin: '5 5 5 0'
        }
    ]
});

Ext.define('BIA.Controller.ClearConfirmationController', {
    extend: 'Ext.app.Controller',
    init: function init() {
        this.listen({
            component: {
                '[clickConfirmation]': {
                    clickConfirmationInit: this.ClickConfirmationInit
                },
                'BIA-Components-ClearConfirmationPopup': {
                    beforerender: this.ClearConfirmationPopupBeforeRender
                },
                'BIA-Components-ClearConfirmationPopup #ConfirmButton': {
                    click: this.ClearConfirmationPopupConfirmClick
                },
                'BIA-Components-ClearConfirmationPopup #CancelButton': {
                    click: this.ClearConfirmationPopupCancelClick
                }
            }
        });
    },
    ClickConfirmationInit: function ClickConfirmationInit(me, clickConfirmation) {
        me.addListener({
            click: {
                fn: this.ClearConfirmationClick,
                element: 'el',
                scope: this,
                args: [me]
            }
        });
    },
    ClearConfirmationClick: function ClearConfirmationClick(me, event, element, eOpts) {
        var confirmPopupConfig = {
            xtype: 'BIA-Components-ClearConfirmationPopup',
            alignTarget: me,
            renderTo: (me.up('viewport') || Ext.ComponentQuery.query('viewport')[0]).getEl(),
            constrainTo: (me.up('viewport') || Ext.ComponentQuery.query('viewport')[0]).getEl()
        };

        var confirmPopup = Ext.create(confirmPopupConfig);
        var size = {
            width: confirmPopup.getWidth(),
            height: confirmPopup.getHeight()
        };

        confirmPopup.destroy();
        confirmPopup = Ext.create(Ext.apply(confirmPopupConfig, { hidden: false, width: 0, maxHeight: size.height }));

        confirmPopup.show();

        delete size.height;

        size['left'] = confirmPopup.getX() - size.width;

        Ext.defer(function (me, size) {
            me.animate({ to: size });
        }, 1, this, [confirmPopup, size]);

        /*
        confirmPopup.getEl().slideOut('r');

        confirmPopup.animate({ to: size });
        */
    },
    ClearConfirmationPopupBeforeRender: function ClearConfirmationPopupBeforeRender(me, eOpts) {
        me.down('#ConfirmButton').text = me.alignTarget.confirmText || 'Confirm';
        me.down('#CancelButton').text = me.alignTarget.cancelText || 'Cancel';
    },
    ClearConfirmationPopupConfirmClick: function ClearConfirmationPopupConfirmClick(me, event, eOpts) {
        var clearConfirmPopup = me.up('[alignTarget]');
        if (clearConfirmPopup) {
            var clearConfirm = clearConfirmPopup.alignTarget;
            if (clearConfirm) {
                clearConfirmPopup.hide();
                clearConfirmPopup.destroy();
                clearConfirm.fireEvent('confirm', clearConfirm);
            }
        }
    },
    ClearConfirmationPopupCancelClick: function ClearConfirmationPopupCancelClick(me, event, eOpts) {
        var clearConfirmPopup = me.up('[alignTarget]');
        if (clearConfirmPopup) {
            var clearConfirm = clearConfirmPopup.alignTarget;
            if (clearConfirm) {
                clearConfirmPopup.hide();
                clearConfirmPopup.destroy();
                clearConfirm.fireEvent('clear', clearConfirm);
            }
        }
    }
});