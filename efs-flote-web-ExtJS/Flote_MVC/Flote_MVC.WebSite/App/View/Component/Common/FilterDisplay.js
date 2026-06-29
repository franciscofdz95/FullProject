Ext.define('App.View.Component.FilterDisplay', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.App-View-Component-FilterDisplay',
    layout: {
        type: 'vbox',
        align: 'fit',
        pack: 'center'
    },
    items: [
        { xtype: 'label', text: 'No Filters Selected' }
    ],
    SetDisplay: function (value) {
        var label = this.down('[xtype="label"]');

        if (label)
            label.setText(value);
    }
});
