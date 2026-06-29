Ext.define('App.view.Security.Detail', {
    extend: 'Ext.form.Panel',
    alias: 'widget.App-Security-Detail',
    bodyPadding: 2,
    shrinkWrap: 3,
    scrollable: true,
    defaults: { xtype: 'displayfield', labelAlign: 'right', labelClsExtra: 'x-form-item-label-light', margin: 0 },
    items: [
        { fieldLabel: 'LogId', name: 'LogId' },
        { fieldLabel: 'TransactionId', name: 'TransactionId' },//, xtype: 'clickDisplayField' },
        { fieldLabel: 'Server', name: 'Server' },
        { fieldLabel: 'Client', name: 'Client' },
        { fieldLabel: 'UserId', name: 'UserId' },
        { fieldLabel: 'TargetId', name: 'TargetId' },
        { fieldLabel: 'LogDate', name: 'LogDate', renderer: BIA.util.Format.ShortLocalDateTime },
        { fieldLabel: 'SqlDate', name: 'SqlDate', renderer: BIA.util.Format.ShortLocalDateTime },
        { fieldLabel: 'Event', name: 'Event' },
        { fieldLabel: 'Detail', name: 'Detail', renderer: function (v) { return (v || '').replace(/\n/g, '<br>'); } }
    ],
    initComponent: function () {
        var me = this;

        me.callParent(arguments);

        if (me.record && me.record.getData) {
            me.loadRecord(me.record);
        }
    }
});