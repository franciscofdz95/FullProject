(function () {
    var temp = Ext.Date.parse;
    Ext.Date.parse = function (input, format, strict) {
        return (input === '0001-01-01T00:00:00') ? null : temp(input, format, strict);
    };
}());