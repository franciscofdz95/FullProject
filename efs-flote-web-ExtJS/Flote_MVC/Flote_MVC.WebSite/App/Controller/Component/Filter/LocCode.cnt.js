/* ====================================================================================================
NAME:			[Location Code Filter Controller ]
BEHAVIOR:		Location Code  filter criteria.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/24/2017        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.Controller.Component.Filter.LocCode', {
    extend: 'Ext.app.Controller',
    init: function () {
        this.control({
            'App-View-Component-Filter-LocCode clearCombo': {
                afterrender: this.LocCodeAfterRender,
                change: this.LocCodeChange,
                clear: this.LocCodeClear
            }
        });
    },
    LocCodeChange: function LocCodeChange(me, newValue, oldValue, eOpts) {        
        if (!Ext.isEmpty(newValue) && newValue.length > 0 && me.store.data.length !=0) {
            me.getTrigger('clear').show();
            PgAtt.setLocation_code(newValue);
            PgAtt.setUserPreference(PgAtt.getUserId(), 'location_code', 'All', newValue);
            if (me.up('window') == undefined) {
                PgAtt.getCurrencyCodes(PgAtt.getLocation_code(), me.up('#filterItemId').down('#filDisplayCurr combobox'));
            }
        } else {
            me.getTrigger('clear').hide();           
            PgAtt.setLocation_code('');  
        }

        me.updateLayout();
    },
    LocCodeAfterRender: function LocCodeAfterRender(me) {
        if (me.getValue() != '') {
            me.getTrigger('clear').show();
        }
    },
    LocCodeClear: function LocCodeClear(me) {
        me.reset();
        me.getTrigger('clear').hide();
        me.fireEvent('onclear', me, me.getValue());
        me.updateLayout();
        PgAtt.setLocation_code('');
        this.LocCodeChange(me, '');
    }
});