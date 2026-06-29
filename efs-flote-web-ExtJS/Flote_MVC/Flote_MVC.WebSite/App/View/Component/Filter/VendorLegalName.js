/* ====================================================================================================
NAME:			[Vendor Legal Name Filter]
BEHAVIOR:		Shows Vendor legal Name Filter.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/26/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.View.Component.Filter.VendorLegalName', {
    extend: 'BIA.container.FilterContainer',
    alias: 'widget.App-View-Component-Filter-VendorLegalName',
    layout: 'vbox',
    items: [
         { xtype: 'label', text: 'Vendor Legal Name:', baseCls: 'UPS_White' },

         {
             xtype: 'textfield',
             itemId: 'VendorLegalName',
             emptyText: 'Vendor Legal Name',
             allowBlank: true,
             width: 200,
             inputWidth: 200,
             triggers: {
                 clear: {
                     weight: 0,
                     cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                     hidden: true,
                     handler: 'onClearClick',
                     scope: 'this'
                 }
             },

             /**
              * @method onClearClick
              * execute when  clear trigger is clicked
              */
             onClearClick: function () {
                 var me = this;
                 me.reset();
                 me.getTrigger('clear').hide();
                 me.fireEvent('onclear', me, me.getValue());
                 me.updateLayout();
                 PgAtt.setVendor_Legal_Name('');
                 this.onChange('');
             }

         }
    ]
});