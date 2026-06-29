Ext.define('App.Plugin.Component.BorderFloatingTitle', {
    extend: 'Ext.plugin.Abstract',
    alias: 'plugin.borderfloatingtitle',
    pluginId: 'borderfloatingtitle',

    position: null,
    titleConfig: 'Title',

    init: function pluginBorderFloatingTitleInit(cmp) {
        this.cmp = cmp;
        cmp.borderFloatingTitle = this;

        var position = {
            top: { name: 'top', clsSuffix: 'Top', defaultAlign: 'tl-tl' },
            right: { name: 'right', clsSuffix: 'Right', defaultAlign: 'tl-tr', textRotateCls: 'BorderFloatingTitleRotateRight' },
            bottom: { name: 'bottom', clsSuffix: 'Bottom', defaultAlign: 'bl-bl' },
            left: { name: 'left', clsSuffix: 'Left', defaultAlign: 'tr-tl', textRotateCls: 'BorderFloatingTitleRotateLeft' }
        };

        position['t'] = position.top;
        position['r'] = position.right;
        position['b'] = position.bottom;
        position['l'] = position.left;

        var bp = position[this.position];

        if (Ext.isFunction(cmp.addCls) && bp && this.titleConfig != null) {
            //if (Ext.isObject(this.titleConfig)) cmp.addCls('BorderFloatingTitle' + bp.clsSuffix);
            
            cmp.insert(0, {
                xtype: 'container',
                borderFloatingTitleContainer: true,
                //cls: Ext.isObject(this.titleConfig) ? 'BorderFloatingTitle BorderFloatingTitleMargin' + bp.clsSuffix + ' ' + bp.textRotateCls : '',
                floating: false,
                shadow: false,
                defaultAlign: bp.defaultAlign,
                positionConfig: bp.name,
                html: Ext.isString(this.titleConfig) ? '<h2><span>' + this.titleConfig + '</h2></span>' : '' ,
                items: Ext.isArray(this.titleConfig) ? this.titleConfig
                        : Ext.isObject(this.titleConfig) ? [this.titleConfig] : []
            });
        }
    }
});