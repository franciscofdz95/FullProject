(function () {
    // fix a bug that gets fixed in 4.2.1
    var version = Ext.getVersion() || {};
    if (version.major === 4 && version.minor < 2) {
        Ext.override(Ext.AbstractComponent, {
            removeUIClsFromElement: function (cls) {
                var me = this,
                    baseClsUi = me.baseCls + '-' + me.ui + '-' + cls,
                    result = [Ext.baseCSSPrefix + cls, me.baseCls + '-' + cls, baseClsUi],
                    frameElementCls = me.frameElementCls,
                    frameElementsArray, frameElementsLength, i, el, frameElement, c;
                if (me.frame && !Ext.supports.CSS3BorderRadius) {
                    frameElementsArray = me.frameElementsArray;
                    frameElementsLength = frameElementsArray.length;
                    i = 0;
                    for (; i < frameElementsLength; i++) {
                        frameElement = frameElementsArray[i];
                        el = me['frame' + frameElement.toUpperCase()];
                        c = baseClsUi + '-' + frameElement;
                        if (el && el.dom) {
                            // this was addCls
                            el.removeCls(c);
                        } else {
                            Ext.Array.remove(frameElementCls[frameElement], c);
                        }
                    }
                }
                me.frameElementCls = frameElementCls;
                return result;
            }
        });
    }
}());