Ext.define('BIA.Components.CardFlip.Side.FlipButton.Footer', {
    extend: (Ext.platformTags && Ext.platformTags.modern) ? 'Ext.Container' : 'Ext.container.Container',
    alias: 'widget.BIA-Components-CardFlip-Side-FlipButton-Footer',
    xtype: 'cardflipsidefooter',
    cls: 'CardFlipSideFooter',
    layout: {
        type: 'hbox',
        align: 'stretch',
        pack: 'start'
    },
    width: 30,
    height: 30,
    floating: true,
    defaultAlign: 'br-br',
    shadow: false,

    items: [
        //{ xtype: 'button', itemId: 'CardFlipSideFooterButton', text: 'Flip to Other Side' }
        { xtype: 'container', itemId: 'CardFlipSideFooterButton', cls: 'CardFlipSideFooterButton' }

    ]
});