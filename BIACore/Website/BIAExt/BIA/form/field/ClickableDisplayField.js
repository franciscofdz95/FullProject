Ext.define('BIA.form.field.ClickableDisplayField', {
    extend: (Ext.platformTags && Ext.platformTags.modern) ? 'Ext.field.Display' : 'Ext.form.field.Display',
    alias: 'widget.clickDisplayField',

    initComponent: function () {
        var me = this;
        me.fieldCls = 'bia-fakelink ' + me.fieldCls;
        me.callParent(arguments);
        me.on('render', me.bindEvents, me, { single: true });
    },

    bindEvents: function (me) {
        me.mon(me.getEl(), {
            click: function (e) { me.fireEvent('click', me, e); },
            dblclick: function (e) { me.fireEvent('dblclick', me, e); },
            scope: me
        });
    }
});