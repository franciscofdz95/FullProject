Ext.define('App.Controller.Access.Request.RequestGeo', {
    extend: 'Ext.app.Controller',

    init: function init() {
        this.control({
            'App-View-Access-Request-Window #geoField': {
                select: this.GeoChange,
                focus: this.GeoFocus
            }
        });
    },
    GeoChange: function GeoChange(me, rec) {
        var win = me.up('window'),
            container = win.down('App-View-Access-Request-RequestGeo'),
            fields = container.query('field[dataField]');

        Ext.each(fields, function (a) {
            if (rec != null && !Ext.isEmpty(rec.get(a.dataField)))
                a.setValue(rec.get(a.dataField));
            else
                a.setValue(null);
        }, this);
    },
    GeoFocus: function GeoFocus(me) {
        var reqWindow = me.up('App-View-Access-Request-Window'),
            helpField = reqWindow.down('#FieldHelpHint');

        helpField.setHtml("<b>Request Geo Field:</b> Please select the appropriate geography. You can simply type in Corporate or Region, District, Country, Location name or number and select the item from the drop down. Alternatively, you can click on the down arrow and scroll through the available geographies. If you do not see a matching geo, please select the most appropriate next higher level. Some applications only have Corporate, so that is fine if no other options are available.");
    }
});