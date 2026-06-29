Ext.define('BIA.Components.HoverWindow', {
    extend: (Ext.platformTags && Ext.platformTags.modern) ? 'Ext.Container' : 'Ext.container.Container',
    alias: 'widget.BIA-Components-HoverWindow',
    xtype: 'hoverwindow',
    cls: 'BIA_Components_HoverWindow',

    floating: true,
    hidden: true,
    alwaysOnTop: true,
    animateShadow: true,
    constrain: true,
    shrinkWrap: 3,

    windowXtype: undefined,
    parentDataProperties: undefined,
    hovered: false,

    layout: 'column',

    padding: 5,
    style: {
        backgroundColor: '#dddddd',
        borderRadius: '5px',
        border: '#bbbbbb 3px solid'
    },
    resizeWindow: function () {
        if (this.getActiveAnimation() == false) this.fireEvent('resizeWindow', this);
        else {
            Ext.defer(this.resizeWindow, 50, this);
        }
    },
    hoverWindowClose: function () {
        if (this.getActiveAnimation() == false) this.fireEvent('close', this);
        else {
            Ext.defer(this.close, 50, this);
        }
    }
});

/*
Hover Window config options:
hoverWindow: 'xtype-of-inner-display'

OR

hoverWindow: {
    // Value  Description
    // -----  -----------------------------
    // tl     The top left corner (default)
    // t      The center of the top edge
    // tr     The top right corner
    // l      The center of the left edge
    // c      In the center of the element
    // r      The center of the right edge
    // bl     The bottom left corner
    // b      The center of the bottom edge
    // br     The bottom right corner    
    alignPosition: 'bl-tl', 
    windowXtype: 'xtype-of-inner-display',
    parentDataProperties: 'attributeName',
    showOnClick: false,
    showOnHover: true,
    layout: 'column'
}

OR

hoverWindow: {
    // Value  Description
    // -----  -----------------------------
    // tl     The top left corner (default)
    // t      The center of the top edge
    // tr     The top right corner
    // l      The center of the left edge
    // c      In the center of the element
    // r      The center of the right edge
    // bl     The bottom left corner
    // b      The center of the bottom edge
    // br     The bottom right corner    
    alignPosition: 'bl-tl', 
    windowXtype: {
        xtype: 'xtype-of-inner-display',
        width: 100  //other component config options
    },
    parentDataProperties: 'attributeName',
    showOnClick: false,
    showOnHover: true,
    layout: 'column'
}

OR

hoverWindow: {
    // Value  Description
    // -----  -----------------------------
    // tl     The top left corner (default)
    // t      The center of the top edge
    // tr     The top right corner
    // l      The center of the left edge
    // c      In the center of the element
    // r      The center of the right edge
    // bl     The bottom left corner
    // b      The center of the bottom edge
    // br     The bottom right corner    
    alignPosition: 'bl-tl',
    parentDataProperties: ['attributeName1','attributeName2'], 
    items: [
        { xtype: 'xtype-of-inner-display' }
    ],
    showOnClick: false,
    showOnHover: true,
    layout: 'column'
}
*/