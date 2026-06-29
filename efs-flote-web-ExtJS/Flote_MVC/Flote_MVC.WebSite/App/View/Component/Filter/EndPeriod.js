/* ====================================================================================================
NAME:			[End Period Filter]
BEHAVIOR:		Shows End Period Filter.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
03/31/2020        Rama yagati		 Created.
 ======================================================================================================*/
Ext.define('App.View.Component.Filter.EndPeriod', {
    extend: 'BIA.container.FilterContainer',
    alias: 'widget.App-View-Component-Filter-EndPeriod',
    layout: 'hbox',
    width: 220,
    items: [
        { xtype: 'label', html: '<Div style="color:white;font-weight:bold; font-size:12px;">End Date <BR>(mm/dd/yyyy):</Div>', baseCls: 'UPS_White', width: '48%' },
        {
            xtype: 'datefield',
            anchor: '100%',
            itemId: 'EndPeriod',
            width: '48%',
            minValue: Ext.Date.add(new Date(), Ext.Date.YEAR, -1),
            maxValue: new Date(),
            name: 'EndPeriod',
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
                PgAtt.setEndPeriod('');
                this.onChange('');
            }
        }
    ]
});