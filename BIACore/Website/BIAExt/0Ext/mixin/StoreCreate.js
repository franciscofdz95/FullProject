if (Ext.getVersion().major >= 5) {
    Ext.define('BIA.mixin.StoreCreate', {
        extend: 'Ext.Mixin',
        mixinConfig: {
            on: {
                initComponent: 'initComponentUtil'
            }
        },

        initComponentUtil: function () {
            if (this.store) {
                //Ext.log({ dump: { id: this.id, store: this.store } });
                this.store = Ext.StoreMgr.lookup(this.store) || Ext.create(this.store);
                if (this.pageSize) this.store.setPageSize(this.pageSize);
            }
        }
    });
}