/* ====================================================================================================
NAME:			[Vendor Name Filter Controller ]
BEHAVIOR:		Vendor  Name filter criteria.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
03/23/2020       Rama Yagati		 Created.
 ======================================================================================================*/
Ext.define('App.Controller.Component.Filter.VendorName', {
    extend: 'Ext.app.Controller',
    init: function () {
        this.control({
            'App-View-Component-Filter-VendorName textfield': {
                change: this.VendorNameChange
            }
        });
    },
    VendorNameChange: function VendorEnglishNameChange(me, newValue, oldValue, eOpts) {
        if (!Ext.isEmpty(newValue) && newValue.length > 0) {
            me.getTrigger('clear').show();
            PgAtt.setVendorName(newValue);
        } else {
            me.getTrigger('clear').hide();
            PgAtt.setVendorName('');
        }
        me.updateLayout();
    }

});