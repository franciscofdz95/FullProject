Ext.define('App.View.Component.Permissions.More', {
    extend: 'Ext.button.Button',
    alias: 'widget.App-View-Component-Permissions-More',
    iconCls: 'fa fa-bars fa-fw',
    style: {
        fontSize: '20px',
        color: '#fff'
    },
    padding: '5 7 9 6',
    disabled: true,

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
        alignPosition: 'tr-br?',
        windowXtype: 'App-View-Component-Permissions-More-List',
        parentDataProperties: 'morePermissions',
        showOnClick: true,
        showOnHover: false,
        layout: 'column'
    }
});