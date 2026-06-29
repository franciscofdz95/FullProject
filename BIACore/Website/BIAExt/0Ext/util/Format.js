(function () {
    // fix a bug that is introduced in 4.2.1 and fixed in 4.2.2+

    // the problem is in the 'fnum' > 1000 section; fnum may not exist at that point.
    var version = Ext.getVersion() || {};
    if (version.major === 4 && version.minor === 2 && version.patch === 1) {
        var UtilFormat = Ext.util.Format,
            allHashes = /^#+$/,
            formatPattern = /[\d,\.#]+/,
            formatCleanRe = /[^\d\.#]/g,
            formatFns = {};
        Ext.apply(Ext.util.Format, {
            number: function (v, formatString) {
                if (!formatString) {
                    return v;
                }
                var formatFn = formatFns[formatString];

                // Generate formatting function to be cached and reused keyed by the format string.
                // This results in a 100% performance increase over analyzing the format string each invocation.
                if (!formatFn) {

                    var originalFormatString = formatString,
                        comma = UtilFormat.thousandSeparator,
                        decimalSeparator = UtilFormat.decimalSeparator,
                        hasComma,
                        splitFormat,
                        extraChars,
                        precision = 0,
                        trimTrailingZeroes,
                        code;

                    // The "/i" suffix allows caller to use a locale-specific formatting string.
                    // Clean the format string by removing all but numerals and the decimal separator.
                    // Then split the format string into pre and post decimal segments according to *what* the
                    // decimal separator is. If they are specifying "/i", they are using the local convention in the format string.
                    if (formatString.substr(formatString.length - 2) === '/i') {
                        if (!I18NFormatCleanRe) {
                            I18NFormatCleanRe = new RegExp('[^\\d\\' + UtilFormat.decimalSeparator + ']', 'g');
                        }
                        formatString = formatString.substr(0, formatString.length - 2);
                        hasComma = formatString.indexOf(comma) !== -1;
                        splitFormat = formatString.replace(I18NFormatCleanRe, '').split(decimalSeparator);
                    } else {
                        hasComma = formatString.indexOf(',') !== -1;
                        splitFormat = formatString.replace(formatCleanRe, '').split('.');
                    }
                    extraChars = formatString.replace(formatPattern, '');

                    if (splitFormat.length > 2) {
                        //<debug>
                        Ext.Error.raise({
                            sourceClass: "Ext.util.Format",
                            sourceMethod: "number",
                            value: v,
                            formatString: formatString,
                            msg: "Invalid number format, should have no more than 1 decimal"
                        });
                        //</debug>
                    } else if (splitFormat.length === 2) {
                        precision = splitFormat[1].length;

                        // Formatting ending in .##### means maximum 5 trailing significant digits
                        trimTrailingZeroes = allHashes.test(splitFormat[1]);
                    }

                    // The function we create is called immediately and returns a closure which has access to vars and some fixed values; RegExes and the format string.
                    code = [
                        'var utilFormat=Ext.util.Format,extNumber=Ext.Number,neg,fnum,parts' +
                            (hasComma ? ',thousandSeparator,thousands=[],j,n,i' : '') +
                            (extraChars ? ',formatString="' + formatString + '",formatPattern=/[\\d,\\.#]+/' : '') +
                            (trimTrailingZeroes ? ',trailingZeroes=/\\.?0+$/;' : ';') +
                        'return function(v){' +
                        'if(typeof v!=="number"&&isNaN(v=extNumber.from(v,NaN)))return"";' +
                        'neg=v<0;',
                        'fnum=Ext.Number.toFixed(Math.abs(v), ' + precision + ');'
                    ];

                    if (hasComma) {
                        // If we have to insert commas...

                        // split the string up into whole and decimal parts if there are decimals
                        if (precision) {
                            code[code.length] = 'parts=fnum.split(".");';
                            code[code.length] = 'fnum=parts[0];';
                        }
                        code[code.length] =
                            'if(fnum>=1000) {';
                        code[code.length] = 'thousandSeparator=utilFormat.thousandSeparator;' +
                        'thousands.length=0;' +
                        'j=fnum.length;' +
                        'n=fnum.length%3||3;' +
                        'for(i=0;i<j;i+=n){' +
                            'if(i!==0){' +
                                'n=3;' +
                            '}' +
                            'thousands[thousands.length]=fnum.substr(i,n);' +
                        '}' +
                        'fnum=thousands.join(thousandSeparator);' +
                    '}';
                        if (precision) {
                            code[code.length] = 'fnum += utilFormat.decimalSeparator+parts[1];';
                        }

                    } else if (precision) {
                        // If they are using a weird decimal separator, split and concat using it
                        code[code.length] = 'if(utilFormat.decimalSeparator!=="."){' +
                            'parts=fnum.split(".");' +
                            'fnum=parts[0]+utilFormat.decimalSeparator+parts[1];' +
                        '}';
                    }

                    if (trimTrailingZeroes) {
                        code[code.length] = 'fnum=fnum.replace(trailingZeroes,"");';
                    }

                    /*
                     * Edge case. If we have a very small negative number it will get rounded to 0,
                     * however the initial check at the top will still report as negative. Replace
                     * everything but 1-9 and check if the string is empty to determine a 0 value.
                     */
                    code[code.length] = 'if(neg&&fnum!=="' + (precision ? '0.' + Ext.String.repeat('0', precision) : '0') + '")fnum="-"+fnum;';

                    code[code.length] = 'return ';

                    // If there were extra characters around the formatting string, replace the format string part with the formatted number.
                    if (extraChars) {
                        code[code.length] = 'formatString.replace(formatPattern, fnum);';
                    } else {
                        code[code.length] = 'fnum;';
                    }
                    code[code.length] = '};';

                    formatFn = formatFns[originalFormatString] = Ext.functionFactory('Ext', code.join(''))(Ext);
                }
                return formatFn(v);
            }
        });
    }
}());