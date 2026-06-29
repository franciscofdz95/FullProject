/* ====================================================================================================
NAME:			[Search Field Filter]
BEHAVIOR:		Shows search Field Filter.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/26/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('SearchComponent', {
    extend: 'Ext.form.field.Text',
    alias: 'widget.searchfield',
    emptyText: 'Search',
    //cls: 'ext-searchfield',
    barcode: false,
    width:80,
    triggers: {
        clear: {
            weight: 0,
            cls: Ext.baseCSSPrefix + 'form-clear-trigger',
            hidden: true,
            handler: 'onClearClick',
            scope: 'this'
        },
        search: {
            weight: 1,
            cls: Ext.baseCSSPrefix + 'form-search-trigger search-trigger',
            scope: 'this'
        },
        barcode: {
            weight: 1,
            cls: Ext.baseCSSPrefix + 'x-fa fa-barcode search-barcode',
            handler: 'onBarCodeClick',
            scope: 'this'
        }
    },
    /**
     * @event onsearch
     * Fires when special key is entered
     * @param {Ext.form.field.Text} this This text field
     * @param {string} field value
     */

    /**
     * @event onclear
     * Fires when clear trigger is clicked
     * @param {Ext.form.field.Text} this This text field
     * @param {string} field value
     */

    //initComponent: function () {
    //    var me = this;
    //    me.callParent(arguments);
    //    if (!me.barcode) {
    //        me.getTrigger('barcode').hide();
    //    }
    //    me.on('specialkey', function (f, e) {
    //        if (e.getKey() == e.ENTER) {
    //            me.fireEvent('onsearch', me, me.getValue());
    //        }
    //    });
    //},
    /**
     * @method onClearClick
     * execute when  clear trigger is clicked
     */
    onClearClick: function () {
        var me = this;
        me.reset();
        me.getTrigger('clear').hide();
        me.fireEvent('onclear', me, me.getValue());
        me.updateLayout();
    },
    /**
     * @method onBarCodeClick
     * execute when  clear trigger is clicked
     */
    onBarCodeClick: function () {
        var me = this;
        me.fireEvent('onbarcode', me);
    },
    /**
     * @method onChange
     * execute when  search field value changed
     * @param {string} field new value
     * @param {string} field old value
     * @param {Ext.util.Observable.addListener} event
     */
    onChange: function (newValue, oldValue, eOpts) {
        var me = this;
        if (!Ext.isEmpty(newValue) && newValue.length > 0) {
            me.getTrigger('clear').show();
        } else {
            me.getTrigger('clear').hide();
        }
        me.updateLayout();
        this.callParent(arguments);
    }
});
