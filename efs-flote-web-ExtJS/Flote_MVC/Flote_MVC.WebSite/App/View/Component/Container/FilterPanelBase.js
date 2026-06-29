/* ====================================================================================================
NAME:			[Filter Criteria Base Window]
BEHAVIOR:		Sets the filter criteria based window.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/26/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.View.Component.Container.FilterPanelBase', {
    extend: 'BIA.container.FilterContainer',
    alias: 'widget.App-View-Component-Container-FilterPanelBase',
    layout: { type: 'vbox' },
    defaults: {        
    },
    items: [],    
    localLayout: {},
    localValues: {},
    // 'global' - basically defaults everything to off.
    globalLayout: {},
    globalValues: {
        ReportType: window.location.pathname
    },
    GetValues: function () {
        var me = this,
            values = {};
        Ext.apply(values, me.localValues, me.globalValues);
        return values;
    },
    GetValue: function (param) {
        return this.GetValues()[param];
    },
    GetLayout: function () {
        var me = this,
            layout = {};

        Ext.apply(layout, me.localLayout, me.globalLayout);
        return layout;
    },
    GetFilterDisplay: function () {
        var me = this;
        // in the event that search is being used, return that
        // instead of the usual filter.        
        var display = me.callOverridden(arguments);
        return (Ext.isEmpty(display)) ? 'No Filters Selected' : display;

    },
    GetParameters: function () {
        var me = this;
        return Ext.apply(me.callOverridden(arguments), {
            Search: me.Search,
            LastSearch: me.LastSearch
        });
    }

});
