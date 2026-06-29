//(function () {
//    if (Ext.getVersion().major >= 5) {
//        Ext.override(Ext.layout.container.Column, {
//            setCtSizeIfNeeded: function (ownerContext, containerSize) {
//                var me = this,
//                    padding = ownerContext.paddingContext.getPaddingInfo();

//                me.callParent(arguments);

//                // IE6/7/quirks lose right padding when using the shrink wrap template, so
//                // reduce the size of the outerCt by the amount of right padding.
//                if ((Ext.isIEQuirks || Ext.isIE7m) && me.isShrinkWrapTpl && padding.right) {
//                    ownerContext.outerCtContext.setProp('width',
//                        containerSize.width + padding.left);
//                }
//            }
//        });
//    }
//}());