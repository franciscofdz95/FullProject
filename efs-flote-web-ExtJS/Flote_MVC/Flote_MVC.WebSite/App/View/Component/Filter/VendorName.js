/* ====================================================================================================
NAME:			[Vendor Name Filter]
BEHAVIOR:		Shows Vendor Name Filter.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
03/23/2020        Rama Yagati		 Created.
 ======================================================================================================*/
Ext.define('App.View.Component.Filter.VendorName', {
    extend: 'BIA.container.FilterContainer',
    alias: 'widget.App-View-Component-Filter-VendorName',
    layout: 'vbox',
    items: [
         { xtype: 'label', text: 'Vendor Name:', baseCls: 'UPS_White' },

         {
             xtype: 'textfield',
             itemId: 'VendorName',
             emptyText: 'Vendor Name',
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
                 PgAtt.setVendorName('');
                 this.onChange('');
             }

         }

    ]
});