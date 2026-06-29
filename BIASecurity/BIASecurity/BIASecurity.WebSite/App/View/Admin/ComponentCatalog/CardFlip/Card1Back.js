Ext.define('App.View.Admin.ComponentCatalog.CardFlip.Card1Back', {
    extend: 'Ext.container.Container',
    alias: 'widget.App-View-Admin-ComponentCatalog-CardFlip-Card1Back',
    layout: {
        type: 'vbox',
        align: 'stretch',
        pack: 'start'
    },
    flex: 1,

    items: [
        {
            xtype: 'container',
            flex: 1,
            padding: 5,
            margin: 5,
            style: {
                border: '1px black solid'
            },
            html: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut accumsan dignissim luctus. Fusce varius tortor ac orci mollis, at egestas elit gravida. Sed eget nibh rutrum augue aliquet dictum. Donec sit amet nisl fringilla, sollicitudin lorem a, faucibus leo. Curabitur vitae nisl ligula. Nam vel dictum diam, tincidunt commodo velit. Ut malesuada ut nisi nec varius. Maecenas rhoncus nisl ac ante tincidunt eleifend. Nunc at aliquam nibh, id vestibulum sem. Integer posuere gravida lacus, vel pellentesque urna sollicitudin ut. Curabitur id dolor ornare eros accumsan porttitor in sed nunc. Nam sollicitudin ut nibh in efficitur. Nam a leo sapien. Suspendisse potenti.'
        },
        {
            xtype: 'container',
            html: '<img src="images/kumquat.jpg" height="250px" width="250px" />'
        }
    ]
});