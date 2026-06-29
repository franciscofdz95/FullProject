Ext.define('App.View.Component.List.Item.Usage.TimeToggle', {
    extend: 'Ext.button.Segmented',
    alias: 'widget.App-View-Component-List-Item-Usage-TimeToggle',

    cls: 'componentListItemUsageTimetoggle',
    items: [
        { text: 'D', tooltip: 'Day', pressed: true },
        { text: 'W', tooltip: 'Week' },
        { text: 'M', tooltip: 'Month' }
    ]
});