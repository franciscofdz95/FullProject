Ext.define('MyReports.Module.MyReports', {
    extend: 'BIA.container.Viewport',
    alias: 'widget.App-Module-MyReports',
    layout: 'border',
    border: false,
    items: [
        { xtype: 'MyReports-Report-Grid', region: 'center' },
        { xtype: 'panel', region: 'south', html: '<span class="red-txt"><b>Reports will be kept for a maximum of 2 weeks<b></span>' }
    ]
});
