Ext.define('BIA.Components.CardFlip.Container', {
    extend: (Ext.platformTags && Ext.platformTags.modern) ? 'Ext.Container' : 'Ext.container.Container',
    alias: 'widget.BIA-Components-CardFlip-Container',
    xtype: 'cardflipcontainer',
    cls: 'card-container',
    hideMode: 'offsets',
    margin: '10 0 20'
});