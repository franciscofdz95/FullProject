/* ====================================================================================================
NAME:			[End Date Filter]
BEHAVIOR:		Shows End Date Filter.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/26/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.View.Component.Filter.EndDate', {
    extend: 'BIA.container.FilterContainer',
    alias: 'widget.App-View-Component-Filter-EndDate',
    layout: 'hbox',
    width: 220,
    items: [
        { xtype: 'label', html: '<Div style="color:white;font-weight:bold; font-size:12px;">End Date <BR>(mm/dd/yyyy):</Div>', baseCls: 'UPS_White', width: '48%' },
        {
            xtype: 'datefield',
            anchor: '100%',
            itemId: 'EndDate',
            width: '48%',
            name: 'date',
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
                PgAtt.setEndDateFilter('');
                this.onChange('');
            }
        }
    ]
});