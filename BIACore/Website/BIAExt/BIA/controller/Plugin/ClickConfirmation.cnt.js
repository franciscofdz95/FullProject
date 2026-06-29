Ext.define('BIA.Controller.ClearConfirmationPopup', {
    extend: 'Ext.app.Controller',
    init: function init() {
        this.listen({
            component: {
                '[clickConfirmation]': {
                    clickConfirmationInit: this.ClickConfirmationInit
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
    }
});