/* ====================================================================================================
NAME:			[ChargeCurrency Filter]
BEHAVIOR:		ShowsChargeCurrency Filter.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
02/12/2020        Rama Yagati		 Created.
 ======================================================================================================*/
Ext.define('App.View.Component.Filter.ChargeCurrency', {
    extend: 'BIA.container.FilterContainer',
    alias: 'widget.App-View-Component-Filter-ChargeCurrency',
    layout: 'column',
    width: 210,
    items: [
          { xtype: 'label', text: 'Charge Currency:', baseCls: 'UPS_White', width: '48%' },

          {
              xtype: 'textfield',
              itemId: 'ChargeCurrency',
              emptyText: 'Charge Currency',
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
                  PgAtt.setChargeCurrency('');
                  this.onChange('');
              }


          }

    ]
});