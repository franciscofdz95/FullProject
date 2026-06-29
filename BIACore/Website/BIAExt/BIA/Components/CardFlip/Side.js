Ext.define('BIA.Components.CardFlip.Side', {
    extend: (Ext.platformTags && Ext.platformTags.modern) ? 'Ext.Container' : 'Ext.container.Container',
    alias: 'widget.BIA-Components-CardFlip-Side',
    xtype: 'cardflipside',
    cls: 'Card',

    layout: {
        type: 'vbox',
        align: 'stretch',
        pack: 'center'
    }
});