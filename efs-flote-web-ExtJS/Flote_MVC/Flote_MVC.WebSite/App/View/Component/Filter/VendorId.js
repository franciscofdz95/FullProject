/* ====================================================================================================
NAME:			[Vendor Id Filter]
BEHAVIOR:		Shows Vendor Id Filter.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/26/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.View.Component.Filter.VendorId', {
    extend: 'BIA.container.FilterContainer',
    alias: 'widget.App-View-Component-Filter-VendorId',
    layout: 'column',
    width: 210,
    items: [
         { xtype: 'label', text: 'Vendor Id:', baseCls: 'UPS_White' },

         {
             xtype: 'textfield',
             itemId: 'VendorId',
             emptyText: 'Vendor Id',
             allowBlank: true,
             width: '48%',
             inputWidth: 100,
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
                 PgAtt.setVendor_id('');
                 this.onChange('');
             }
         }
    ]
});