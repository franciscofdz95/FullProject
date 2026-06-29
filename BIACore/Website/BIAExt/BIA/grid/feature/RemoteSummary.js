/**
 * The default Ext {@link Ext.grid.feature.Summary} grid feature doesn't really allow for remote summary calculation.
 * This is basically a mix of {@link Ext.grid.feature.Grouping} and {@link Ext.grid.feature.Summary}.
 * Requires Ext 4.2+
 *
 * ## Example Usage
 * Todo: Add Example
 */
Ext.define('BIA.grid.feature.RemoteSummary', {
    extend:(Ext.platformTags && Ext.platformTags.modern) ? 'Ext.grid.plugin.Summary' : 'Ext.grid.feature.Summary',
    alias: 'feature.remotesummary',

    remoteRoot: 'dataTotal',

    init: function () {
        var me = this;

        me.callParent(arguments);

        //// thank god for case sensitivity.
        //// the default 'init' process puts renderSummaryRow into the view footerFns.
        //// in order to make it leadable, I've given an emptyFn for the renderSummaryRow
        //// and we assign our renderer where we want it.
        //if (!me.dock) {
        //    // summaryFirst is no longer supported - too many issues with 'selected row is wrong'
        //    // and ext not knowing where in the grid it is.
        //    if (me.summaryFirst) {
        //        me.view.addHeaderFn(me.RenderSummaryRow);
        //    } else {
        //        me.view.addFooterFn(me.RenderSummaryRow);
        //    }
        //}

        if (Ext.getVersion().major >= 5) {
            // override view's default "getRow" operation for the case where summaryFirst = true
            // when that's the case and the grid is focused, the 'bufferedRenderer' plugin attempts to focus the
            // first row (us), but the view can't determine anything about the row because it can't "find" it.
            // so let's help it be found.
            Ext.override(me.view, {
                //        getRow: function (nodeInfo) {
                //            var fly = Ext.fly(nodeInfo);

                //            if (fly && fly.is("table.x-grid-item-summary")) {
                //                var rows = Ext.getDom(fly).tBodies[0].childNodes,
                //                    len = rows.length,
                //                    i;

                //                for (i = 0; i < len; ++i) {
                //                    if (Ext.fly(rows[i]).is("tr.x-grid-row-summary")) {
                //                        return rows[i];
                //                    }
                //                }
                //            }

                //            return this.callOverridden(arguments);
                //        },
                getMaxContentWidth: function (header) {
                    var result = this.callOverridden(arguments);
                    if (me.dock) {
                        // cribbed from Ext.view.Table.getMaxContentWidth
                        // we're including the summary bar (docked) in the autoSize width calculation.
                        var el = me.summaryBar.el,
                            value = me.summaryRecord.get(header.dataIndex) || '',
                            width = (el) ? el.getTextWidth(value) + 20 : header.width;

                        // 20 is an arbitrary 'buffer'. not sure how to make this more official.
                        result = Math.max(result, width);
                    }
                    return result;
                }
            });

            //    if (me.summaryFirst) {
            //        // override view.NavigationModel's focus event 
            //        // when summaryFirst, it attempts to put a dotted box around
            //        // the cell above the actually-clicked row.
            //        Ext.override(me.view.navigationModel, {
            //            focusItem: function () { }
            //        });
            //    }
        }
    },

    makeSummaryRecord: function (store, id) {
        var record = (store && store.model) ? new store.model()
            : Ext.data.Model.create(),
            data = {}, field;

        record.beginEdit();

        for (field in record) {
            if (record.hasOwnProperty(field)) {
                if (field !== record.idProperty) {
                    record.set(field, data[field]);
                }
            }
        }
        record.endEdit(true);
        record.commit(true);
        record.isSummary = true;
        return record;
    },

    /**
     * @private
     * Returns the Model summary element for this grid.
     * Necessary because the {@link BIA.data.reader.WebAPI} reader doesn't add it as a special record.
     * @param {Ext.view.Table} view
     * @returns {Ext.data.Model} the summary record model
     */
    createSummaryRecord: function (view) {
        var me = this,
            store = view.store;

        if (store.summary && store.summary.length > 0) {
            me.summaryRecord = store.summary[0];
        } else {
            me.summaryRecord = me.makeSummaryRecord(store, view.id);
        }
        return me.summaryRecord;
    },

    // Ext 4.x
    renderTFoot: function (values, out) {
        var view = values.view,
            me = view.findFeature('remotesummary');

        if (me.showSummaryRow) {
            out.push('<tfoot>');
            me.outputSummaryRecord(me.createSummaryRecord(view), values, out);
            out.push('</tfoot>');
        }
    }

    //// Ext 5.x
    //renderSummaryRow: Ext.emptyFn,
    //RenderSummaryRow: function (values, out, parent) {
    //    var view = values.view,
    //        me = view.findFeature('remotesummary');

    //    if (me.showSummaryRow) {
    //        out.push('<table class="' + Ext.baseCSSPrefix + 'table-plain ' + me.summaryItemCls + '">');
    //        me.outputSummaryRecord(me.createSummaryRecord(view), values, out, parent);
    //        out.push('</table>');
    //    }
    //}
}, function (me) {
    if (Ext.getVersion().major < 5) { return; }

    Ext.override(me, {
        // Ext.grid.feature.AbstractSummary override.
        // I'm tired of having 2 different method styles for Summary and Regular rows.
        // since RemoteSummary implies a model, we can use record.isSummary to determine we're on the summary row.
        // This allows us to use the same rendering path as "normal" records would.
        createRenderer: function (column) {
            var renderer = column.summaryRenderer || column.renderer || Ext.emptyFn,
                scope = column.usingDefaultRenderer ? column : column.scope || this.view.ownerCt;
            return function (value, metaData, record, rowIndex, colIndex, store, view) {
                return (renderer != undefined && renderer != Ext.emptyFn) ? renderer.call(scope, value, metaData, record, rowIndex, colIndex, store, view) :
                    value;
            };
        },

        outputSummaryRecord: function (summaryRecord, contextValues, out) {
            var view = contextValues.view,
                savedRowValues = view.rowValues,
                columns = contextValues.columns || view.headerCt.getVisibleGridColumns(),
                colCount = columns.length, i, column,
                // Set up a row rendering values object so that we can call the rowTpl directly to inject
                // the markup of a grid row into the output stream.
                values = {
                    view: view,
                    record: summaryRecord,
                    rowStyle: '',
                    rowClasses: [this.summaryRowCls],
                    itemClasses: [],
                    recordIndex: -1,
                    rowId: view.getRowId(summaryRecord),
                    columns: columns
                };

            // Because we are using the regular row rendering pathway, temporarily swap out the renderer for the summaryRenderer
            for (i = 0; i < colCount; i++) {
                column = columns[i];
                column.savedRenderer = column.renderer;

                column.renderer = this.createRenderer(column, summaryRecord);
            }

            // Use the base template to render a summary row
            view.rowValues = values;
            view.self.prototype.rowTpl.applyOut(values, out, parent);
            view.rowValues = savedRowValues;

            // Restore regular column renderers
            for (i = 0; i < colCount; i++) {
                column = columns[i];
                column.renderer = column.savedRenderer;
                column.savedRenderer = null;
            }
        }
    });
});