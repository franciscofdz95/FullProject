/* ====================================================================================================
NAME:			[Invoice Id Filter]
BEHAVIOR:		Shows Invoice Id Filter.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/26/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.View.Component.Filter.InvoiceId', {
    extend: 'BIA.container.FilterContainer',
    alias: 'widget.App-View-Component-Filter-InvoiceId',
    layout: 'column',
    width: 210,
    items: [
          { xtype: 'label', text: 'Invoice Id:', baseCls: 'UPS_White', width: '48%' },

          {
              xtype: 'textfield',
              emptyText: 'Invoice Id',
              itemId: 'InvoiceId',
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
                  PgAtt.setInvoice_id('0');
                  this.onChange('');
              }

          }

    ]
});