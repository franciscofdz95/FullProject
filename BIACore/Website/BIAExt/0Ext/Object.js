if (Ext.versions.extjs.major >= 4) {
    Ext.override(Ext.Object, {
        compare: function (o1, o2) {
            //can't use json encoding in case objects contain functions - recursion will fail

            //can't compare non-objects
            if (!(Ext.isObject(o1) && Ext.isObject(o2))) return false;

            var isEqual = function isEqual(a, b) {
                for (var p in a) {
                    var av = a[p], bv = b[p];
                    //recursion
                    if (Ext.isObject(av) || Ext.isObject(bv)) {
                        if (Ext.Object.compare(av, bv) !== true) {
                            return false;
                        }
                    } else { //simple comparisons
                        if (a[p] !== b[p]) {
                            return false;
                        }
                    }
                }
                return true;
            }

            if (isEqual(o1, o2) !== true) return false;
            if (isEqual(o2, o1) !== true) return false;

            return true;
        }
    });
}