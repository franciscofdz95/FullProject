/* ====================================================================================================
NAME:			[Vendor Legal Name Filter Controller ]
BEHAVIOR:		Vendor Legal Name filter criteria.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/24/2017        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.Controller.Component.Filter.VendorLegalName', {
    extend: 'Ext.app.Controller',
    init: function () {
        this.control({
            'App-View-Component-Filter-VendorLegalName textfield': {
                change: this.VendorLegalNameChange
            }
        });
    },
    VendorLegalNameChange: function VendorLegalNameChange(me, newValue, oldValue, eOpts) {
        if (!Ext.isEmpty(newValue) && newValue.length > 0) {
            me.getTrigger('clear').show();
            PgAtt.setVendor_Legal_Name(newValue);
        } else {
            me.getTrigger('clear').hide();
            PgAtt.setVendor_Legal_Name('');
        }
        me.updateLayout();
    }

});