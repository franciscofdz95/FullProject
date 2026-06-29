/* ====================================================================================================
NAME:			[Modified By Filter]
BEHAVIOR:		Shows Modified By Filter.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/26/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.View.Component.Filter.ModifiedBy', {
    extend: 'BIA.container.FilterContainer',
    alias: 'widget.App-View-Component-Filter-ModifiedBy',
    layout: 'column',
    width: 210,
    items: [
          { xtype: 'label', text: 'Modified By:', baseCls: 'UPS_White', width: '48%' },
           {
               xtype: 'textfield',
               width: '48%',
               itemId: 'ModifiedBy',
               emptyText: 'Modified By',
               allowBlank: false,
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
                   PgAtt.setModifiedBy('');
                   this.onChange('');
               }
              
           }
    ]
});