Ext.define('App.View.Connections.Component.FieldContainer', {
    extend: 'Ext.container.Container',
    alias: 'widget.App-View-Connections-Component-FieldContainer',

    componentCls: 'connectionsComponentFieldcontainer',
    margin: 3,
    setEditable: function setEditable(editable) {
        var fields = this.query('field');
        for (var i = 0; i < fields.length; i++) fields[i].setReadOnly(!editable);

        var buttons = this.query('button');
        for (var i = 0; i < buttons.length; i++) buttons[i].setHidden(!editable);
    }
});