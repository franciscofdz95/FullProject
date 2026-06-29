Ext.define('BIA.controller.CardFlip', {
    extend: 'Ext.app.Controller',
    refs: [],
    init: function () {
        this.control({
            'BIA-Components-CardFlip': {
                afterrender: this.CardFlipAfterRender,
                toggleside: this.CardFlipToggleSide
            },
            'BIA-Components-CardFlip-Container': {
                beforerender: this.CardFlipContainerAddFloatingFooter,
                afterlayout: this.CardFlipContainerAfterLayout,
                hide: this.CardFlipContainerRemoveCardFlipSideFooter,
                destroy: this.CardFlipContainerRemoveCardFlipSideFooter,
                resize: this.CardFlipContainerResize
            },
            'BIA-Components-CardFlip-Side': {
            },
            'BIA-Components-CardFlip-Side-FlipButton-Footer #CardFlipSideFooterButton': {
                afterrender: this.CardFlipSideFooterButtonAfterRender
                //click: this.CardFlipSideFooterButtonClick
            }
        });
    },
    CardFlipAfterRender: function CardFlipAfterRender(me) {
        if (me.flipTypeCardClick) {
            me.getEl().addListener({
                click: {
                    fn: this.CardFlipClick,
                    scope: this,
                    args: [me]
                }
            });
        }
    },
    CardFlipClick: function CardFlipClick(me) {
        me.toggleSide();
    },
    CardFlipToggleSide: function CardFlipToggleSide(me, sideShowing, sideHidden) {
        //sideShowing.sideToggle = true;
        sideHidden.sideToggle = true;
        var transitionTime = 300;
        if (sideShowing.down('BIA-Components-CardFlip-Side-FlipButton-Footer')) sideShowing.down('BIA-Components-CardFlip-Side-FlipButton-Footer').destroy();
        if (sideHidden.down('BIA-Components-CardFlip-Side-FlipButton-Footer')) sideHidden.down('BIA-Components-CardFlip-Side-FlipButton-Footer').destroy();
        me.addCls('hover');
        Ext.defer(function () {
            sideShowing.hide();
            sideHidden.show();
            me.removeCls('hover');
            Ext.defer(function () {
                try { sideHidden.updateLayout(); } catch (err) { }
                this.CardFlipContainerAddFloatingFooter(sideHidden);
                sideShowing.sideToggle = false;
                sideHidden.sideToggle = false;
                me.fireEvent('togglesidecomplete', me, sideHidden, sideShowing);
            }, transitionTime, this)
        }, transitionTime,this);
    },
    CardFlipContainerRemoveCardFlipSideFooter: function CardFlipContainerRemoveCardFlipSideFooter(me) {
        Ext.suspendLayouts();
        if (me.query('cardflipsidefooter').length > 0) {
            for (var i = me.query('cardflipsidefooter').length - 1; i >= 0; i--) {
                me.query('cardflipsidefooter')[i].hide();
            }
        }
        Ext.resumeLayouts();
    },
    CardFlipContainerAfterLayout: function CardFlipContainerAfterLayout(me) {
        if (!me.sideToggle) {
            this.CardFlipContainerAddFloatingFooter(me);
        }
    },
    CardFlipContainerResize: function CardFlipContainerResize(me) {
        if (!me.sideToggle) {
            Ext.defer(function () {
                if (me.down('cardflipsidefooter')) me.down('cardflipsidefooter').destroy();
                this.CardFlipContainerAddFloatingFooter(me);
            }, 1, this);
        }
    },
    CardFlipContainerAddFloatingFooter: function CardFlipContainerAddFloatingFooter(me) {
        this.CardFlipContainerRemoveCardFlipSideFooter(me);
        if (me.up('cardflip').flipTypeButton && !me.hidden) {
            if (me.down('cardflipsidefooter[hidden=true]')) {
                me.down('cardflipsidefooter[hidden=true]').show();
            }
            else me.add({ xtype: 'cardflipsidefooter', alignTarget: me.getId(), margin: '-5 0 0 -10' }).show();
        }
    },
    CardFlipSideFooterButtonAfterRender: function CardFlipSideFooterButtonAfterRender(me) {
        if (me.up('[cls*="back"]')) me.setConfig({ html: '<i class="fa fa-share clickableIcon"' + (!Ext.feature.has.Touch ? ' data-qtip="' + me.up('cardflip').backButtonHoverText + '"' : '') + '></i>' });
        else me.setConfig({ html: '<i class="fa fa-share clickableIcon"' + (!Ext.feature.has.Touch ? me.up('cardflip').frontButtonHoverText + '"' : '') + '></i>' });
        var el = me.getEl();
        if (el) {
            el.addListener({
                click: {
                    fn: this.CardFlipSideFooterButtonClick,
                    args: [me],
                    scope: this
                }
            });
        }
    },
    CardFlipSideFooterButtonClick: function CardFlipSideFooterButtonClick(me) {
        //me.up('BIA-Components-CardFlip-Side-FlipButton-Footer').hide();
        var cardFlip = me.up('cardflip');
        if (cardFlip) {
            cardFlip.toggleSide();
            //if (cardFlip.hasCls('hover')) cardFlip.removeCls('hover');
            //else cardFlip.addCls('hover');
        }
        else {
            //TODO: Error handle no card flip parent
        }
    }
});