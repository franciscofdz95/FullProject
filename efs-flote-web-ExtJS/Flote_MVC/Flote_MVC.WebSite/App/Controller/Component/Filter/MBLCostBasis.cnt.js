/* ====================================================================================================
NAME:			[MBL Cost Basis Filter Controller ]
BEHAVIOR:		MBL Cost Basis  filter criteria.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/24/2017        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.Controller.Component.Filter.MBLCostBasis', {
    extend: 'Ext.app.Controller',
    init: function () {
        this.control({
            'App-View-Component-Filter-MBLCostBasis clearCombo': {
                afterrender: this.MBLCostBasisAfterRender,
                change: this.MBLCostBasisChange,
                clear: this.MBLCostBasisClear
            }
        });
    },
    MBLCostBasisChange: function MBLCostBasisChange(me, newValue, oldValue, eOpts) {
        if (!Ext.isEmpty(newValue) && newValue.length > 0) {
            me.getTrigger('clear').show();
            PgAtt.setMbl_iata_busid(newValue);
        } else {
            me.getTrigger('clear').hide();
            PgAtt.setMbl_iata_busid('');
        }
        me.updateLayout();
    },
    MBLCostBasisAfterRender: function MBLCostBasisAfterRender(me) {
        if (me.getValue() != '') {
            me.getTrigger('clear').show();
        }
    },
    MBLCostBasisClear: function MBLCostBasisClear(me) {
        me.reset();
        me.getTrigger('clear').hide();
        me.fireEvent('onclear', me, me.getValue());
        me.updateLayout();
        PgAtt.setMbl_iata_busid('');
        this.MBLCostBasisChange(me, '');
    }
});