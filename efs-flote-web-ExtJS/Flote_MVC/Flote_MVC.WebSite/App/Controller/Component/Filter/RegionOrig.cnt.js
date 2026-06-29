/* ====================================================================================================
NAME:			[Region Filter Controller ]
BEHAVIOR:		Region  filter criteria.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
03/16/2020        Rama Yagati		 Created.
 ======================================================================================================*/
Ext.define('App.Controller.Component.Filter.RegionOrig', {
    extend: 'Ext.app.Controller',
    init: function () {
        this.control({
            'App-View-Component-Filter-RegionOrig clearCombo': {
                afterrender: this.RegionOrigAfterRender,
                change: this.RegionOrigChange,
                clear: this.RegionOrigClear
            }
        });
    },
    RegionOrigChange: function RegionOrigChange(me, newValue, oldValue, eOpts) {
        if (!Ext.isEmpty(newValue) && newValue.length > 0) {
            me.getTrigger('clear').show();
            PgAtt.setRegionOrig(newValue);
        } else {
            me.getTrigger('clear').hide();
            PgAtt.setRegionOrig('All');
        }
        me.updateLayout();
    },
    RegionOrigAfterRender: function RegionOrigAfterRender(me) {
        if (me.getValue() != '') {
            me.getTrigger('clear').show();
        }
    },
    RegionOrigClear: function RegionOrigClear(me) {
        me.reset();
        me.getTrigger('clear').hide();
        me.fireEvent('onclear', me, me.getValue());
        me.updateLayout();
        PgAtt.setRegionOrig('All');
        this.RegionOrigChange(me, '');
    }
});