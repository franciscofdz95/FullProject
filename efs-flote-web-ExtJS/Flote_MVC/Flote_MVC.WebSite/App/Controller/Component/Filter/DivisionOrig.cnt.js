/* ====================================================================================================
NAME:			[DivisionOrigin Filter Controller ]
BEHAVIOR:		Division Origin  filter criteria.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
03/16/2020        Rama Yagati		 Created.
 ======================================================================================================*/
Ext.define('App.Controller.Component.Filter.DivisionOrig', {
    extend: 'Ext.app.Controller',
    init: function () {
        this.control({
            'App-View-Component-Filter-DivisionOrig clearCombo': {
                afterrender: this.DivisionOrigAfterRender,
                change: this.DivisionOrigChange,
                clear: this.DivisionOrigClear
            }
        });
    },
    DivisionOrigChange: function DivisionOrigChange(me, newValue, oldValue, eOpts) {
        if (!Ext.isEmpty(newValue) && newValue.length > 0) {
            me.getTrigger('clear').show();
            PgAtt.setDivisionOrig(newValue);
        } else {
            me.getTrigger('clear').hide();
            PgAtt.setDivisionOrig('All');
        }
        me.updateLayout();
    },
    DivisionOrigAfterRender: function DivisionOrigAfterRender(me) {
        if (me.getValue() != '') {
            me.getTrigger('clear').show();
        }
    },
    DivisionOrigClear: function DivisionOrigClear(me) {
        me.reset();
        me.getTrigger('clear').hide();
        me.fireEvent('onclear', me, me.getValue());
        me.updateLayout();
        PgAtt.setDivisionOrig('All');
        this.DivisionOrigChange(me, '');
    }
});