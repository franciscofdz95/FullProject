//(function () {
//    var version = Ext.getVersion() || {};
//    if (version.major == 4 && version.minor == 2) {
//        Ext.override(Ext.data.Store, {
//            sort: function (sorters, direction, where, doSort) {
//                var me = this,
//                    s = me.callOverridden(arguments);

//                // fix an issue where this thing fails to sort on an empty array.
//                if (doSort !== false && s.length == 0) {
//                    me.doSort(me.generateComparator());
//                }

//                return s;
//            }
//        });
//    }
//}());