/* ====================================================================================================
NAME:			[Service Code Filter Controller ]
BEHAVIOR:		Service Code  filter criteria.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/24/2017        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.Controller.Component.Filter.ServiceCode', {
    extend: 'Ext.app.Controller',
    init: function () {
        this.control({
            'App-View-Component-Filter-ServiceCode clearCombo': {
                afterrender: this.ServiceCodeAfterRender,
                change: this.ServiceCodeChange,
                clear: this.ServiceCodeClear
            }
        });
    },
    ServiceCodeChange: function ServiceCodeChange(me, newValue, oldValue, eOpts) {
        if (!Ext.isEmpty(newValue) && newValue.length > 0) {
            me.getTrigger('clear').show();
            PgAtt.setService_code(newValue);
        } else {
            me.getTrigger('clear').hide();
            PgAtt.setService_code('All');
        }
        me.updateLayout();
    },
    ServiceCodeAfterRender: function ServiceCodeAfterRender(me) {
        if (me.getValue() != '') {
            me.getTrigger('clear').show();
        }
    },
    ServiceCodeClear: function ServiceCodeClear(me) {
        me.reset();
        me.getTrigger('clear').hide();
        me.fireEvent('onclear', me, me.getValue());
        me.updateLayout();
        PgAtt.setService_code('All');
        this.ServiceCodeChange(me, '');
    }
});