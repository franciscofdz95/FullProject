Ext.define('BIA.Components.ClearConfirmationPopup', {
    extend: (Ext.platformTags && Ext.platformTags.modern) ? 'Ext.Container' : 'Ext.container.Container',
    alias: 'widget.BIA-Components-ClearConfirmationPopup',

    floating: true,
    hidden: true,
    alwaysOnTop: true,
    animateShadow: true,
    constrain: true,
    defaultAlign: 'r-r?',
    border: false,
    shadow: false,
    hideMode: 'offsets',

    style: {
        backgroundColor: '#ddd',
        borderRadius: '5px'
    },

    defaults: {
        padding: '5 10',
        margin: 5
    },
    items: [
        {
            xtype: 'button',
            itemId: 'ConfirmButton',
            cls: 'RedButton',
            focusCls: 'RedButtonFocus',
            overCls: 'RedButtonHover x-btn-hover'
        },
        {
            xtype: 'button',
            itemId: 'CancelButton',
            margin: '5 5 5 0'
        }
    ]
});