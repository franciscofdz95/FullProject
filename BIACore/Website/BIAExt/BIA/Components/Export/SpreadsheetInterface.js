Ext.define('BIA.Components.Export.SpreadsheetInterface', {
    singleton: true,
    mixins: (Ext.versions.extjs.major > 4 ? ['Ext.mixin.Observable'] : []),

    MAX_FORMATTED_RECORDS: 5000,
    MAX_EXPORT_COLUMN_WIDTH: 400,
    MAX_BULK_RECORDS: 500000,
    DEFAULT_DATE_EXPORT_COLUMN_WIDTH: 40,
    columnDefinitions: {},
    defaultDataTypeFormats: {},
    defaultDataTypeFormatObj: {
        number: '#,##0.00',
        date: 'M/d/y',
        datetime: 'M/d/y hh:mm:ss tt',
        time: 'hh:mm:ss tt',
        currency: '$#,##0.00',
        percent: '##0%'
    },
    exportType: {
        excel: 1,
        csv: 2
    },
    isReady: false
}, function () {
    var me = this;
    /* Event Fire Functions */
    var ExportError = Ext.Function.bind(function ExportError(exportInfo) {

    }, this);
    var ExportSuccess = Ext.Function.bind(function ExportSuccess(exportInfo) {

    }, this);

    /* Filename Functions */
    var addLeadingZeros = Ext.Function.bind(function addLeadingZeros(dt) {
        return ('00' + dt).substr(-2);
    }, this);
    this.getFilenamePostString = function getFilenamePostString() {
        var now = new Date();
        return '_Export_' + now.getUTCFullYear() + addLeadingZeros(now.getUTCMonth()+1) + addLeadingZeros(now.getUTCDate()) +
            addLeadingZeros(now.getUTCHours()) + addLeadingZeros(now.getUTCMinutes()) + addLeadingZeros(now.getUTCSeconds());
    };
    this.getDefaultFilename = function getDefaultFilename() {
        return 'BIA_' + BIACore.Security.User.userId + this.getFilenamePostString();
    };

    /* Column Definition Functions */
    this.setColumnDefinitions = function setColumnDefinitions(id, visible, all) {
        this.columnDefinitions[id] = {
            visible: visible,
            all: all
        };  
    };
    this.getVisibleColumnDefinition = function getVisibleColumnDefinition(id) {
        return (this.columnDefinitions[id] || { visible: null }).visible;
    };
    this.getAllColumnDefinition = function getAllColumnDefinition(id) {
        return (this.columnDefinitions[id] || { all: null }).all;
    };

    /* DataType Format Functions */
    this.setDefaultDataTypeFormats = function setDefaultDataTypeFormats(id, formats) {
        if (Ext.isObject(formats) && !Ext.isEmpty(id)) {
            this.defaultDataTypeFormats[id] = Ext.apply(formats, this.defaultDataTypeFormatObj);
        }
    };

    /* Export Functions */
    var GetStoreSortArray = Ext.Function.bind(function GetStoreSortArray(store) {
        var sorts = [];
        if (store.sorters != null && store.sorters.length > 0) { 
            var storeSorts = store.sorters.items;
            for (i = 0; i < storeSorts.length; i++) {
                sorts.push({
                    property: storeSorts[i].getProperty(),
                    direction: storeSorts[i].getDirection()
                });
            }
        }

        return sorts;
    }, this);
    var GetStoreParams = Ext.Function.bind(function GetStoreParams(store, exportCount) {
        var params = {};
        var infoStore = new BIA.data.proxy.WebAPI({ api: { read: '' } });
        var totalCount = exportCount != null ? exportCount :
            store.totalCount != null && store.totalCount < this.MAX_FORMATTED_RECORDS ? store.totalCount : this.MAX_FORMATTED_RECORDS
        params = store.getProxy().extraParams;
        
        params[infoStore.startParam] = 0;
        params[infoStore.limitParam] = totalCount;
        params[infoStore.sortParam] = GetStoreSortArray(store);

        return params;
    }, this);

    var GetFormattedStore = Ext.Function.bind(function GetFormattedStore(store, exportCount) {
        var newStore = null;
        Ext.Ajax.request({
            url: store.getProxy().api.read,
            timeout: 300000,
            isUpload: true,
            jsonData: GetStoreParams(store, exportCount),
            async: false,
            scope: this,
            success: function GetFormattedDataAjaxSuccess(response, options) {
                var ret = Ext.JSON.decode(response.responseText);
                //if (Ext.getVersion().major <= 5) var ret = Ext.JSON.decode(response.responseText)
                //else var ret = response.responseJson;
                var rows = ret.data;

                newStore = new BIA.data.Store({
                    type: 'webapi',
                    api: {
                        read: store.getProxy().api.read
                    }
                });

                newStore.loadData(rows);

                //formattedData = Ext.Array.pluck(newStore.data.items, 'data');
            },
            failure: function GetFormattedDataAjaxSuccess(response, options) {
                newStore = ExportError();
            }
        });

        return newStore;
    }, this);

    var SetDefaultDataTypeRenderer = Ext.Function.bind(function SetDefaultDataTypeRenderer(column, dataTypeFormats) {
        switch (column.dataType.toLowerCase()) { //this should really be using a .toLowerCase() and the case expressions should be all lowercase.
            case 'number':
                return Ext.util.Format.numberRenderer(dataTypeFormats['number']);
                break;
            case 'date':
                return Ext.util.Format.dateRenderer(dataTypeFormats['date']);
                break;
            case 'datetime':
                return Ext.util.Format.dateRenderer(dataTypeFormats['datetime']);
                break;
            case 'time':
                return Ext.util.Format.dateRenderer(dataTypeFormats['time']);
                break;
            case 'currency':
                return function (value, metaData, record, rowIndex, colIndex, store, view) {
                    var format = dataTypeFormats['currency'];
                    var decimalPlaces = format.indexOf('.') > -1 ? format.length - (format.indexOf('.') + 1) : 0;
                    var commaSeperator = format.indexOf(',') > -1;
                    var currencySign = format.replace('.', '').replace(',', '').replace('0', '').replace('#','');
                    return Ext.util.Format(value, currencySign, decimalPlaces);
                };
                break;
            case 'percent':
                return function (value, metaData, record, rowIndex, colIndex, store, view) {
                    return Ext.util.Format(value,dataTypeFormats['percent']);
                }
                break;
            default:
                return function (value, metaData, record, rowIndex, colIndex, store, view) {
                    return value.toString();
                }
                break;
        }
        /*
        function (value, metaData, record, rowIndex, colIndex, store, view) {
            return value.toString();
        }
        {
        number: '0,000.00',
        date: 'Y/m/d',
        datetime: 'Y/m/d h:i:s A',
        time: 'h:i:s A',
        currency: '$0,000.00',
        percent: '000%'
    }
        */
    }, this);

    var SetDataTypeRendererFunctions = Ext.Function.bind(function SetDataTypeRendererFunctions(columns, dataTypeFormats) {
        for (i = 0; i < columns.length; i++) {
            if (columns[i].renderer == null) {
                if (columns[i].dataType == null) {
                    columns[i].renderer = function (value, metaData, record, rowIndex, colIndex, store, view) {
                        return value.toString();
                    }
                }
                else {
                    columns[i].renderer = SetDefaultDataTypeRenderer(columns[i], dataTypeFormats);
                }
            }
        }
    }, this);

    var ConvertPixelToPointSize = Ext.Function.bind(function ConvertPixelToPointSize(px) {
        return Ext.isNumeric(px) ? (px * 72) / 96 : 0;
    }, this);

    var ConvertPointToPixelSize = Ext.Function.bind(function ConvertPointToPixelSize(pt) {
        //return Ext.isNumeric(pt) ? (pt * 96) / 50 : 0;
        return Ext.isNumeric(pt) ? pt * 6 : 0;
    }, this);

    var StripInvalidCharactersFromString = Ext.Function.bind(function StripInvalidCharactersFromString(title) {
        var regex = new RegExp('[^A-Za-z0-9_\s.]', 'g');
        return title != null ? title.replace(regex, '') : null;
    }, this);

    var GetMimetypeForFilename = Ext.Function.bind(function GetMimetypeForFilename(filename) {

    }, this);

    var GenerateCustomExcelStyles = Ext.Function.bind(function GenerateCustomExcelStyles(customStyles) {
        if (!Ext.isArray(customStyles) && Ext.isObject(customStyles)) customStyles = [customStyles];
        else if (!Ext.isArray(customStyles)) return [];

        var styles = []

        for (var i = 0; i < customStyles.length; i++) {
            try {
                styles.push(new Ext.ux.exporter.excelFormatter.Style(customStyles[i] || {}));
            }
            catch (e) {
                Ext.log({ dump: { error: e, customStyle: customStyles[i] }, message: 'Error creating custom Excel style.' });
            }
        }

        return styles;
    }, this);

    var SetColumnExportWidth = Ext.Function.bind(function SetColumnExportWidth(columns, store) {
        for (i = 0; i < columns.length; i++) {
            if (columns[i].exportWidth == null) {
                if (columns[i].width != null) columns[i].exportWidth = columns[i].width;
                else {
                    columns[i].exportWidth = 0;
                    var storeColumnValues = Ext.Array.pluck(Ext.Array.pluck(store.data.items, 'data'), columns[i].dataIndex);
                    if (storeColumnValues.length > 0) {
                        if ((Ext.isNumeric(storeColumnValues[0]) && Ext.isNumeric(storeColumnValues[storeColumnValues.length - 1])) ||
                            (Ext.isString(storeColumnValues[0]) && Ext.isString(storeColumnValues[storeColumnValues.length - 1]))) {

                            for (c = 0; c < storeColumnValues.length; c++) {
                                var currentValueWidth = Ext.isEmpty(storeColumnValues[c]) ? 0 : (storeColumnValues[c].toString().length > this.MAX_EXPORT_COLUMN_WIDTH ? this.MAX_EXPORT_COLUMN_WIDTH : storeColumnValues[c].toString().length);
                                if (currentValueWidth > columns[i].exportWidth) columns[i].exportWidth = currentValueWidth;
                            }
                        }
                        else if (Ext.isDate(storeColumnValues[0]) && Ext.isDate(storeColumnValues[storeColumnValues.length - 1])) {
                            if (this.DEFAULT_DATE_EXPORT_COLUMN_WIDTH > columns[i].exportWidth) columns[i].exportWidth = this.DEFAULT_DATE_EXPORT_COLUMN_WIDTH;
                        }
                    }   
                    columns[i].exportWidth = ConvertPointToPixelSize(columns[i].exportWidth);
                }
            }
        }
    }, this);

    var KickoffBulkExport = Ext.Function.bind(function KickoffBulkExport(exportConfig) {//type, filename, store, columns, dataTypeFormats, columnDefinitionId, allColumns, exportCount, sheetTitle, filterDisplay) {
        if (exportConfig.columns == null && exportConfig.columnDefinitionId != null) {
            exportConfig.columns = exportConfig.allColumns ? this.columnDefinitions[exportConfig.columnDefinitionId].all : this.columnDefinitions[exportConfig.columnDefinitionId].visible;
        }

        if (exportConfig.columns == null) {
            return { Error: true, Message: 'No valid column list available' };
        }

        if (exportConfig.dataTypeFormats == null && exportConfig.columnDefinitionId != null) {
            exportConfig.dataTypeFormats = this.defaultDataTypeFormats[exportConfig.columnDefinitionId];
        }

        //Build post form values for form post and submit to SpreadsheetBulkExport.aspx
        var url = 'Spreadsheet.aspx';
        var name = 'SpreadsheetExporter';
        var params = {};
        var storeExtraParamsLimit = exportConfig.exportCount != null ? exportConfig.exportCount : (exportConfig.store.totalCount != null ? exportConfig.store.totalCount : 500000);
        if (storeExtraParamsLimit > this.MAX_BULK_RECORDS) storeExtraParamsLimit = this.MAX_BULK_RECORDS;

        var appUrlBase = BIACore.Config.server + window.location.pathname;
        appUrlBase = appUrlBase.substring(0, appUrlBase.lastIndexOf('/') + 1);

        params.type = Ext.Object.getKeys(this.exportType)[Ext.Object.getValues(this.exportType).indexOf(exportConfig.type)];
        params.filename = StripInvalidCharactersFromString(exportConfig.filename);
        params.sheetTitle = StripInvalidCharactersFromString(exportConfig.sheetTitle);
        params.appUrlBase = appUrlBase;
        params.storeUrl = exportConfig.store.getProxy().api.read;
        params.storeExtraParams = Ext.JSON.encode(Ext.apply(exportConfig.store.getProxy().extraParams, { start: 0, limit: storeExtraParamsLimit }));
        params.filterDisplay = StripInvalidCharactersFromString(exportConfig.filterDisplay)
        params.columns = [];

        for (i = 0; i < exportConfig.columns.length; i++) {
            params.columns.push({
                dataIndex: exportConfig.columns[i].dataIndex,
                text: exportConfig.columns[i].text,
                hidden: exportConfig.columns[i].hidden,
                dataType: exportConfig.columns[i].dataType
            });
        }

        //params.columns = Ext.JSON.encode(params.columns.filter(function (col) { return col.hidden === false; }));
        params.columns = Ext.JSON.encode(params.columns);
        params.dataTypeFormats = Ext.JSON.encode(exportConfig.dataTypeFormats);

        var form = document.createElement("form");
        form.setAttribute("method", "post");
        form.setAttribute("action", url);
        form.setAttribute("target", "_blank");


        for (var i in params) {
            if (params.hasOwnProperty(i)) {
                var input = document.createElement('input');
                input.type = 'hidden';
                input.name = i;
                input.value = params[i];
                form.appendChild(input);
            }
        }

        document.body.appendChild(form);

        //note I am using a post.htm page since I did not want to make double request to the page 
        //it might have some Page_Load call which might screw things up.
        //window.open("post.htm", name);

        form.submit();

        Ext.defer(function () { document.body.removeChild(form); }, 100, this);
    }, this);

    var KickoffFormattedExport = Ext.Function.bind(function KickoffFormattedExport(exportConfig) {//type, filename, store, columns, exportCount, dataTypeFormats, columnDefinitionId, allColumns, sheetTitle, filterDisplay, wrapHeaderText) {
        if (exportConfig.columns == null && exportConfig.columnDefinitionId != null) {
            exportConfig.columns = exportConfig.allColumns ? this.columnDefinitions[exportConfig.columnDefinitionId].all : this.columnDefinitions[exportConfig.columnDefinitionId].visible;
        }

        if (exportConfig.columns == null) {
            return { Error: true, Message: 'No valid column list available' };
        }

        if (exportConfig.dataTypeFormats == null && exportConfig.columnDefinitionId != null) {
            exportConfig.dataTypeFormats = this.defaultDataTypeFormats[exportConfig.columnDefinitionId];
        }

        SetDataTypeRendererFunctions(exportConfig.columns, exportConfig.dataTypeFormats);
        SetColumnExportWidth(exportConfig.columns, exportConfig.store);

        if (!Ext.isEmpty(exportConfig.customExcelStyles) && Ext.isArray(exportConfig.customExcelStyles)) {
            exportConfig.customExcelStyles.forEach(function (style) {
                style.customStyle = true;
            });
        }

        var newStore = GetFormattedStore(exportConfig.store, exportConfig.exportCount);
        var link = document.createElement('a');

        try {
            BIACore.Logger.Export(Ext.Object.getKey(this.exportType, exportConfig.type).toString(), newStore.api.read, Ext.JSON.encode(exportConfig.store.getProxy().extraParams), exportConfig.exportCount, exportConfig.columns.length);

            formatter = exportConfig.type == this.exportType.excel
                            ? Ext.create('Ext.ux.exporter.excelFormatter.ExcelFormatter')
                            : Ext.create('Ext.ux.exporter.csvFormatter.CsvFormatter');
            excelFile = formatter.format(newStore, {
                //columns: exportConfig.columns.filter(function (col) { return col.hidden === false; }),
                columns: exportConfig.columns,
                title: StripInvalidCharactersFromString(exportConfig.sheetTitle),
                filterDisplay: exportConfig.filterDisplay,
                wrapColumnHeaders: exportConfig.wrapHeaderText === false ? false : true,
                styles: exportConfig.type == this.exportType.excel && !Ext.isEmpty(exportConfig.customExcelStyles)
                    ? GenerateCustomExcelStyles(exportConfig.customExcelStyles || [])
                    : []
            });
            Ext.ux.exporter.FileSaver.saveAs(excelFile, formatter.mimeType, formatter.charset, StripInvalidCharactersFromString(exportConfig.filename), link, false);
            link.click();
        }
        catch (e) {
            Ext.log({ dump: e });
            return false;
        }
        return true;
    }, this);

    this.ExportExcelFormatted = function ExportExcelFormatted(exportConfig) {//filename, store, columns, exportCount, dataTypeFormats, columnDefinitionId, allColumns, sheetTitle, filterDisplay, wrapHeaderText) {
        //return KickoffFormattedExport(this.exportType.excel, filename + '.xls', store, columns, exportCount, dataTypeFormats, columnDefinitionId, allColumns, sheetTitle, filterDisplay, wrapHeaderText);
        return KickoffFormattedExport(Ext.apply(exportConfig, { type: this.exportType.excel, filename: exportConfig.filename + '.xls' }));
    };
    this.ExportExcelBulk = function ExportExcelBulk(exportConfig) {//filename, store, columns, exportCount, dataTypeFormats, columnDefinitionId, allColumns, sheetTitle, filterDisplay, wrapHeaderText) {
        //return KickoffBulkExport(this.exportType.excel, filename + '.xlsx', store, columns, dataTypeFormats, columnDefinitionId, allColumns, exportCount, sheetTitle, filterDisplay);
        return KickoffBulkExport(Ext.apply(exportConfig, { type: this.exportType.excel, filename: exportConfig.filename + '.xlsx' }));
    };
    this.ExportCSVFormatted = function ExportCSVFormatted(exportConfig) {//filename, store, columns, exportCount, dataTypeFormats, columnDefinitionId, allColumns, sheetTitle, filterDisplay, wrapHeaderText) {
        //return KickoffFormattedExport(this.exportType.csv, filename + '.csv', store, columns, exportCount, dataTypeFormats, columnDefinitionId, allColumns, sheetTitle, filterDisplay, wrapHeaderText);
        return KickoffFormattedExport(Ext.apply(exportConfig, { type: this.exportType.csv, filename: exportConfig.filename + '.csv' }));
    };
    this.ExportCSVBulk = function ExportCSVBulk(exportConfig) {//filename, store, columns, exportCount, dataTypeFormats, columnDefinitionId, allColumns, sheetTitle, filterDisplay, wrapHeaderText) {
        //return KickoffBulkExport(this.exportType.csv, filename + '.csv', store, columns, dataTypeFormats, columnDefinitionId, allColumns, exportCount, sheetTitle, filterDisplay);
        return KickoffBulkExport(Ext.apply(exportConfig, { type: this.exportType.csv, filename: exportConfig.filename + '.csv' }));
    };

    this.isReady = true;
    //this.fireEvent('ready', this);
});