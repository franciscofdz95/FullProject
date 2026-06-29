/* ====================================================================================================
NAME:			[Invoice Ref No Filter Controller ]
BEHAVIOR:		Invoice Ref No  filter criteria.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/24/2017        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.Controller.Component.Filter.InvoiceRefNo', {
    extend: 'Ext.app.Controller',
    init: function () {
        this.control({
            'App-View-Component-Filter-InvoiceRefNo clearCombo': {
                afterrender: this.InvoiceRefNoAfterRender,
                change: this.InvoiceRefNoChange,
                clear: this.InvoiceRefNoClear
            }
        });
    },
    InvoiceRefNoChange: function InvoiceRefNoChange(me, newValue, oldValue, eOpts) {
        if (!Ext.isEmpty(newValue) && newValue.length > 0) {
            me.getTrigger('clear').show();
            PgAtt.setInvRefNo(newValue);
        } else {
            me.getTrigger('clear').hide();
            PgAtt.setInvRefNo('');
        }
        me.updateLayout();
    },
    InvoiceRefNoAfterRender: function InvoiceRefNoAfterRender(me) {
        if (me.getValue() != '') {
            me.getTrigger('clear').show();
        }
    },
    InvoiceRefNoClear: function InvoiceRefNoClear(me) {
        me.reset();
        me.getTrigger('clear').hide();
        me.fireEvent('onclear', me, me.getValue());
        me.updateLayout();
        PgAtt.setInvRefNo('');
        this.InvoiceRefNoChange(me, '');
    }
});