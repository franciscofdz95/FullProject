(function () {
    if (Ext.getVersion().major >= 5 && Ext.getVersion().major < 7 && typeof Ext != 'undefined' && typeof Ext.draw != 'undefined' && typeof Ext.draw.SegmentTree != 'undefined') {
        /**
 * This class we summarize the data and returns it when required.
 */
        Ext.override(Ext.draw.SegmentTree, {
            //This override is done because some first/last value combinations was causing the positions and minStep to be for an incorrect set and cause issues with 
            //line rendering and point displays for the charts
            /**
             * Returns the minimum range of data that fits the given range and step size.
             *
             * @param {Number} min
             * @param {Number} max
             * @param {Number} estStep
             * @return {Object} The aggregation information.
             * @return {Number} return.start
             * @return {Number} return.end
             * @return {Object} return.data The aggregated data
             */
            getAggregation: function (min, max, estStep) {
                if (!this.cache) {
                    return null;
                }
                var minStep = Infinity,
                    //range = this.dataX[this.dataX.length - 1] - this.dataX[0],
                    range = Math.abs(Ext.Array.max(this.dataX) - Ext.Array.min(this.dataX)),
                    cacheMap = this.cache.map,
                    result = cacheMap.original,
                    name, positions, ln, step, minIdx, maxIdx;
                for (name in cacheMap) {
                    positions = cacheMap[name];
                    ln = positions[1] - positions[0] - 1;
                    step = range / ln;
                    if (estStep <= step && step < minStep) {
                        result = positions;
                        minStep = step;
                    }
                }
                minIdx = Math.max(this.binarySearchMin(this.cache, result[0], result[1], min), result[0]);
                maxIdx = Math.min(this.binarySearchMax(this.cache, result[0], result[1], max) + 1, result[1]);
                return {
                    data: this.cache,
                    start: minIdx,
                    end: maxIdx
                };
            }
        });
    }
}());