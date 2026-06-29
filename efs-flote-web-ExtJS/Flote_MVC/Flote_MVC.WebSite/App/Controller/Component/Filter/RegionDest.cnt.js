/* ====================================================================================================
NAME:			[Region Dest Filter Controller ]
BEHAVIOR:		Region Dest filter criteria.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
03/16/2020        Rama Yagati		 Created.
 ======================================================================================================*/
Ext.define('App.Controller.Component.Filter.RegionDest', {
    extend: 'Ext.app.Controller',
    init: function () {
        this.control({
            'App-View-Component-Filter-RegionDest clearCombo': {
                afterrender: this.RegionDestAfterRender,
                change: this.RegionDestChange,
                clear: this.RegionDestClear
            }
        });
    },
    RegionDestChange: function RegionDestChange(me, newValue, oldValue, eOpts) {
        if (!Ext.isEmpty(newValue) && newValue.length > 0) {
            me.getTrigger('clear').show();
            PgAtt.setRegionDest(newValue);
        } else {
            me.getTrigger('clear').hide();
            PgAtt.setRegionDest('All');
        }
        me.updateLayout();
    },
    RegionDestAfterRender: function RegionDestAfterRender(me) {
        if (me.getValue() != '') {
            me.getTrigger('clear').show();
        }
    },
    RegionDestClear: function RegionDestClear(me) {
        me.reset();
        me.getTrigger('clear').hide();
        me.fireEvent('onclear', me, me.getValue());
        me.updateLayout();
        PgAtt.setRegionDest('All');
        this.RegionDestChange(me, '');
    }
});