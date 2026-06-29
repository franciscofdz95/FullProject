/**
 * The mappings necessary to go from WebAPI to ExtJS.
 *
 * An expected JSON object returned from WebAPI takes the form:
 * {
 *    metaData: {
 *       fields: [
 *          { name: "ROWNUMBER", type: "int" },
 *          { name: "id", type: "auto" },
 *          { name: "Region", type: "string" },
 *          { name: "Date", type: "date", dateFormat: "c" }
 *       ]
 *    },
 *    data: [
 *       { ROWNUMBER: 1, id: 'row_1', Region: 'Americas', Date: '2014-04-25T13:39:00.753' }
 *    ],
 *    total: 1,
 *    dataTotal: [],
 *    success: true
 * }
 */
Ext.define('BIA.data.reader.WebAPI', {
    extend: 'Ext.data.reader.Json',
    alias: 'reader.webapi',

    /**
     * @cfg {String} [idProperty='id']
     * The JSON property that will be mapped to Ext's 'id' field.
     */
    idProperty: 'id',

    /**
     * @cfg {String} [root='data']
     * The root JSON property for data returned from WebAPI.
     */
    root: 'data',
    // ext5 changed root to 'rootProperty' having this in ext4 shouldn't hurt anything.
    rootProperty: 'data',

    /**
     * @cfg {String} [metaProperty='metaData']
     * The root JSON property for the description of the objects in {@link #root}.
     */
    metaProperty: 'metaData',

    /**
     * @cfg {String} [totalProperty='total']
     * The root JSON property for the total number of rows in the dataset queried.
     * For example a paged data set would report this number that is larger than the number
     * of rows in {@link #root}.
     */
    totalProperty: 'total',

    /**
     * @cfg {String} [totalRowProperty='dataTotal']
     * The root JSON property for the 'total row', or a list of server-calculated summaries 
     * that go along with the values in {@link #root}.
     */
    totalRowProperty: 'dataTotal',

    /**
     * @cfg {String} [successProperty='success']
     * The root JSON property that indicates the WebAPI request returned successfully.
     */
    successProperty: 'success',

    buildExtractors: function () {
        var me = this;
        me.callParent(arguments);

        if (me.totalRowProperty) {
            me.getSummary = me.createAccessor(me.totalRowProperty);
        }
    },

    readRecords: function (data) {
        var me = this,
            resultSet = me.callOverridden(arguments),
            summary = [],
            summaryData = me.getSummary(data);

        if (summaryData) {
            summary = me.extractData(summaryData);
            Ext.each(summary, function (item) { item.isSummary = true; });
        }

        return Ext.apply(resultSet, {
            summary: summary
        });
    }
});
