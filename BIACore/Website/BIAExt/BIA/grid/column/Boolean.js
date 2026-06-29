/**
 * A Boolean column that automatically renders as an icon (green check, red 'x').
 * Also maps the editor to an actual checkbox.
 */
Ext.define('BIA.grid.column.Boolean', {
    extend: 'Ext.grid.column.Boolean',
    alias: 'widget.checkboxcolumn',

    /**
     * @cfg {String} [align='center']
     * Center the checked value in the column.
     */
    align: 'center',

    /**
     * @cfg {Object/String} editor
     * The editor to use when this column goes into 'edit' mode.
     * Defaults to a checkbox.
     */
    editor: { xtype: 'checkbox' },

    width: 50,

    /**
     * Defines the default renderer for this column as 'check'/'x' icons.
     * @param {Object} value the value of the current row based on the dataIndex
     * @param {Object} metaData the cell information for this row/column
     * @param {Ext.data.Model} record the record for this row of data
     */
    renderer: function (value, metaData) {
        metaData.tdCls += ' icon-center ';
        metaData.tdCls += (value) ? 'icon-accept' : 'icon-decline';
    }
});

