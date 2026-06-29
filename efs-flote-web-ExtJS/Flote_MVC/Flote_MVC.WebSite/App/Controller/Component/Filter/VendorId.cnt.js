/* ====================================================================================================
NAME:			[Vendor Id Filter Controller ]
BEHAVIOR:		Vendor Id filter criteria.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/24/2017        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.Controller.Component.Filter.VendorId', {
    extend: 'Ext.app.Controller',
    init: function () {
        this.control({
            'App-View-Component-Filter-VendorId textfield': {
                change: this.VendorIdChange
            }
        });
    },
    VendorIdChange: function VendorIdChange(me, newValue, oldValue, eOpts) {
        if (!Ext.isEmpty(newValue) && newValue.length > 0) {
            me.getTrigger('clear').show();
            PgAtt.setVendor_id(newValue);
        } else {
            me.getTrigger('clear').hide();
            PgAtt.setVendor_id('');
        }
        me.updateLayout();
    }

});