(function () {
    if (Ext.getVersion().major < 5) {
        Ext.override(Ext.data.Operation, {
            getStart: function () { return this.start; },
            getLimit: function () { return this.limit; },
            getGrouper: function () { return this.groupers; },
            getFilters: function () { return this.filters; },
            getSorters: function () { return this.sorters; }
        });
    }
}());