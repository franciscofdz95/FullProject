(function () {
    if (Ext.getVersion().major >= 5 && typeof Ext != 'undefined' && typeof Ext.util != 'undefined' && typeof Ext.util.Renderable != 'undefined') {
        Ext.override(Ext.util.Renderable, {
            afterFirstLayout: function (width, height) {
                var me = this,
                    x = me.x,
                    y = me.y,
                    alignSpec = me.defaultAlign,
                    alignOffset = me.alignOffset,
                    controller, hasX, hasY, pos, xy;


                if (!me.ownerLayout) {
                    hasX = x !== undefined;
                    hasY = y !== undefined;
                }


                if (me.floating && !me.preventDefaultAlign && (!hasX || !hasY) && me.el != null) {
                    if (me.floatParent) {
                        pos = me.floatParent.getTargetEl().getViewRegion();
                        xy = me.el.getAlignToXY(me.alignTarget || me.floatParent.getTargetEl(), alignSpec, alignOffset);
                        pos.x = xy[0] - pos.x;
                        pos.y = xy[1] - pos.y;
                    } else {
                        xy = me.el.getAlignToXY(me.alignTarget || me.container, alignSpec, alignOffset);
                        pos = me.el.translateXY(xy[0], xy[1]);
                    }
                    x = hasX ? x : pos.x;
                    y = hasY ? y : pos.y;
                    hasX = hasY = true;
                }
                if (hasX || hasY) {
                    me.setPosition(x, y);
                }
                me.onBoxReady(width, height);
                controller = me.controller;
                if (controller && controller.boxReady) {
                    controller.boxReady(me);
                }
            }
        });
    }
})();
