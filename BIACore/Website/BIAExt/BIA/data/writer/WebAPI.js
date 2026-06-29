(function () {
    if (Ext.getVersion().major >= 5) {
        // drop silly extensions in ext5.
        Ext.define('BIA.data.writer.WebAPI', {
            extend: 'Ext.data.writer.Json',
            alias: 'writer.webapi',
            writeAllFields: true,
            allowSingle: false
        });
    } else {
        /**
         * The mappings necessary to go from ExtJS to WebAPI.
         * Really, we could just use a {@link Ext.data.writer.Json} writer here,
         * but there are some applications that may still be trying to send association
         * data back to the server.
         * 
         * This probably needs to be rethought before any extensive use is made.
         */
        Ext.define('BIA.data.writer.WebAPI', {
            extend: 'Ext.data.writer.Json',
            alias: 'writer.webapi',

            /**
             * @cfg {Boolean} [allowSingle=false]
             * Configure with false to ensure that records are always wrapped in an array, even if there is only 1 record being sent.
             */
            allowSingle: false,

            /**
             * @cfg {Boolean} [writeAssociated=true]
             * Configure with true to send record associations along with the data.
             * Used by trees and one-to-many or many-to-many relationships.
             */
            writeAssociated: true,

            /**
             * Formats the data for the given record before sending it to the server.
             * @param {Ext.data.Model} record the record to send to the server
             */
            getRecordData: function (record) {
                var me = this;

                var data = me.callParent(arguments);

                if (Ext.getVersion().major < 5) {
                    if (me.writeAssociated && record.associations.getCount() > 0) {
                        Ext.apply(data, record.getAssociatedData());
                    }
                }

                return data;
            }
        });
    }
}());
