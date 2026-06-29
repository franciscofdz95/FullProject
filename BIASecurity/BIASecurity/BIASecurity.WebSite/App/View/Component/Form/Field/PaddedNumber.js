Ext.define('App.View.Component.Form.Field.PaddedNumber', {
    extend: 'Ext.form.field.Number',
    alias: 'widget.App-View-Component-Form-Field-PaddedNumber',
    xtype: 'paddedNumberfield',

    /**
     * @cfg {Number} zeroPadding
     * Number of digits to pad
     * Defaults to 2
     */
    zeroPadding: 2,

    initComponent: function initComponent() {
        this.callParent();
    },

    /*
    * @private
    * Gets value from superclass
    * TODO: Need to convert anything here? Hmm
    */
    rawToValue: function rawToValue(rawValue) {
        var value = this.callParent([rawValue]);
        return value;
    },

    /**
    * @private
    * Gets raw value from superclass then append zero padding
    */
    valueToRaw: function valueToRaw(value) {
        value = this.callParent([value]);
        if (this.zeroPadding) {
            value = Ext.String.leftPad(value, this.zeroPadding, '0');
        }
        return value;
    },

    /**
    * @private
    * Gets submit value from superclass then removes zero padding
    */
    getSubmitValue: function getSubmitValue() {
        var value = this.callParent();
        if (this.zeroPadding && typeof (value) == 'string') {
            value = value.replace(/^0+/g, '');
        }
        return value;
    }
});