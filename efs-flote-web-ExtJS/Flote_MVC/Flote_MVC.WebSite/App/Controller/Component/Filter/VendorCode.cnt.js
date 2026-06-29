/* ====================================================================================================
NAME:			[Vendor Code Filter Controller ]
BEHAVIOR:		Vendor Code  filter criteria.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/24/2017        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.Controller.Component.Filter.VendorCode', {
    extend: 'Ext.app.Controller',
    init: function () {
        this.control({
            'App-View-Component-Filter-VendorCode clearCombo': {
                afterrender: this.VendorCodeAfterRender,
                change: this.VendorCodeChange,
                clear: this.VendorCodeClear
            }
        });
    },
    VendorCodeChange: function VendorCodeChange(me, newValue, oldValue, eOpts) {
        if (!Ext.isEmpty(newValue) && newValue.length > 0) {
            me.getTrigger('clear').show();
            PgAtt.setVendor_code(newValue);
        } else {
            me.getTrigger('clear').hide();
            PgAtt.setVendor_code('');
        }
        me.updateLayout();
    },
    VendorCodeAfterRender: function VendorCodeAfterRender(me) {
        if (me.getValue() != '') {
            me.getTrigger('clear').show();
        }
    },
    VendorCodeClear: function VendorCodeClear(me) {
        me.reset();
        me.getTrigger('clear').hide();
        me.fireEvent('onclear', me, me.getValue());
        me.updateLayout();
        PgAtt.setVendor_code('');
        IProcessingSCls.setIsFilterFieldRemoved(true);
        this.VendorCodeChange(me, '');
    }
});