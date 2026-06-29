Ext.define('BIA.Components.Export.Spreadsheet.ButtonContainer', {
    extend: (Ext.platformTags && Ext.platformTags.modern) ? 'Ext.Container' : 'Ext.container.Container',
    alias: 'widget.BIA-Components-Export-Spreadsheet-ButtonContainer',
    xtype: 'spreadsheetExportButtonContainer',

    layout: {
        type: 'hbox',
        align: 'middle',
        pack: 'center'
    },
    defaults: {
        margin: '0 5'
    },

    showExportPromptButton: true,

    quickExcelButton: null,
    quickCSVButton: null,
    /*
        True to allow default Quick Excel/CSV buttons
        
        OR

        Object of config options for Quick Excel/CSV Buttons
        {
            maxRecords: # [number of max records to export],
            lockExportType: 'Formatted/Bulk' [lock the export type to use formatted or bulk]
            text: '' [text to be displayed in quick button],
            //all other Ext.button.Button config options are available to allow for developer config of buttons.
            // **No way for the quick exports to be configured to do allColumns instead of default functionality of visible columns
        }
    */

    allowAllColumns: true,
    allowCSV: true,
    wrapHeaderText: true,

    columns: null,
    /*
        Array of column definition objects
        [
            {
                dataIndex: '' [db return column name] *required,
                text: '' [text label for column],
                hidden: true/false [if column should be shown or hidden],
                renderer: fn() [function to return display for column] --Formatted Export Only,
                exportRenderer: fn() [function to override view column renderer function] --Formatted Export Only + View Column Definition Only,
                exportStyle: '' [id of custom excel style to use],
                dataType: 'string/number/date/datetime/time/currency/percent' [datatype for default formatting. Overridden by render fn],
                type: 'int/string/float/date' [type of data in column used for formatting cell values] --Formatted Export Only
            }
        ]
    */

    //dataTypeNumberDefaultFormat: '#,000.00',
    //dataTypeDateDefaultFormat: 'YYYY/MM/DD',
    //dataTypeDateTimeDefaultFormat: 'YYYY/MM/DD HH:mm:SS AP',
    //dataTypeTimeDefaultFormat: 'HH:mm:SS AP',
    //dataTypeCurrencyDefaultFormat: '$#,000.00',
    //dataTypePercentDefaultFormat: '#00%',
    /*
        String format for default formatting for dataType of column definitions
    */

    customExcelStyles: [],
    /*
        Array of Ext.ux.exporter.excelFormatter.Style config objects.
        ** The id must be provided and exportStyle property on the column must be set to match the id (case sensitive).

        Example style config object:
        {
            id: '',
            attributes: [
                {
                    name: 'Font',
                    properties: [
                        { name: 'FontName', value: 'arial' },
                        { name: 'Size', value: '10' },
                        { name: 'Bold', value: '1' },
                        { name: 'Italic', value: '1' },
                        { name: 'Underline', value: 'Single' },
                        { name: 'Color', value: '#000000' }
                    ]
                },
                {
                    name: 'Alignment',
                    properties: [
                        { name: 'Horizontal', value: 'Left/Right/Center' },
                        { name: 'Vertical', value: 'Top/Center/Bottom' },
                        { name: 'WrapText', value: '1' }
                    ]
                },
                {
                    name: 'Interior',
                    properties: [
                        { name: 'Color', value: '#000000' },
                        { name: 'Pattern', value: 'Solid' }
                    ]
                },
                {
                    name: 'Borders',
                    children: [
                        {
                            name: 'Border',
                            properties: [
                              { name: 'Position', value: 'Top/Right/Bottom/Left' },
                              { name: 'Color', value: '#000000' },
                              { name: 'Weight', value: '1/2/3' },
                              { name: 'LineStyle', value: 'Continuous' }
                            ]
                        }
                    ]
                },
                {
                    name: 'NumberFormat',
                    properties: [
                        { name: 'Format', value: '' },

                        //***** Numbers/Percentages/Currency *****
                        // 0 forces the display of a digit in is place
                        // # Displays a digit if it adds to the accuracy of the number (drops leading and trailing 0s)
                        // . Specifies the decimal point
                        // [color] The name of a color can be inserted between the square brackets to define the font color
                        // You can provide up to 3 different formats that are applied at different times, seperated by semi-colon:
                        //  1 provided = Applies to all numbers

                        { name: 'Format', value: '[red]#,##0.00' },

                        //  2 provided = 1st applies to all Positive Numbers and 0, 2nd applies to all Negative Numbers

                        { name: 'Format', value: '#,##0.00;[red](#,##0.00)' },

                        //  3 provided = 1st applies to all Positive Numbers, 2nd applies to all Negative Numbers, 3rd applies to all 0s
                        
                        { name: 'Format', value: '#,##0.00;[red](#,##0.00);""' },

                        //***** Dates & Times *****
                        // Day = d (1,12), dd (01,12), ddd (Mon,Tue), dddd (Monday,Tuesday)
                        // Month = m (1,12), mm (01,12), mmm (Jan,Dec), mmmm(January,December)
                        // Year = yy (99,08), yyyy (1999, 2008)
                        // Hour = h (1,12), hh (01,12)
                        // Minutes = m (1,55), mm (01,55)
                        // Seconds = s (1,45), ss (01,45)
                        // AM/PM = Add AM or PM for 12-hour clock
                    ]
                }
            ]
        }
    */

    exportFilename: null,
    /*
        String to specify name of export file.
        OR
        Function to return string to specify name of export file.
    */

    exportFilenamePre: null,
    /*
        String to specify name of export file that gets default '_ExportYYYYMMDDHHMMSS' post text to title.
        OR
        Function to return string to specify name of export file that gets default '_ExportYYYYMMDDHHMMSS' post text to title.
    */

    parentViewSelector: null,
    parentChildViewSelector: null,
    /*
        Set parentViewSelector to look up from the button to the component with the store for export
        OR
        Set parentViewSelector to look up from the button to the parent component. Set parentChildViewSelector to look down from the parent component to the component
        with the store for export
    */

    maxAllowedRecords: BIA.Components.Export.SpreadsheetInterface.MAX_FORMATTED_RECORDS,
    /*
        Number to limit Formatted export up to SpreadsheetInterface's MAX_FORMATTED_RECORDS
    */

    exportTitle: null,
    useParentTabAsTitle: false,
    /*
        Set exportTitle for custom title of export file's worksheet
        OR
        Set useParentTabAsTitle to true to get the text from the first parent tab to use as title
    */

    showFilter: false,
    getFilterDisplay: function() {
        var filterDisplay = null;
        var reportContainer = this.up('[Filter]');
        if (reportContainer) {
            var filter = reportContainer.down('[GetFilterDisplay]');
            if (filter && filter.GetFilterDisplay) filterDisplay = filter.GetFilterDisplay();
        }

        return filterDisplay;
    },

    /*
        Set showFilter to true to allow for report filter display added to export.
        If your grid-filter relationship does not match the standard Report structure,
        override the getFilterDisplay function and write the logic to get and return the filter display string.
    */

    constructor: function () {
        this.superclass.constructor.apply(this, arguments);
        var me = this;

        /* Private Accessor Functions */
        var getColumnRendererFunction = Ext.Function.bind(function getColumnRendererFunction(column) {
            var matchingColumn = Ext.Array.findBy(Ext.isArray(this.columns) ? this.columns : (this.columns || { items: [] }).items, function (c) { return c.dataIndex == column.dataIndex; });
            if (matchingColumn && ((matchingColumn.exportRenderer && Ext.isFunction(matchingColumn.exportRenderer))
                || (matchingColumn.renderer && Ext.isFunction(matchingColumn.renderer)))) {
                if (matchingColumn.exportRenderer && Ext.isFunction(matchingColumn.exportRenderer)) return matchingColumn.exportRenderer;
                else return matchingColumn.renderer;
            }
            else {
                if (column.exportRenderer && Ext.isFunction(column.exportRenderer)) return column.exportRenderer;
                else if (column.renderer && Ext.isFunction(column.renderer)) return column.renderer;
                else return null;
            }
        }, this);
        var getColumnText = Ext.Function.bind(function getColumnText(column) {
            var matchingColumn = Ext.Array.findBy(Ext.isArray(this.columns) ? this.columns : (this.columns || { items: [] }).items, function (c) { return c.dataIndex == column.dataIndex; });
            if (matchingColumn && !Ext.isEmpty(matchingColumn.text)) {
                return matchingColumn.text.replace(/\<[^\>]+\>/g, ' ').replace(/  +/g, ' '); //1. Replace all xml/html tags with a space.  2. Replace multiple spaces with single space
            }
            else {
                if (!Ext.isEmpty(column.text)) return column.text.toString().replace(/\<[^\>]+\>/g, ' ').replace(/  +/g, ' '); //1. Replace all xml/html tags with a space.  2. Replace multiple spaces with single space
                else BIACore.Config.environment == 'DEV' ? viewColumn.dataIndex : 'Column' + i
            }
        }, this);
        var getColumnDefinition = Ext.Function.bind(function getColumnDefinition(viewColumn) {
            return Ext.isEmpty(viewColumn.dataIndex) || (Ext.isFunction(viewColumn.isXType) && viewColumn.isXType('actioncolumn')) || viewColumn.ignoreExport === true ? null : { 
                dataIndex: viewColumn.dataIndex,
                text: (viewColumn.ownerCt && !Ext.isEmpty(viewColumn.ownerCt.text) ? viewColumn.ownerCt.text + ' - ' : '') + getColumnText(viewColumn),
                //text: (viewColumn.ownerCt && !Ext.isEmpty(viewColumn.ownerCt.text) ? viewColumn.ownerCt.text + ' - ' : '') +
                //        viewColumn.text || (BIACore.Config.environment == 'DEV' ? viewColumn.dataIndex : 'Column' + i),
                hidden: (viewColumn.isHidden ? viewColumn.isHidden() : viewColumn.hidden),
                //renderer: viewColumn.exportRenderer ? viewColumn.exportRenderer : (viewColumn.renderer ? viewColumn.renderer : null),
                renderer: getColumnRendererFunction(viewColumn),
                dataType: viewColumn.dataType || null,
                type: viewColumn.type || null,
                format: viewColumn.format || null,
                exportStyle: viewColumn.exportStyle || (viewColumn.dataType || null),
                exportWidth: viewColumn.exportWidth || null
            };
        }, this);
        var getColumnsInView = Ext.Function.bind(function getColumnsInView(view) {
            var columnsInView;
            try {
                columnsInView = view.getColumns();
            }
            catch (ex) { }
            if (columnsInView == null) columnsInView = view.columns;

            return columnsInView;
        }, this);
        var getViewVisibleColumns = Ext.Function.bind(function getViewVisibleColumns() {
            var columns = [];
            var view = this.getExportViewComponent();
            if (view) {
                var columnsInView = getColumnsInView(view);
                if (columnsInView) {
                    var vColumns = (columnsInView.items != null && Ext.isArray(columnsInView.items) ? columnsInView.items : columnsInView);
                    var viewColumns = vColumns.filter(function (col) {
                        return (col.xtype == null || (col.xtype != null && col.dataIndex != null)) && !(col.isHidden ? col.isHidden() : col.hidden);
                    });
                    for (i = 0; i < viewColumns.length; i++) {
                        columns.push(getColumnDefinition(viewColumns[i]));
                        if(Ext.isObject(columns[i])) columns[i].hidden = columns[i].hidden == null ? false : columns[i].hidden;
                    }
                }
            }

            return columns.length > 0 ? Ext.Array.clean(columns) : null;
        }, this);
        var getViewAllColumns = Ext.Function.bind(function getViewAllColumns() {
            var columns = [];
            var view = this.getExportViewComponent();
            if (view) {
                var columnsInView = getColumnsInView(view);
                if (columnsInView) {
                    var vColumns = (columnsInView.items != null && Ext.isArray(columnsInView.items) ? columnsInView.items : columnsInView);
                    var viewColumns = vColumns.filter(function (col) {
                        return (col.xtype == null || (col.xtype != null && col.dataIndex != null));
                    });
                    for (i = 0; i < viewColumns.length; i++) {
                        columns.push(getColumnDefinition(viewColumns[i]));
                    }
                }
            }

            return columns.length > 0 ? Ext.Array.clean(columns) : null;
        }, this);
        var getColumnHiddenValue = Ext.Function.bind(function getColumnHiddenValue(col, defaultReturn) {
            if (Ext.isFunction(col.isHidden)) return col.isHidden();
            else if (!Ext.isEmpty(col.hidden)) return col.hidden;
            else return defaultReturn;
        }, this);
        var getButtonColumns = Ext.Function.bind(function getButtonColumns() {
            var columns = [];
            var viewColumns = getViewAllColumns();
            if (this.columns != null) {                
                for (i = 0; i < this.columns.length; i++) {
                    var matchingViewColumn = viewColumns.filter(function (col) { return col.dataIndex == this.columns[i].dataIndex && col.renderer != null; }, this)[i] || {};
                    columns.push({
                        dataIndex: this.columns[i].dataIndex,
                        text: this.columns[i].text || (matchingViewColumn.text || (BIACore.Config.environment == 'DEV' ? this.columns[i].dataIndex : 'Column' + i)),
                        hidden: getColumnHiddenValue(this.columns[i], null) != null ? getColumnHiddenValue(this.columns[i], null) : getColumnHiddenValue(matchingViewColumn,true),
                        renderer: this.columns[i].renderer ? this.columns[i].renderer : (matchingViewColumn != null ? matchingViewColumn.renderer : null),
                        dataType: this.columns[i].dataType || (matchingViewColumn.dataType || null),
                        type: this.columns[i].type || (matchingViewColumn.type || null),
                        format: this.columns[i].format || (matchingViewColumn.format || null),
                        exportStyle: this.columns[i].exportStyle || (this.columns[i].dataType || (matchingViewColumn.exportStyle || (matchingViewColumn.dataType || null))),
                        exportWidth: this.columns[i].exportWidth || (matchingViewColumn.exportWidth || null)
                    });
                }
            }

            return columns.length > 0 ? columns : null;
        }, this);
        var getViewStoreColumns = Ext.Function.bind(function getViewStoreColumns() {
            var columns = [];
            var view = this.getExportViewComponent();
            if (view != null && view.store && view.store.proxy && view.store.proxy.reader && view.store.proxy.reader.metaData && view.store.proxy.reader.metaData.fields) {
                var fields = view.store.proxy.reader.metaData.fields;
                for (i = 0; i < fields.length; i++) {
                    columns.push({
                        dataIndex: fields[i].name,
                        dataType: fields[i].type == 'auto' ? 'string' :
                                    fields[i].type == 'date' ? 'datetime' :
                                    fields[i].type == 'int' || fields[i].type == 'float' ? 'number' : 'string',
                        text: BIACore.Config.environment == 'DEV' ? fields[i].name : 'Column' + i
                    });
                }
            }
            return columns.length > 0 ? columns : null;
        }, this);

        /* Accessor Functions */
        this.getExportViewComponent = function getExportViewComponent() {
            var exportView = null;
            if (this.parentViewSelector != null) {
                var parentExportView = this.up(this.parentViewSelector);
                if (parentExportView != null) {
                    if (this.parentChildViewSelector != null) {
                        var parentChildExportView = parentExportView.down(this.parentChildViewSelector);
                        if (parentChildExportView != null && parentChildExportView.store != null) exportView = parentChildExportView;
                    }
                    else if (parentExportView.store != null) exportView = parentExportView;
                }
            }
            else {
                var storeView = me.up('[store]');
                if (storeView != null) {
                    if (storeView.isXType('pagingtoolbar')) {
                        storeView = storeView.up('[store]');
                    }
                    exportView = storeView;
                }
            }

            return exportView
        };
        this.getExportViewComponentStore = function getExportViewComponentStore() {
            return (this.getExportViewComponent() || { store: null}).store;
        };
        this.getAllColumns = function getAllColumns() {
            var columns = getButtonColumns();
            if (columns == null || columns.length == 0) {
                columns = getViewAllColumns();
                if (columns == null || columns.length == 0) columns = getViewStoreColumns();
            }

            return columns != null && columns.length > 0 ? columns : null;
        };
        this.getVisibleColumns = function getVisibleColumns() {
            var columns = getViewVisibleColumns();
            if (columns == null || columns.length == 0) {
                columns = getButtonColumns();
                if (columns == null || columns.length == 0) columns = getViewStoreColumns();
            }

            return columns != null && columns.length > 0 ? columns : null;
        };
        this.getExportFileName = function getExportFileName() {
            var fileName = null;

            if (this.exportFilename != null) fileName = this.exportFilename;
            else if (this.exportFilenamePre != null) {
                if (Ext.isFunction(this.exportFilenamePre)) fileName = this.exportFilenamePre.call(this) + BIA.Components.Export.SpreadsheetInterface.getFilenamePostString();
                else fileName = this.exportFilenamePre + BIA.Components.Export.SpreadsheetInterface.getFilenamePostString();
            }
            else {
                var viewCmp = this.getExportViewComponent();
                if (viewCmp != null && !Ext.isEmpty(viewCmp.title)) {
                    fileName = viewCmp.title;
                }
                else {
                    fileName = BIA.Components.Export.SpreadsheetInterface.getDefaultFilename();
                }
            }

            return fileName;
        };
        this.getDataTypeDefaultFormats = function getDataTypeDefaultFormats() {
            return {
                number: this.dataTypeNumberDefaultFormat,
                date: this.dataTypeDateDefaultFormat,
                datetime: this.dataTypeDateTimeDefaultFormat,
                time: this.dataTypeTimeDefaultFormat,
                currency: this.dataTypeCurrencyDefaultFormat,
                percent: this.dataTypePercentDefaultFormat
            }
        };
        this.getMaxRecords = function getMaxRecords() {
            //var totalCount = null;
            //var view = this.getExportViewComponent();
            //if (view && view.store) {
            //    totalCount = view.store.totalCount > BIA.Components.Export.SpreadsheetInterface.MAX_FORMATTED_RECORDS 
            //        ? BIA.Components.Export.SpreadsheetInterface.MAX_FORMATTED_RECORDS
            //        : view.store.totalCount;
            //}
            //
            //return totalCount;
            return this.maxAllowedRecords <= BIA.Components.Export.SpreadsheetInterface.MAX_FORMATTED_RECORDS
                ? this.maxAllowedRecords
                : BIA.Components.Export.SpreadsheetInterface.MAX_FORMATTED_RECORDS;
        };
        this.getStoreRecordCounts = function getStoreRecordCounts() {
            var totalCount = BIA.Components.Export.SpreadsheetInterface.MAX_FORMATTED_RECORDS;
            var view = this.getExportViewComponent();
            if (view && view.store) totalCount = view.store.totalCount;
            return totalCount;
        };
        this.getVisibleButtons = function getVisibleButtons() {
            var buttonsToAdd = [];
            if (this.showExportPromptButton) buttonsToAdd.push({ xtype: 'BIA-Components-Export-Spreadsheet-PromptButton' });
            if (this.quickExcelButton != null) buttonsToAdd.push(Ext.apply(Ext.isObject(this.quickExcelButton) ? this.quickExcelButton : {},{ xtype: 'BIA-Components-Export-Spreadsheet-QuickExcelButton' }));
            if (this.quickCSVButton != null) buttonsToAdd.push(Ext.apply(Ext.isObject(this.quickCSVButton) ? this.quickCSVButton : {}, { xtype: 'BIA-Components-Export-Spreadsheet-QuickCSVButton' }));

            return buttonsToAdd;
        };

        this.allowExportAllShow = function allowExportAllShow() {
            return this.getStoreRecordCounts() > BIA.Components.Export.SpreadsheetInterface.MAX_FORMATTED_RECORDS;
        }

        this.getSheetTitle = function getSheetTitle() {
            var sheetTitle = 'Worksheet';
            var viewCmp = this.getExportViewComponent();

            if (this.exportTitle != null) {
                if (Ext.isFunction(this.exportTitle)) sheetTitle = this.exportTitle.call(this);
                else sheetTitle = this.exportTitle;
            }

            // TODO: This code needs to handle if the viewCmp.up('tabpanel') isn't a tab panel better!  M.Erdmann 2/21/2020
            if (!this.useParentTabAsTitle && sheetTitle == 'Worksheet') {
                sheetTitle = !Ext.isEmpty(viewCmp.title) ? viewCmp.title : (viewCmp ? sheetTitle = viewCmp.up('tabpanel').getActiveTab().title : 'Worksheet');
            }
            if (this.useParentTabAsTitle && sheetTitle == 'Worksheet') {
                if (viewCmp) sheetTitle = viewCmp.up('tabpanel').getActiveTab().title;
                else sheetTitle = viewCmp.title != null ? viewCmp.title : 'Worksheet';
            }
            if(sheetTitle == 'Worksheet') sheetTitle = !Ext.isEmpty(viewCmp.title) ? viewCmp.title : 'Worksheet';

            return sheetTitle != null ? sheetTitle : 'Worksheet';
        }
        //this.callParent(arguments);
    }
});