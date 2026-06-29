(function () {

    if (Ext.getVersion().major === 4) {
        /**
         * @private
         * Not doing this as a listeners: {} section in FilterContainer because we want
         * ComponentQuery support.
         * Listens to all direct children of this FilterContainer for the 'filterReady' event.
         */
        Ext.define('BIA.controller.FilterContainer', {
            extend: 'Ext.app.Controller',
            refs: [],

            init: function () {
                var me = this;
                me.control({
                    // this implies that we're listening to all children of a filterContainer.
                    'filterContainer > *': {
                        // currently only filterContainers can fire filterReady, therefore
                        // this means we're listening for nested filterContainers.
                        filterReady: me.FilterContainer_Ready
                    }
                });
            },

            /**
             * Method called when a direct descendant fires the filter ready event.
             * @param {Object} component the component that fired ready.
             */
            FilterContainer_Ready: function (component) {
                var container = component.ownerCt;

                // a child component has reported it is ready.
                container.filterPending.ready--;
                // decide if we are ready.
                if (container.filterPending.readyFire && container.filterPending.ready <= 0) {
                    container.fireEvent(container.filterEvents.ready, container);
                }
            }
        });
    }
}());
