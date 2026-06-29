/* ====================================================================================================
NAME:			[E2k Carrier Code Filter]
BEHAVIOR:		Shows E2k Carrier Code Filter.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/26/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.View.Component.Filter.E2kCarrierCode', {
    extend: 'BIA.container.FilterContainer',
    alias: 'widget.App-View-Component-Filter-E2kCarrierCode',
    layout: 'column',
    width: 210,
    items: [
          { xtype: 'label', text: 'E2kCarrierCode:', baseCls: 'UPS_White', width: '48%' },
          {
              xtype: 'textfield',
              emptyText: 'E2k Carrier Code',
              itemId: 'E2kCarrierCode',
              allowBlank: false,
              inputWidth: 100,
              width: '48%',
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
                  PgAtt.setE2k_Carrier_Code('');
                  this.onChange('');
              }

          }

    ]
});