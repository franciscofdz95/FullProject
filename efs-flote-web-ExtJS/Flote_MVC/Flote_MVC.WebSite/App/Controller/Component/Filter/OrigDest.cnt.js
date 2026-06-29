/* ====================================================================================================
NAME:			[Orig Dest Filter Controller ]
BEHAVIOR:		Orig Dest  filter criteria.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/24/2017        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.Controller.Component.Filter.OrigDest', {
    extend: 'Ext.app.Controller',
    init: function () {
        this.control({
            'App-View-Component-Filter-OrigDest clearCombo': {
                afterrender: this.OrigDestAfterRender,
                change: this.OrigDestChange,
                clear: this.OrigDestClear
            }
        });
    },
    OrigDestChange: function OrigDestChange(me, newValue, oldValue, eOpts) {
        if (!Ext.isEmpty(newValue) && newValue.length > 0) {
            me.getTrigger('clear').show();
            PgAtt.setOD(newValue);
        } else {
            me.getTrigger('clear').hide();
            PgAtt.setOD('All');
        }
        me.updateLayout();
    },
    OrigDestAfterRender: function OrigDestAfterRender(me) {
        if (me.getValue() != '') {
            me.getTrigger('clear').show();
        }
    },
    OrigDestClear: function OrigDestClear(me) {
        me.reset();
        me.getTrigger('clear').hide();
        me.fireEvent('onclear', me, me.getValue());
        me.updateLayout();
        PgAtt.setOD('All');
        this.OrigDestChange(me, '');
    }
});