/* ====================================================================================================
NAME:			[Vendor English Name Filter Controller ]
BEHAVIOR:		Vendor English Name filter criteria.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/24/2017        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.Controller.Component.Filter.VendorEnglishName', {
    extend: 'Ext.app.Controller',
    init: function () {
        this.control({
            'App-View-Component-Filter-VendorEnglishName textfield': {
                change: this.VendorEnglishNameChange
            }
        });
    },
    VendorEnglishNameChange: function VendorEnglishNameChange(me, newValue, oldValue, eOpts) {
        if (!Ext.isEmpty(newValue) && newValue.length > 0) {
            me.getTrigger('clear').show();
            PgAtt.setVendor_Name_English(newValue);
        } else {
            me.getTrigger('clear').hide();
            PgAtt.setVendor_Name_English('');
        }
        me.updateLayout();
    }

});