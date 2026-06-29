/* ====================================================================================================
NAME:			[Image Number Filter Controller ]
BEHAVIOR:		Image Number filter criteria.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/24/2017        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.Controller.Component.Filter.InvoiceId', {
    extend: 'Ext.app.Controller',
    init: function () {
        this.control({
            'App-View-Component-Filter-InvoiceId textfield': {
                change: this.InvoiceIdChange
            }
        });
    },
    InvoiceIdChange: function InvoiceIdChange(me, newValue, oldValue, eOpts) {
        if (!Ext.isEmpty(newValue) && newValue.length > 0) {
            me.getTrigger('clear').show();
            PgAtt.setInvoice_id(newValue);
        } else {
            me.getTrigger('clear').hide();
            PgAtt.setInvoice_id('');
        }
        me.updateLayout();
    }

});