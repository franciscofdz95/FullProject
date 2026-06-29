/* ====================================================================================================
NAME:			[Carrier BOL Filter Controller ]
BEHAVIOR:		Carrier BOL  filter criteria.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/24/2017        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.Controller.Component.Filter.CarrierBOL', {
    extend: 'Ext.app.Controller',
    init: function () {
        this.control({
            'App-View-Component-Filter-CarrierBOL clearCombo': {
                afterrender: this.CarrierBOLAfterRender,
                change: this.CarrierBOLChange,
                clear: this.CarrierBOLClear
            }
        });
    },
    CarrierBOLChange: function CarrierBOLChange(me, newValue, oldValue, eOpts) {
        if (!Ext.isEmpty(newValue) && newValue.length > 0) {
            me.getTrigger('clear').show();
            PgAtt.setMbl_iata_busid(newValue);
        } else {
            me.getTrigger('clear').hide();
            PgAtt.setMbl_iata_busid('');
        }
        me.updateLayout();
    },
    CarrierBOLAfterRender: function CarrierBOLAfterRender(me) {
        if (me.getValue() != '') {
            me.getTrigger('clear').show();
        }
    },
    CarrierBOLClear: function CarrierBOLClear(me) {
        me.reset();
        me.getTrigger('clear').hide();
        me.fireEvent('onclear', me, me.getValue());
        me.updateLayout();
        PgAtt.setMbl_iata_busid('');
        this.CarrierBOLChange(me, '');
    }
});