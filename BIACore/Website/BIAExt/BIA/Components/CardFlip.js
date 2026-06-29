Ext.define('BIA.Components.CardFlip', {
    extend: (Ext.platformTags && Ext.platformTags.modern) ? 'Ext.Container' : 'Ext.container.Container',
    alias: 'widget.BIA-Components-CardFlip',
    xtype: 'cardflip',
    //cls: 'CardFlip ' + (Ext.isIE ? 'flip-card-ie' : 'flip-card'),
    cls: 'CardFlip flip-card',

    layout: {
        type: 'hbox',
        align: 'stretch',
        pack: 'center'
    },


    frontItems: [],
    backItems: [],
    frontButtonHoverText: 'Flip card for more detail',
    backButtonHoverText: 'Flip card for summary',
    flipTypeButton: true,
    flipTypeCardClick: false,
    //flipType: 'button,card,edge', //card, button, edge or any combo
    initComponent: function () {
        if (Ext.isArray(this.frontItems) && this.frontItems.length > 0 && Ext.isArray(this.backItems) && this.backItems.length > 0) {
            this.items = [
                {
                    xtype: 'cardflipcontainer',
                    itemId: 'frontSide',
                    cls: 'card-container front',
                    hidden: false,
                    layout: {
                        type: 'hbox',
                        align: 'stretch',
                        pack: 'center'
                    },
                    flex: 1,
                    defaults: { flex: 1 },
                    items: [
                        {
                            xtype: 'cardflipside',
                            items: [
                                { xtype: 'cardflipsidecontainer', items: Ext.clone(this.frontItems) }
                            ]
                        },
                    ]
                },
                {
                    xtype: 'cardflipcontainer',
                    itemId: 'backSide',
                    cls: 'card-container back',
                    hidden: true,
                    layout: {
                        type: 'hbox',
                        align: 'stretch',
                        pack: 'center'
                    },
                    flex: 1,
                    defaults: { flex: 1 },
                    items: [
                        {
                            xtype: 'cardflipside',
                            items: [
                                { xtype: 'cardflipsidecontainer', items: Ext.clone(this.backItems) }
                            ]
                        }
                    ]
                }
            ];            
        }

        this.height = Ext.isNumeric(this.height) ? this.height + 30 : this.height;

        this.toggleSide = function toggleSide() {
            this.fireEvent('toggleside', this, this.down('cardflipcontainer[hidden=false]'), this.down('cardflipcontainer[hidden=true]'));
        }

        this.callParent();
    }
}, function (me) {
    Ext.apply(me, {
        items: []
    });
});