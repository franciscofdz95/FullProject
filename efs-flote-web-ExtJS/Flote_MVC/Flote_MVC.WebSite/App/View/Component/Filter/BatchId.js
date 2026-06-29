/* ====================================================================================================
NAME:			[Batch Id Filter]
BEHAVIOR:		Shows Batch Id Filter.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/26/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.View.Component.Filter.BatchId', {
    extend: 'BIA.container.FilterContainer',
    alias: 'widget.App-View-Component-Filter-BatchId',
    layout: 'column',
    width: 210,
    items: [
          { xtype: 'label', text: 'Batch Id:', baseCls: 'UPS_White', width: '48%' },

          {
              xtype: 'textfield',
              itemId: 'BatchId',
              emptyText: 'Batch Id',
              allowBlank: true,
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
                  PgAtt.setInvBatchID('');
                  this.onChange('');
              }


          }

    ]
});