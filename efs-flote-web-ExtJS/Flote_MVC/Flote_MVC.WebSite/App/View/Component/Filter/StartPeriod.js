/* ====================================================================================================
NAME:			[Start Period Filter]
BEHAVIOR:		Shows Start Period Filter.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
03/31/2020        Rama yagati		 Created.
 ======================================================================================================*/
Ext.define('App.View.Component.Filter.StartPeriod', {
    extend: 'BIA.container.FilterContainer',
    alias: 'widget.App-View-Component-Filter-StartPeriod',
    layout: 'hbox',
    width: 220,
    items: [
        { xtype: 'label', html: '<Div style="color:white;font-weight:bold; font-size:12px;">Start Date <BR>(mm/dd/yyyy):</Div>', baseCls: 'UPS_White', width: '48%' },
        {
            xtype: 'datefield',
            anchor: '100%',
            itemId: 'StartPeriod',
            width: '48%',
            minValue: Ext.Date.add(new Date(), Ext.Date.YEAR, -1),
            maxValue:new Date(),
            name: 'StartPeriod',
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
                PgAtt.setStartPeriod('');
                this.onChange('');
            }
            
        }
    ]
});