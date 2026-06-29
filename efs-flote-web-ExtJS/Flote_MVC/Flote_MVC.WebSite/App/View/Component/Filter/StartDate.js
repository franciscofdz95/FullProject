/* ====================================================================================================
NAME:			[Start Date Filter]
BEHAVIOR:		Shows Start Date Filter.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/26/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.View.Component.Filter.StartDate', {
    extend: 'BIA.container.FilterContainer',
    alias: 'widget.App-View-Component-Filter-StartDate',
    layout: 'hbox',
    width: 220,
    items: [
           { xtype: 'label', html: '<Div style="color:white;font-weight:bold; font-size:12px;">Start Date<BR>(mm/dd/yyyy):</Div>', baseCls: 'UPS_White', width: '48%' },
           {
               xtype: 'datefield',
               anchor: '100%',
               itemId: 'StartDate',
               width: '48%',
               name: 'date',
               allowBlank: true,
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
                   PgAtt.setStartDateFilter('');
                   this.onChange('');
               }//,
               //onChange: function (newValue, oldValue, eOpts) {
               //    var me = this;
               //    if (!Ext.isEmpty(newValue) && newValue != null) {
               //        me.getTrigger('clear').show();
               //        PgAtt.setStartDateFilter(newValue);
               //    } else {
               //        me.getTrigger('clear').hide();
               //        PgAtt.setStartDateFilter('');
               //    }

               //    me.updateLayout();
               //},
               //listeners: {
               //    afterrender: function () {
               //        var me = this;
               //        if (me.getValue() != null) {
               //            me.getTrigger('clear').show();
               //        }
               //    }
               //}
           }
    ]
});