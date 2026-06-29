/* ====================================================================================================
NAME:			[Vendor English Name Filter]
BEHAVIOR:		Shows Vendor english Name Filter.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/26/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.View.Component.Filter.VendorEnglishName', {
    extend: 'BIA.container.FilterContainer',
    alias: 'widget.App-View-Component-Filter-VendorEnglishName',
    layout: 'vbox',
    items: [
         { xtype: 'label', text: 'Vendor English Name:', baseCls: 'UPS_White' },

         {
             xtype: 'textfield',
             itemId: 'VendorEnglishName',
             emptyText: 'Vendor English Name',
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
                 PgAtt.setVendor_Name_English('');
                 this.onChange('');
             }
             
         }

    ]
});