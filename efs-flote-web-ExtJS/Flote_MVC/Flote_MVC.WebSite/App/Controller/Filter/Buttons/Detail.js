//Ext.define('App.controller.Filter.Buttons.Detail', {
//    extend: 'Ext.app.Controller',
//    refs: [
//        { ref: 'DetailButton', selector: '#DetailButton' },
//        { ref: 'ContentPanel', selector: '#ContentPanel' }
//    ],
//    init: function () {
//        var me = this;
//        me.control({
//            '#DetailButton': {
//                click: me.Detail_Click
//            }
//        });
//    },
//    Detail_Click: function (button, event, eOpts) {
//        var me = this,
//            content = me.getContentPanel(),
//            current = content.getLayout().getActiveItem();

//        // keep it in a "pressed" or "unpressed" state
//        button.toggle();
//        // iterate over columns in current
//        Ext.suspendLayouts();
//        Ext.each(current.columns, function (column) {
//            me.Toggle_Columns(column);
//        });
//        Ext.resumeLayouts(true);
//    },
//    Toggle_Columns: function (column) {
//        var me = this;
//        if (column.Toggle) { //defined and true
//            column.setVisible(column.isHidden());
//            if (column.autoSize) column.autoSize();
//        } else if (column.isGroupHeader) {
//            column.items.each(function (column) { me.Toggle_Columns(column); });
//        }
//    }
//});