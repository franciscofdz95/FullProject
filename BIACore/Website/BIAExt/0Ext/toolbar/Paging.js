(function () {
    // works on both ext 4 and 5.
    var version = Ext.getVersion().major;

    if (version == 4 || version == 5) {
        var format = Ext.util.Format;

        Ext.override(Ext.toolbar.Paging, {
            // override afterTextItem to add commas if and only if the pageCount would require it.
            onLoad: function () {
                var me = this;
                me.callOverridden(arguments);

                if (me.store.getCount() !== 0) {
                    var pageData = me.getPageData(),
                        currPage = pageData.currentPage,
                        pageCount = pageData.pageCount;

                    if (!isNaN(pageCount) && pageCount >= 1000) {
                        me.child('#afterTextItem').setText(
                            Ext.String.format(me.afterPageText, format.number(pageCount, '0,000'))
                        );
                    }
                }
            },
            // override the updateInfo display to add commas to the current and total number of records.
            updateInfo: function () {
                var me = this,
                    displayItem = me.child('#displayItem'),
                    store = me.store,
                    pageData = me.getPageData(),
                    count, msg;

                if (displayItem) {
                    count = store.getCount();
                    if (count === 0) {
                        msg = me.emptyMsg;
                    } else {
                        msg = Ext.String.format(
                            me.displayMsg,
                            format.number(pageData.fromRecord, '0,000'),
                            format.number(pageData.toRecord, '0,000'),
                            format.number(pageData.total, '0,000,000')
                        );
                    }
                    displayItem.setText(msg);
                }
            }
        });
    }
}());