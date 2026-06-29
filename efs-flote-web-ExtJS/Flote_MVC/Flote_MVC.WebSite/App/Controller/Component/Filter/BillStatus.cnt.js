/* ====================================================================================================
NAME:			[Bill Status Filter Controller ]
BEHAVIOR:		Bill Status  filter criteria.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/24/2017        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.Controller.Component.Filter.BillStatus', {
    extend: 'Ext.app.Controller',
    init: function () {
        this.control({
            'App-View-Component-Filter-BillStatus clearCombo': {
                afterrender: this.BillStatusAfterRender,
                change: this.BillStatusChange,
                clear: this.BillStatusClear
            }
        });
    },
    BillStatusChange: function BillStatusChange(me, newValue, oldValue, eOpts) {
        if (!Ext.isEmpty(newValue) && newValue.length > 0) {
            me.getTrigger('clear').show();
            PgAtt.setInvoice_status(newValue);
        } else {
            me.getTrigger('clear').hide();
            PgAtt.setInvoice_status('All');
        }
        me.updateLayout();
    },
    BillStatusAfterRender: function BillStatusAfterRender(me) {
        if (me.getValue() != '') {
            me.getTrigger('clear').show();
        }
    },
    BillStatusClear: function BillStatusClear(me) {
        me.reset();
        me.getTrigger('clear').hide();
        me.fireEvent('onclear', me, me.getValue());
        me.updateLayout();
        PgAtt.setInvoice_status('All');
        this.BillStatusChange(me, '');
    }
});