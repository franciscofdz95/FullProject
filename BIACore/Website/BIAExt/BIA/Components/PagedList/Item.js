Ext.define('BIA.Components.PagedList.Item', {
    extend: (Ext.platformTags && Ext.platformTags.modern) ? 'Ext.Container' : 'Ext.container.Container',
    alias: 'widget.BIA-Components-PagedList-Item',
    xtype: 'pagedlistitem',
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

    /*
     - 'customStyle' = if true, do not use default class styling
     - 'header' = if true, is treated as header item including styling
     - 'total' = if true, is treated as total item row including styling
     
        Header vs Total vs Item:
         - Can handle header/total-specific configurations for styling and binding
         - To add header item, add list item xtype to dockedItems of PagedList and dock to top. This can be done in conjunction with a custom panel header
            by adding the list item after the custom panel header.
         - To add Total item, add list item xtype to dockedItems of PagedList and dock to bottom.
     
        Child Component Record Field Binding:
         - 'dataField' = name of field in record to bind value
         - 'renderer' = renderer function reference to be used to alter the value before being applied to component
                fn(dataValue, field, { data: recordForListItem })
         - 'useRendererForHeader' = only use renderer when list item is the header item
         - 'useRendererForTotal' = only use renderer when list item is the total item
         - 'headerRenderer' = SEE renderer. Allows for individual item/header renderers to be set differently
         - 'setValueAsDefault' = used for Ext.form.field components to set the bound value as the initialValue and originalValue for consistent dirty field tracking
         - 'useEvent' = force using of 'loaddata' fireEvent to pass the data for binding and allow component handler to do full binding
    */
});