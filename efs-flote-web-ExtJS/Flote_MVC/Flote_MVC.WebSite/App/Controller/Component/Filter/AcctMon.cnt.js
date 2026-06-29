/* ====================================================================================================
NAME:			[Account Month Filter Controller ]
BEHAVIOR:		Account Month filter criteria.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/24/2017        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.Controller.Component.Filter.AcctMon', {
    extend: 'Ext.app.Controller',
    init: function () {
        this.control({
            'App-View-Component-Filter-AcctMon combobox': {
                // load: this.AcctMonLoad,
                //change: this.AcctMonChange
            }
        });
    }//,
    //AcctMonChange: function AcctMonChange(me, newValue, oldValue, eOpts) {
    //    if (newValue == 'All') {
    //        me.up('App-View-Viewport').down('#billArchived').setDisabled(true);
    //    } else {
    //        me.up('App-View-Viewport').down('#billArchived').setDisabled(false);
    //    }
    //}
    //,
    //AcctMonLoad: function AcctMonLoad(t) {
    //    t.clearFilter(true);
    //    var comboYear = Ext.ComponentQuery.query('container[name=AcctYear] combobox')[0];
    //    t.filterBy(function (rec, id) {
    //        if (rec.get('Accounting_Year') === comboYear.getValue() || rec.get('Accounting_Month') == 'All')
    //            return true;
    //        else
    //            return false;
    //    }, this);
    //}
});