if (typeof Ext != 'undefined' && Ext.getVersion().major >= 5 && typeof Ext.chart != 'undefined') {
    Ext.define('Ext.chart.series.Pie', {
        override: 'Ext.chart.series.Pie',
        betweenAngle: function (x, a, b) {
            if (a === 0 && b > (Math.PI * 2 - 0.00000001)) {
                return true;
            } else {
                // Original function
                var pp = Math.PI * 2,
                    offset = this.rotationOffset;

                if (a === b) {
                    return false;
                }

                if (!this.getClockwise()) {
                    x *= -1;
                    a *= -1;
                    b *= -1;
                    a -= offset;
                    b -= offset;
                } else {
                    a += offset;
                    b += offset;
                }

                x -= a;
                b -= a;

                // Normalize, so that both x and b are in the [0,360) interval. 
                x %= pp;
                b %= pp;
                x += pp;
                b += pp;
                x %= pp;
                b %= pp;

                // Because 360 * n angles will be normalized to 0, 
                // we need to treat b === 0 as a special case. 
                return x < b || b === 0;
            }
        }
    });
}