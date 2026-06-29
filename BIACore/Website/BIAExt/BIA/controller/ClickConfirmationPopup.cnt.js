Ext.define('BIA.Controller.ClearConfirmationPopup', {
    extend: 'Ext.app.Controller',
    init: function init() {
        this.listen({
            component: {
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