if (Ext.platformTags && Ext.platformTags.modern) {
    Ext.define('BIA.form.field.FormattedNumber', {
        extend: 'Ext.field.Number',
        alias: 'widget.BIA-form-field-FormattedNumber',
        xtype: 'formattednumberfield',
        componentCls: 'formattednumberfield',

        //Custom formatting Properties
        useCurrencySymbol: false,
        currencySymbol: '$',
        currencySymbolPos: 'left',
        useThousandSeparator: false,
        thousandSeparator: ',',
        usePercentSymbol: false,

        // override - Converts value to the raw string which is displayed so add our extra formatting
        valueToRaw: function (value) {
            value = this.callParent([value]);
            value = this.formatValue(value);
            return value;
        },

        // override - Used by Ext.form.field.Number to parse a value to a float so we need to remove our extra symbols
        parseValue: function (value) {
            value = this.removeFormat(value);
            value = this.callParent([value]);
            return value;
        },

        // Internal Custom Helper Functions
        getSelectionStart: function (el) {
            if (el.createTextRange) {
                var range = document.selection.createRange().duplicate();
                range.moveEnd('character', el.value.length);
                if (range.text == '') return el.value.length;
                return el.value.lastIndexOf(range.text);
            } else {
                return el.selectionStart;
            }
        },

        setSelectionStart: function (el, caretPos) {
            if (el.createTextRange) {
                var range = el.createTextRange();
                range.move('character', caretPos);
                range.select();
            } else {
                el.setSelectionRange(caretPos, caretPos);
            }
        },
        formatValue: function (value) {
            if (!Ext.isEmpty(value)) {
                if (this.decimalPrecision != null) {
                    value = Ext.Number.toFixed(parseFloat(value), this.decimalPrecision);
                }
                if (this.useThousandSeparator)
                    value = this.formatThousands(value);

                if (this.useCurrencySymbol)
                    value = this.formatCurrency(value);

                if (this.usePercentSymbol)
                    value = this.formatPercent(value);
            }

            return value;
        },
        removeFormat: function (value) {
            value = String(value).replace(new RegExp('[' + this.thousandSeparator + this.currencySymbol + '%]', 'g'), '');
            value = Ext.String.trim(value);

            return value;
        },
        formatThousands: function (value) {
            var parts = value.toString().split(this.decimalSeparator);
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, this.thousandSeparator);
            return parts.join(this.decimalSeparator);
        },
        formatCurrency: function (value) {
            return this.currencySymbolPos == 'right' ? value + ' ' + this.currencySymbol : this.currencySymbol + ' ' + value;
        },
        formatPercent: function (value) {
            return value + ' %';
        }
    });
}
else if (Ext.getVersion().major >= 4) {
    Ext.define('BIA.form.field.FormattedNumber', {
        extend: 'Ext.form.field.Number',
        alias: 'widget.BIA-form-field-FormattedNumber',
        xtype: 'formattednumberfield',
        componentCls: 'formattednumberfield',

        //Custom formatting Properties
        useCurrencySymbol: false,
        currencySymbol: '$',
        currencySymbolPos: 'left',
        useThousandSeparator: false,
        thousandSeparator: ',',
        usePercentSymbol: false,

        // override - Converts value to the raw string which is displayed so add our extra formatting
        valueToRaw: function (value) {
            value = this.callParent([value]);
            value = this.formatValue(value);
            return value;
        },

        // override - Used by Ext.form.field.Number to parse a value to a float so we need to remove our extra symbols
        parseValue: function (value) {
            value = this.removeFormat(value);
            value = this.callParent([value]);
            return value;
        },

        // override - Remove formatting of the raw value to prepare it for conversion and/or validation
        processRawValue: function (value) {
            value = this.removeFormat(value);
            return value;
        },

        // override - Remove formatting on focus so they are just editing the number
        onFocus: function (e) {
            var me = this;

            me.callParent(arguments);

            if (this.editable && !this.readOnly) {
                Ext.defer(function () {
                    var startPosition = me.getSelectionStart(me.inputEl.dom),
                        leftStr = me.getRawValue().substr(0, startPosition),
                        leftStrRaw = me.removeFormat(leftStr),
                        newPosition = startPosition + leftStrRaw.length - leftStr.length;

                    me.setRawValue(me.removeFormat(me.getRawValue()));
                    me.setSelectionStart(me.inputEl.dom, newPosition);
                }, 5);
            }
        },

        // Internal Custom Helper Functions
        getSelectionStart: function (el) {
            if (el.createTextRange) {
                var range = document.selection.createRange().duplicate();
                range.moveEnd('character', el.value.length);
                if (range.text == '') return el.value.length;
                return el.value.lastIndexOf(range.text);
            } else {
                return el.selectionStart;
            }
        },

        setSelectionStart: function (el, caretPos) {
            if (el.createTextRange) {
                var range = el.createTextRange();
                range.move('character', caretPos);
                range.select();
            } else {
                el.setSelectionRange(caretPos, caretPos);
            }
        },
        formatValue: function (value) {
            if (!Ext.isEmpty(value)) {
                if (this.decimalPrecision != null) {
                    value = Ext.Number.toFixed(parseFloat(value), this.decimalPrecision);
                }
                if (this.useThousandSeparator)
                    value = this.formatThousands(value);

                if (this.useCurrencySymbol)
                    value = this.formatCurrency(value);

                if (this.usePercentSymbol)
                    value = this.formatPercent(value);
            }

            return value;
        },
        removeFormat: function (value) {
            value = String(value).replace(new RegExp('[' + this.thousandSeparator + this.currencySymbol + '%]', 'g'), '');
            value = Ext.String.trim(value);

            return value;
        },
        formatThousands: function (value) {
            var parts = value.toString().split(this.decimalSeparator);
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, this.thousandSeparator);
            return parts.join(this.decimalSeparator);
        },
        formatCurrency: function (value) {
            return this.currencySymbolPos == 'right' ? value + ' ' + this.currencySymbol : this.currencySymbol + ' ' + value;
        },
        formatPercent: function (value) {
            return value + ' %';
        }
    });
}