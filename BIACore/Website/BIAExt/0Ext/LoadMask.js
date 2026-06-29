// The original implementation uses parseInt, and not Ext.Number.from.
// parseInt on IE7 doesn't support defaults, and so this bombs out.
if (Ext.getVersion().major >= 5) {
    Ext.define('BIA.LoadMask', {
        override: 'Ext.LoadMask',
        cls: Ext.baseCSSPrefix + 'mask bia-mask' + (Ext.isIE ? ' bia-mask-ie' : '') + (Ext.os.deviceType === 'Phone' ? ' bia-mask-mobile' : ''),
        renderTpl: [
            '<div id="{id}-msgWrapEl" data-ref="msgWrapEl" class="{[values.$comp.msgWrapCls]} Card ', Ext.baseCSSPrefix, 'mask-msg<tpl if="Ext.isEmpty(msg)"> bia-mask-msg-default</tpl>">',
                '<div id="{id}-msgEl" data-ref="msgEl" class="{[values.$comp.msgCls]} ',
                    Ext.baseCSSPrefix, 'mask-msg-inner {childElCls} bia-mask-msg-inner">',
                    '<div id="{id}-msgTextEl" data-ref="msgTextEl" class="',
                        Ext.baseCSSPrefix, 'mask-msg-text bia-mask-msg-text',
                        '{childElCls}">{msg}</div>',
                '</div>',
            '</div>'
        ],
        msg: 'Processing, please wait...',
        show: function () {
            var me = this;

            // This probably needs a test condition for isElement, not sure if this will break if it's HTML
            if (me.ownerCt.getWidth() < 350) {
                me.addCls('bia-mask-micro');
                me.msg = '';
            }


            if (me.isElement) {
                me.ownerCt.mask(this.useMsg ? this.msg : 'Processing, please wait...', this.msgCls);
                me.fireEvent('show', this);
                return;
            }
            return me.callParent(arguments);
        },
        constructor: function() {
            this.callParent(arguments);
            if (this.msg === 'Loading...') this.msg = Ext.isIE ? Object.getPrototypeOf(this).msg : this.__proto__.msg;
        },
        setZIndex: function (index) {
            var me = this,
                owner = me.activeOwner;

            if (owner) {
                index = Ext.Number.from(owner.el.getStyle('zIndex'), 10) + 1;
            }
            me.getMaskEl().setStyle('zIndex', index - 1);
            return me.mixins.floating.setZIndex.apply(me, arguments);
        }
    });
}