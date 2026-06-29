Ext.define('BIA.Components.CardFlip.Side.Container', {
    extend: (Ext.platformTags && Ext.platformTags.modern) ? 'Ext.Container' : 'Ext.container.Container',
    alias: 'widget.BIA-Components-CardFlip-Side-Container',
    xtype: 'cardflipsidecontainer',

    layout: {
        type: 'vbox',
        align: 'stretch',
        pack: 'start'
    },
    flex: 1
});