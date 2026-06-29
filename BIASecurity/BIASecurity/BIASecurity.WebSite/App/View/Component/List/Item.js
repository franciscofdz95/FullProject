Ext.define('App.View.Component.List.Item', {
    extend: 'Ext.container.Container',
    alias: 'widget.App-View-Component-List-Item',
    header: false,
    total: false,
    customStyle: false,
    initComponent: function initComponent() {
        this.cls = (this.cls && this.cls.length > 0 ? this.cls + ' ' : '') + (this.header ? 'ListItemHeader ' : '') + 'ListItem';
        if (!this.customStyle) {
            this.cls = (this.cls && this.cls.length > 0 ? this.cls + ' ' : '') + 'ListItemDefault' + (this.header ? ' ListItemHeaderDefault' : '');
            //this.style = Ext.apply(Ext.apply(Ext.clone(this.defaultStyle), this.header ? Ext.clone(this.defaultHeaderStyle) : {}),
            //    this.style);
        }
        this.callParent(arguments);
    },
    padding: 5
});