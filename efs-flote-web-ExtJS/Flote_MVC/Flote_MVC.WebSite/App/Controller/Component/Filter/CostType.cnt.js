/* ====================================================================================================
NAME:			[Cost Type Filter Controller ]
BEHAVIOR:		Cost Type filter criteria.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/24/2017        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.Controller.Component.Filter.CostType', {
    extend: 'Ext.app.Controller',
    init: function () {
        this.control({
            'App-View-Component-Filter-CostType clearCombo': {
               // afterrender: this.CostTypeAfterRender,
                change: this.CostTypeChange,
                clear: this.CostTypeClear
            }
        });
    },
    CostTypeChange: function CostTypeChange(me, newValue, oldValue, eOpts) {
        if (!Ext.isEmpty(newValue) && newValue.length > 0) {
            me.getTrigger('clear').show();
            PgAtt.setCost_type(newValue);
        } else {
            me.getTrigger('clear').hide();
            PgAtt.setCost_type('');
        }
        me.updateLayout();
    },    
    CostTypeClear: function CostTypeClear(me) {
        me.reset();
        me.getTrigger('clear').hide();
        me.fireEvent('onclear', me, me.getValue());
        me.updateLayout();
        PgAtt.setCost_type('');
        this.CostTypeChange(me, '');
    }
});