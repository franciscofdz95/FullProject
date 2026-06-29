if (Ext.getVersion().major >= 5) {
    Ext.define('BIA.Components.HeaderContainer', {
        extend: (Ext.platformTags && Ext.platformTags.modern) ? 'Ext.Container' : 'Ext.container.Container',
        alias: 'widget.BIA-Components-HeaderContainer',
        xtype: 'biaHeaderContainer',
        layout: {
            type: 'hbox',
            align: 'middle',
            pack: 'start'
        },
        padding: 5,
        outerWidth: 175,
        leftWidth: null,
        rightWidth: null,
        initComponent: function AppViewCorpPLZoomComponentsHeaderContainerLeftContainerInitComponent() {
            this.cls = (this.cls != null ? this.cls + ' ' : '') + 'BIAHeaderContainer'
            if (this.items != null && Ext.isArray(this.items) && this.items.length > 0) {
                var innerItems = Ext.clone(this.items),
                leftItems = innerItems.filter(function (item) { return item.position === 'left'; }),
                rightItems = innerItems.filter(function (item) { return item.position === 'right'; }),
                centerItems = innerItems.filter(function (item) { return item.position !== 'left' && item.position !== 'right'; });

                this.items = [
                    {
                        xtype: 'container',
                        layout: {
                            type: 'hbox',
                            align: 'middle',
                            pack: 'start'
                        },
                        width: this.leftWidth != null ? this.leftWidth : this.outerWidth,
                        items: leftItems
                    },
                    { xtype: 'tbfill', flex: 1 },
                    {
                        xtype: 'container',
                        layout: {
                            type: 'hbox',
                            align: 'middle',
                            pack: 'center'
                        },
                        width: this.width,
                        items: centerItems
                    },
                    { xtype: 'tbfill', flex: 1 },
                    {
                        xtype: 'container',
                        layout: {
                            type: 'hbox',
                            align: 'middle',
                            pack: 'end'
                        },
                        width: this.rightWidth != null ? this.rightWidth : this.outerWidth,
                        items: rightItems
                    }
                ];
                this.width = null;
            }
            this.callParent(arguments);
        }
    });
}