//Ext.define('App.controller.Filter.Buttons.Reset', {
//    extend: 'Ext.app.Controller',
//    refs: [
//        { ref: 'FilterPanel', selector: 'App-View-Component-Container-FilterPanelBase' },
//        { ref: 'ContentPanel', selector: '#ContentPanel' }
//    ],
//    init: function () {
//        var me = this;
//        me.control({
//            'App-View-Component-Container-FilterPanelBase #ResetButton': {
//                click: me.Reset_Click
//            }
//        });
//    },
//    Reset_Click: function (button, event, eOpts) {
//        var me = this,
//            filter = me.getFilterPanel(),
//            content = me.getContentPanel().getLayout(),
//            active = content.getActiveItem();

//        filter.mask();
//        filter.SetParameters(active.filterValues || {});
//    }
//});