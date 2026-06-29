/**
 * @class Ext.ux.exporter.excelFormatter.Cell
 * @extends Object
 * Represents a single cell in a worksheet
 */

Ext.define("Ext.ux.exporter.excelFormatter.Cell", {
    constructor: function (config) {
        var NOT_SAFE_IN_XML_1_0 = /[^\x09\x0A\x0D\x20-\xFF\x85\xA0-\uD7FF\uE000-\uFDCF\uFDE0-\uFFFD]/gm;

        config.value = config.value.replace(NOT_SAFE_IN_XML_1_0, '');

        Ext.applyIf(config, {
            type: "String"
        });

        Ext.apply(this, config);

        Ext.ux.exporter.excelFormatter.Cell.superclass.constructor.apply(this, arguments);
    },

    render: function () {
        return this.tpl.apply(this);
    },

    tpl: new Ext.XTemplate(
        '<ss:Cell ss:StyleID="{style}">',
            '<tpl if="value != null && value.length &gt; 0"><ss:Data ss:Type="{type}">{value}</ss:Data></tpl>',
          //'<ss:Data ss:Type="{type}">{value}</ss:Data>',
        '</ss:Cell>'
    )
});