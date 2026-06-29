/**
 * Grid plugin to allow copying of selected rows/cells to the clipboard.
 * Output can be modified in several ways, from the delimiter to whether or not values are quoted.
 */
Ext.define('BIA.grid.plugin.Copyable', {
    alias: 'plugin.copyable',
    extend: 'Ext.AbstractPlugin',

    /**
     * @cfg {Boolean} [includeHeader=true]
     * True to include header text on data being copied.
     */
    includeHeader: true,

    /**
     * @cfg {String} [delimiter='\t']
     * The delimiter for separating the values in the selected data.
     */
    delimiter: '\t',

    /**
     * @cfg {String} [endOfLine='\r\n']
     * The values to mark the end of the line.
     */
    endOfLine: '\r\n',

    /**
     * @cfg {Boolean} [quotedText=false]
     * True to wrap all text values in quotes.
     */
    quotedText: false,

    /**
     * @cfg {String} [quote='"']
     * The string to wrap on either side of quoted text.
     */
    quote: '"',

    pluginId: 'copyable',

    requires: [
        'Ext.util.KeyMap'
    ],

    /**
     * @private
     * Called by the grid on binding this plugin.
     * @param {Ext.grid.Panel} grid
     */
    init: function (grid) {
        var me = this;

        me.grid = grid;
        me.view = grid.view;

        me.view.on('render', me.initKeyMap, me, { single: true });
    },

    /**
     * @private
     * Specify what occurs when the key commands we are listening for get pressed.
     */
    initKeyMap: function () {
        var me = this;
        me.keyMap = Ext.create('Ext.util.KeyMap', {
            target: Ext.getVersion().major >= 6 && me.view.isLockingView ? me.grid.el : me.view.el,
            binding: [
                { key: 'c', ctrl: true, fn: function () { me.doCopy(); } },
                { key: 'a', ctrl: true, fn: function () { me.doSelectAll(); } }
            ]
        });
    },

    /**
     * @private
     * Clean removal of this plugin.
     */
    destroy: function () {
        var me = this;

        Ext.destroy(me.keyMap);

        delete me.grid;
        delete me.view;
        delete me.keyNav;
        delete me.hiddenTextArea;
    },

    /**
     * @private
     * Performs the copy-to-the-clipboard operation.
     */
    doCopy: function () {
        var me = this,
            delim = me.delimiter, eol = me.endOfLine, wrap = (me.quotedText) ? me.quote : '',
            selection = me.grid.getSelectionModel().getSelection(),
            columns = me.view.getGridColumns(),
            data = '', line = '';

        if (me.disabled) return;

        if (me.includeHeader) {
            // generate header list
            Ext.each(columns, function (column) {
                if (column.isVisible()) {
                    line += wrap + column.text + wrap + delim;
                }
            });
            data += line.slice(0, -delim.length) + eol;
        }

        // turn values (list)
        // iterate over each column;
        Ext.each(selection, function (row) {
            line = '';
            Ext.each(columns, function (column) {
                if (column.isVisible()) {
                    line += wrap + row.get(column.dataIndex) + wrap + delim;
                }
            });
            data += line.slice(0, -delim.length) + eol;
        });

        if (window.clipboardData && clipboardData.setData) {
            clipboardData.setData("text", data);
        } else {
            var clipboard = me.getHiddenTextArea();
            clipboard.dom.value = data;
            clipboard.focus();
            clipboard.dom.setSelectionRange(0, data.length);
        }
    },

    /**
     * @private
     * Allows for selecting of every item in the grid.
     */
    doSelectAll: function () {
        if (this.disabled) return;
        this.grid.getSelectionModel().selectAll();
    },

    /**
     * @private
     * A hidden textarea element. When a copy is performed, we spit all of our data into this text area,
     * highlight it, and then let the browser perform the copy operation (since we bound to ctrl+c).
     */
    getHiddenTextArea: function () {
        var me = this;

        if (!me.hiddenTextArea) {
            var item = me.hiddenTextArea = new Ext.Element(document.createElement('textarea'));
            item.setStyle('position', 'absolute');
            item.setStyle('left', '-9999px');
            Ext.get(me.view.el).appendChild(item.dom);
        }

        return me.hiddenTextArea;
    }
});