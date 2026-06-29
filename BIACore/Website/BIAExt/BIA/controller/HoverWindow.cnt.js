
Ext.define('BIA.controller.HoverWindow', {
    extend: 'Ext.app.Controller',
    refs: [],
    hoverWindowConfigs: {},
    init: function () {
        var me = this;
        me.control({
            'BIA-Components-HoverWindow': {
                afterrender: {
                    fn: this.HoverWindowAfterRender
                },
                boxready: {
                    fn: this.HoverWindowBoxReady,
                    delay: 50
                },
                resizeWindow: {
                    fn: this.HoverWindowBoxReady
                },
                close: {
                    fn: this.HoverWindowClose
                }
            }
        });
        me.listen({
            global: {
                added: {
                    fn: this.ComponentAdded
                },
                hoverwindowconfig: {
                    fn: this.ComponentAdded
                }
            }
        });
    },
    GetHoverWindowConfigFromComponent: function (hoverWindow) {
        var cmp = null;
        var configIds = Ext.Object.getKeys(this.hoverWindowConfigs);
        for (i = 0; i < configIds.length; i++) {
            if (this.hoverWindowConfigs[configIds[i]].component === hoverWindow) cmp = this.hoverWindowConfigs[configIds[i]];
        }
        return cmp;
    },
    GetPadding: function GetPadding(me, lr) {
        var paddingValue = me.getEl().getPadding(lr ? 'lr' : 'tb');;
        if (Ext.isNumber(me.padding)) {
            paddingValue = me.padding * 2
        }
        else if (me.padding) {
            var paddingArray = me.padding.split(' ');
            if (paddingArray.length == 4) {
                paddingValue = paddingArray[(lr ? 1 : 0)] + paddingArray[(lr ? 3 : 2)];
            }
            else if (paddingArray.length == 3) {
                paddingValue = paddingArray[(lr ? 1 : 0)] + paddingArray[(lr ? 1 : 2)];
            }
            else if (paddingArray.length == 2) {
                paddingValue = paddingArray[(lr ? 1 : 0)] * 2;
            }
            else if (paddingArray.length == 2) {
                paddingValue = paddingArray[0] * 2;
            }
        }

        return paddingValue;
    },
    GetBorder: function GetBorder(me, lr) {
        var borderValue = me.getEl().getBorderWidth(lr ? 'lr' : 'tb');
        if (Ext.isNumber(me.border)) {
            borderValue = me.border * 2
        }
        else if (me.border) {
            var borderArray = me.border.split(' ');
            if (borderArray.length == 4) {
                borderValue = borderArray[(lr ? 1 : 0)] + borderArray[(lr ? 3 : 2)];
            }
            else if (borderArray.length == 3) {
                borderValue = borderArray[(lr ? 1 : 0)] + borderArray[(lr ? 1 : 2)];
            }
            else if (borderArray.length == 2) {
                borderValue = borderArray[(lr ? 1 : 0)] * 2;
            }
            else if (borderArray.length == 2) {
                borderValue = borderArray[0] * 2;
            }
        }

        return borderValue;
    },
    GetHeightOfAllChildren: function GetHeightOfAllChildren(me, includePadding) {
        var height = 0;
        height = this.GetPadding(me, false) + this.GetBorder(me, false);
        me.query('>').forEach(function (child, array, allChildren) {
            if (!child.isHidden()) {
                //if (child.getHeight() == 0) { this.SetHeightOfParentToHeightOfAllChildren(child); }
                height += child.getHeight() + child.getEl().getMargin('tb') + child.getEl().getBorderWidth('tb') + (includePadding ? child.getEl().getPadding('tb') : 0);
            }
        }, this);
        return height + 1;
    },
    SetHeightOfParentToHeightOfAllChildren: function SetHeightOfParentToHeightOfAllChildren(me, doLayout, includePadding) {
        doLayout = doLayout || false;
        if (me.rendered) {
            me.setHeight(this.GetHeightOfAllChildren(me, includePadding));
            //if (doLayout) { me.updateLayout({ isRoot: true }); }
        }
    },
    GetWidthOfAllChildren: function GetWidthOfAllChildren(me, includePadding) {
        var width = 0;
        width = this.GetPadding(me, true) + this.GetBorder(me, true);
        me.query('>').forEach(function (child, array, allChildren) {
            if (!child.isHidden()) {
                //if (child.getWidth() == 0) { this.SetWidthOfParentToWidthOfAllChildren(child); }
                width += child.getWidth() + child.getEl().getMargin('lr') + child.getEl().getBorderWidth('lr') + (includePadding ? child.getEl().getPadding('lr') : 0);
            }
        }, this);
        return width + 1;
    },
    SetWidthOfParentToWidthOfAllChildren: function SetWidthOfParentToWidthOfAllChildren(me, doLayout, includePadding) {
        doLayout = doLayout || false;
        if (me.rendered) {
            me.setWidth(this.GetWidthOfAllChildren(me, includePadding));
            //if (doLayout) { me.updateLayout({ isRoot: true }); }
        }
    },
    SetHeightAndWidthOfParentToHeightAndWidthOfAllChildren: function SetHeightAndWidthOfParentToHeightAndWidthOfAllChildren(me, doLayout, includePadding) {
        //var startTimer = new Date;
        this.SetHeightOfParentToHeightOfAllChildren(me, doLayout, includePadding);
        //startTimer = new Date;
        this.SetWidthOfParentToWidthOfAllChildren(me, doLayout, includePadding);
        //me.updateLayout({ isRoot: true });
        this.SetHeightOfParentToHeightOfAllChildren(me, doLayout, includePadding);
    },
    HoverWindowAfterRender: function HoverWindowAfterRender(me, eOpts) {
        me.getEl().hover(function (hw) { hw.hovered = true; }, function (hw) { hw.hovered = false; }, this, { args: [me] });
    },
    HoverWindowBoxReady: function HoverWindowBoxReady(me) {
        this.SetHeightAndWidthOfParentToHeightAndWidthOfAllChildren(me, true, true);
    },
    HoverWindowClose: function HoverWindowClose(me) {
        if (me) {
            var matchingConfig = this.GetHoverWindowConfigFromComponent(me);
            if (matchingConfig && matchingConfig.element && matchingConfig.element.component) {
                this.HoverWindowHide(matchingConfig.element.component);
            }
        }
    },
    CreateHoverWindowConfig: function CreateHoverWindowConfig(me) {
        if (me.rendered) {
            var startTimer = new Date;
            var element = me.getEl();
            if (element) {
                var hoverWindow = {
                    xtype: 'hoverwindow',
                    showOnClick: false,
                    showOnHover: true,
                    alignTarget: me,
                    alignPosition: (me.hoverWindow.alignPosition || 'tl-br?'),
                    defaultAlign: (me.hoverWindow.alignPosition || 'tl-br?'),
                    renderTo: (me.up('viewport') || Ext.ComponentQuery.query('viewport')[0]).getEl(),
                    constrainTo: (me.up('viewport') || Ext.ComponentQuery.query('viewport')[0]).getEl(),
                    hoverDelay: 300,
                    hoverOutDelay: 300,
                    hoverComponentId: me.id
                };

                if (Ext.isString(me.hoverWindow)) {
                    me.hoverWindow = { hoverWindowItems: [{ xtype: me.hoverWindow }] };
                }
                me.hoverWindow = Ext.applyIf(me.hoverWindow,
                    !me.hoverWindow.windowXtype
                        ? Ext.applyIf(me.hoverWindow, { hoverWindowItems: me.hoverWindow.items })
                        : Ext.isString(me.hoverWindow.windowXtype)
                            ? Ext.applyIf(me.hoverWindow, { hoverWindowItems: [{ xtype: me.hoverWindow.windowXtype }] })
                            : Ext.applyIf(me.hoverWindow, { hoverWindowItems: [me.hoverWindow.windowXtype] }));

                //Ext.log(me.id + ' hoverWindow.alignTarget = ' + hoverWindow.alignTarget.id + ' me.hoverWindow.alignTarget = ' + (me.hoverWindow.alignTarget || { id: undefined }).id);

                delete me.hoverWindow.alignTarget;

                hoverWindow = Ext.applyIf(Ext.clone(me.hoverWindow), hoverWindow);

                if (me.hoverWindow.hoverDelay != null) hoverWindow.hoverDelay = me.hoverWindow.hoverDelay
                if (me.hoverWindow.hoverOutDelay != null) hoverWindow.hoverOutDelay = me.hoverWindow.hoverOutDelay;

                if (hoverWindow.items) { delete hoverWindow.items; }

                if (hoverWindow.cls && hoverWindow.cls.indexOf('BIA_Components_HoverWindow') == -1) {
                    hoverWindow.cls = hoverWindow.cls + ' BIA_Components_HoverWindow';
                }

                if (hoverWindow.hoverWindowItems) {
                    this.hoverWindowConfigs[me.id] = { config: hoverWindow, element: element };
                    //for (index in this.hoverWindowConfigs) {
                    //    Ext.log(index + ': ' + this.hoverWindowConfigs[index].config.alignTarget.id);
                    //}
                }
                else {
                    Ext.log({
                        msg: 'Attempted to create hover window config but hover window items not configured',
                        dump: me,
                        level: 'error'
                    });
                }
            }
            else {
                Ext.log({
                    msg: 'Attempted to create hover window config but dom element does not exist',
                    dump: me,
                    level: 'error'
                });
            }
        }
        else {
            Ext.log({
                msg: 'Attempted to create hover window config but render status was incorrect',
                dump: me,
                level: 'error'
            });
        }
    },
    AddHoverListener: function AddHoverListener(me) {
        this.CreateHoverWindowConfig(me);
        var element = me.getEl();
        if (element && this.hoverWindowConfigs[me.id].config) {
            if (this.hoverWindowConfigs[me.id].config.showOnHover) {
                element.on('mouseover', this.ComponentHoverOver, this, { args: [me], buffer: this.hoverWindowConfigs[me.id].config.hoverDelay });
                element.on('mouseout', this.ComponentHoverOut, this, { args: [me], buffer: this.hoverWindowConfigs[me.id].config.hoverOutDelay });
                //element.hover(this.ComponentHoverOver, this, { args: [me], buffer: this.hoverWindowConfigs[me.id].config.hoverDelay });
                //element.hover(this.ComponentHoverOut, this, { args: [me], buffer: this.hoverWindowConfigs[me.id].config.hoverOutDelay });
            }

            if (this.hoverWindowConfigs[me.id].config.showOnClick) {
                element.addListener({
                    click: {
                        fn: this.ComponentClick,
                        scope: this,
                        args: [me]
                    }
                });
            }

            me.addListener({
                destroy: {
                    fn: function (me) {
                        var currentHoverWindowConfig = this.hoverWindowConfigs[me.id];
                        if (currentHoverWindowConfig) {
                            if (currentHoverWindowConfig.component) {
                                currentHoverWindowConfig.component.destroy();
                            }
                        }
                    },
                    //fn: this.HoverWindowHide,
                    scope: this,
                    args: [me]
                }
            });
        }

    },
    HoverWindowShow: function HoverWindowShow(me) {
        var currentHoverWindowConfig = this.hoverWindowConfigs[me.id];
        if (currentHoverWindowConfig) {
            if (currentHoverWindowConfig.component) {
                currentHoverWindowConfig.component.destroy();
            }
            currentHoverWindowConfig.component = Ext.create(currentHoverWindowConfig.config);
            if (currentHoverWindowConfig.component) {
                if (currentHoverWindowConfig.component.parentDataProperties) {
                    currentHoverWindowConfig.component.hoverWindowItems.forEach(function (item, index, array) {
                        if (Ext.isString(currentHoverWindowConfig.component.parentDataProperties) &&
                            (me[currentHoverWindowConfig.component.parentDataProperties] || me.up('[' + currentHoverWindowConfig.component.parentDataProperties + ']'))) {
                            item[currentHoverWindowConfig.component.parentDataProperties] = me[currentHoverWindowConfig.component.parentDataProperties] || me.up('[' + currentHoverWindowConfig.component.parentDataProperties + ']')[currentHoverWindowConfig.component.parentDataProperties];
                        }
                        else {
                            currentHoverWindowConfig.component.parentDataProperties.forEach(function (prop, i, arr) {
                                item[prop] = me[prop];
                            });
                        }
                    });
                }

                currentHoverWindowConfig.component.height = 0;
                currentHoverWindowConfig.component.width = 0;

                currentHoverWindowConfig.component.show();
                currentHoverWindowConfig.component.add(currentHoverWindowConfig.component.hoverWindowItems);

                currentHoverWindowConfig.component.animate({
                    to: {
                        width: this.GetWidthOfAllChildren(currentHoverWindowConfig.component, true),
                        height: this.GetHeightOfAllChildren(currentHoverWindowConfig.component, true)
                    }
                });
            }
        }
    },
    HoverWindowHide: function HoverWindowHide(me) {
        var currentHoverWindowConfig = this.hoverWindowConfigs[me.id];
        if (currentHoverWindowConfig) {
            if (currentHoverWindowConfig.component) {
                currentHoverWindowConfig.component.hide();
                currentHoverWindowConfig.component.removeAll();
                this.HoverWindowAfterRender(currentHoverWindowConfig.component);
            }
        }
    },
    ComponentAdded: function ComponentAdded(me, eOpts) {
        if (me.hoverWindow) {
            me.addListener({
                afterrender: {
                    fn: this.AddHoverListener,
                    scope: this
                }
            });
        }
    },
    ComponentHoverOver: function ComponentHoverOver(me) {
        if (me.getEl().is(':hover')) {
            if (me.fireEvent('beforeHoverWindowShow', me, this.hoverWindowConfigs[me.id].config) == false) { return; };
            this.HoverWindowShow(me);
            me.fireEvent('afterHoverWindowShow', me, this.hoverWindowConfigs[me.id].component);
        }
    },
    ComponentHoverOut: function ComponentHoverOut(me) {
        var currentHoverWindowConfig = this.hoverWindowConfigs[me.id];
        if (currentHoverWindowConfig) {
            if (currentHoverWindowConfig.component && currentHoverWindowConfig.component.hovered) {
                currentHoverWindowConfig.component.getEl().hover(function () { }, this.ComponentHoverOut, this, { args: [me], buffer: currentHoverWindowConfig.config.hoverOutDelay });
            }
            else if (!me.getEl() || !me.getEl().is(':hover')) {
                me.fireEvent('beforeHoverWindowHide', me, this.hoverWindowConfigs[me.id].component);
                this.HoverWindowHide(me);
                me.fireEvent('afterHoverWindowHide', me, this.hoverWindowConfigs[me.id].component);
            }
        }
    },
    ComponentClick: function ComponentClick(me) {
        var currentHoverWindowConfig = this.hoverWindowConfigs[me.id];
        if (currentHoverWindowConfig) {
            if (currentHoverWindowConfig.component && !currentHoverWindowConfig.component.isHidden()) {
                me.fireEvent('beforeHoverWindowHide', me, currentHoverWindowConfig.component);
                this.HoverWindowHide(me);
                me.fireEvent('afterHoverWindowHide', me, currentHoverWindowConfig.component);
            }
            else {
                if (me.fireEvent('beforeHoverWindowShow', me, currentHoverWindowConfig.config) == false) { return; };
                this.HoverWindowShow(me);
                me.fireEvent('afterHoverWindowShow', me, currentHoverWindowConfig.component);
            }
        }
    }
});