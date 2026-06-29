Ext.define('BIA.Components.Export.Window.Loading.Container', {
    extend: 'BIA.Components.Export.Window.Component.MessageContainer',
    alias: 'widget.BIA-Components-Export-Window-Loading-Container',
    items: [
        { xtype: 'BIA-Components-Export-Window-Loading-Message' },
        { xtype: 'BIA-Components-Export-Window-Loading-Icon' },
        { xtype: 'BIA-Components-Export-Window-Loading-Autoclose', margin: 0 }
    ]
});