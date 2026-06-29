//(function () {
//    var version = Ext.getVersion();

//    if (version.major >= 5) {
//        Ext.override(Ext.view.Table, {
//            // this method is only used by getMaxContentWidth for autoSizing
//            // columns. The 5.1.1 implementation "undersizes" the header portion
//            // by a good bit, so add in some extra pixels
//            // to adjust the size up and get rid of ellipsis.
//            getCellPaddingAfter: function () {
//                return this.callOverridden(arguments) + 8;
//            }
//        });
//    }
//}());