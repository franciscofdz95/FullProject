if (Ext.getVersion().major == 5) {

    //I don't see this method used anywhere in BIACore, is this still needed by any applications? M.Erdmann 10/28/2019
    Ext.require('Ext.dom.Element', function () {
        Ext.isGarbage = function (dom) {
            // determines if the dom element is in the document or in the detached body element
            // use by collectGarbage and Ext.get()
            return dom &&
                // Must be an element. window, document and documentElement can never be garbage.
                dom.nodeType === 1 &&
                // if the element does not have a parent node, it is definitely not in the
                // DOM - we can exit immediately
                (!dom.parentNode ||
                // If the element has an offset parent we can bail right away, it is
                // definitely in the DOM.
                (!dom.offsetParent &&
                    // if the element does not have an offsetParent it can mean the element is
                    // either not in the dom or it is hidden.  The next step is to check to see
                    // if it can be found by id using either document.all or getElementById(),
                    // whichever is faster for the current browser.  Normally we would not
                    // include IE-specific checks in the sencha-core package, however,  in this
                    // case the function will be inlined and therefore cannot be overridden in
                    // the ext package.
                    ((Ext.isIE8 ? document.all[dom.id] : document.getElementById(dom.id)) !== dom) &&
                    // finally if the element was not found in the dom by id, we need to check
                    // the detachedBody element
                    !(Ext.detachedBodyEl && Ext.detachedBodyEl.isAncestor(dom))));
        };
    });

    //This is a IE9 specific fix that is only applicable to ExtJS 5.x, also appears to be used for the Card and mobile masking.. May need to be refactored for ExtJS 7.0
    Ext.define('BIACore.override.dom.Element', {
        override: 'Ext.dom.Element',
        mask: function (msg, msgCls, elHeight) {
            //This is from BIACore
            var me = this,
                dom = me.dom,
                data = me.getData(),
                maskEl = data.maskEl,
                maskMsg, maskMsgInner, maskMsgTextAndIcon,
                MASKMSGWIDTH = 400,
                MASKMSGWIDTHFROMPARENT = me.getViewSize().width * .9,
                XMASKEDRELATIVE = Ext.baseCSSPrefix + "masked-relative",
                EXTELMASKMSG = Ext.baseCSSPrefix + "mask-msg Card" + (Ext.isEmpty(msg) ? ' bia-mask-msg-default' : ''),
                XMASKED = Ext.baseCSSPrefix + "masked",                
                DOC = document,
                bodyRe = /^body/i;
            if (!(bodyRe.test(dom.tagName) && me.getStyle('position') === 'static')) {
                me.addCls(XMASKEDRELATIVE);
            }

            if (maskEl) {
                maskEl.destroy();
            }
            maskEl = Ext.DomHelper.append(dom, {
                role: 'presentation',
                cls: Ext.baseCSSPrefix + "mask " + Ext.baseCSSPrefix + "border-box" + ' bia-mask' + (Ext.isIE ? ' bia-mask-ie' : '') + ((Ext.os.deviceType === 'Phone' || MASKMSGWIDTHFROMPARENT < 300) ? ' bia-mask-mobile' : ''),
                children: {
                    role: 'presentation',
                    cls: (msgCls ? EXTELMASKMSG + " " + msgCls : EXTELMASKMSG) + (MASKMSGWIDTHFROMPARENT < 300 ? ' bia-mask-hidden' : ''),
                    children: {
                        tag: 'div',
                        role: 'presentation',
                        cls: Ext.baseCSSPrefix + 'mask-msg-inner ' + 'bia-mask-msg-inner' + (MASKMSGWIDTHFROMPARENT < 300 ? ' bia-mask-hidden' : ''),
                        children:{
                            tag: 'div',
                            role: 'presentation',
                            cls: Ext.baseCSSPrefix + 'mask-msg-text' + ' bia-mask-msg-text' + (MASKMSGWIDTHFROMPARENT < 300 ? ' bia-mask-hidden' : ''),
                            html: (Ext.isEmpty(msg) ? 'Processing, please wait...' : msg)
                        }
                    }
                }
            }, true);   
            maskMsg = Ext.get(maskEl.dom.firstChild);
            data.maskEl = maskEl;
            me.addCls(XMASKED);
            maskEl.setDisplayed(true);
            maskMsg.setDisplayed(true);
            maskMsg.setMaxWidth(MASKMSGWIDTHFROMPARENT < MASKMSGWIDTH ? MASKMSGWIDTHFROMPARENT : MASKMSGWIDTH);
            maskMsg.center(me);

            //if (typeof msg === 'string') {
            //    maskMsg.setDisplayed(true);
            //    maskMsg.center(me);
            //} else {
            //    maskMsg.setDisplayed(false);
            //}

            if (dom === DOC.body) {
                maskEl.addCls(Ext.baseCSSPrefix + 'mask-fixed');
            } else {
                me.saveTabbableState();
            }
            me.saveChildrenTabbableState();

            if (Ext.isIE9m && dom !== DOC.body && me.isStyle('height', 'auto')) {
                maskEl.setSize(undefined, elHeight || me.getHeight());
            }

            if (me.getViewSize().height <= 1 && !Ext.isEmpty(me.component)) {
                var domCmp = me.component,
                    repositionMask = function () {
                        var destroyListener = false;
                        if (me.getViewSize().height > 1 && !Ext.isEmpty(me.getData().maskEl) && !Ext.isEmpty(Ext.get(me.getData().maskEl.dom.firstChild))) {
                            destroyListener = true
                            Ext.get(me.getData().maskEl.dom.firstChild).center(me.getData().maskEl)
                        }
                        else if (Ext.isEmpty(me.getData().maskEl) || Ext.isEmpty(Ext.get(me.getData().maskEl.dom.firstChild))) destroyListener = true;

                        if (destroyListener) Ext.destroy(resizeListener);
                    },
                    resizeListener = domCmp.addListener({
                        destroyable: true,
                        resize: {
                            fn: repositionMask,
                            scope: this
                        }
                    });
            }

            return maskEl;
        }
    });
}