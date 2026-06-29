/**
 * @class Ext.ux.exporter.excelFormatter.Worksheet
 * @extends Object
 * Represents an Excel worksheet
 * @cfg {Ext.data.Store} store The store to use (required)
 */
Ext.define("Ext.ux.exporter.excelFormatter.Worksheet", {

    constructor: function (store, config) {
        config = config || {};

        this.store = store;

        Ext.applyIf(config, {
            hasTitle: true,
            hasHeadings: true,
            stripeRows: false,
            parserDiv: document.createElement("div"),
            title: "Workbook",
            columns: store.fields == undefined ? {} : store.fields.items
        });

        Ext.apply(this, config);

        Ext.ux.exporter.excelFormatter.Worksheet.superclass.constructor.apply(this, arguments);
    },

    /**
     * @property dateFormatString
     * @type String
     * String used to format dates (defaults to "Y-m-d"). All other data types are left unmolested
     */
    dateFormatString: "Y-m-d",    

    worksheetTpl: new Ext.XTemplate(
        '<ss:Worksheet ss:Name="{title}">',
        '<ss:Names>',
        '<ss:NamedRange ss:Name="Print_Titles" ss:RefersTo="=\'{title}\'!R1:R2" />',
        '</ss:Names>',
        '<ss:Table x:FullRows="1" x:FullColumns="1" ss:ExpandedColumnCount="{colCount}" ss:ExpandedRowCount="{rowCount + 1}">',
        '{columns}',
        '<ss:Row ss:Height="38">',
        '<ss:Cell ss:StyleID="title" ss:MergeAcross="{colCount - 1}">',
        '<ss:Data xmlns:html="http://www.w3.org/TR/REC-html40" ss:Type="String">',
        '<html:B><html:U><html:Font html:Size="15">{title}',
        '</html:Font></html:U></html:B></ss:Data><ss:NamedCell ss:Name="Print_Titles" />',
        '</ss:Cell>',
        '</ss:Row>',
        '{filterDisplay}',
        '<ss:Row AutoFitWidth="1">',
        '{header}',
        '</ss:Row>',
        '{rows}',
        '</ss:Table>',
        '<x:WorksheetOptions>',
        '<x:PageSetup>',
        '<x:Layout x:CenterHorizontal="1" x:Orientation="Landscape" />',
        '<x:Footer x:Data="Page &amp;P of &amp;N" x:Margin="0.5" />',
        '<x:PageMargins x:Top="0.5" x:Right="0.5" x:Left="0.5" x:Bottom="0.8" />',
        '</x:PageSetup>',
        '<x:FitToPage />',
        '<x:Print>',
        '<x:PrintErrors>Blank</x:PrintErrors>',
        '<x:FitWidth>1</x:FitWidth>',
        '<x:FitHeight>32767</x:FitHeight>',
        '<x:ValidPrinterInfo />',
        '<x:VerticalResolution>600</x:VerticalResolution>',
        '</x:Print>',
        '<x:Selected />',
        '<x:DoNotDisplayGridlines />',
        '<x:ProtectObjects>False</x:ProtectObjects>',
        '<x:ProtectScenarios>False</x:ProtectScenarios>',
        '</x:WorksheetOptions>',
        '</ss:Worksheet>'),

    /**
     * Builds the Worksheet XML
     * @param {Ext.data.Store} store The store to build from
     */
    render: function (store) {
        return this.worksheetTpl.apply({
            header: this.buildHeader(),
            filterDisplay: this.buildFilterDisplay(),
            columns: this.buildColumns().join(""),
            rows: this.buildRows().join(""),
            colCount: this.columns.length,
            rowCount: this.store.getCount() + 2,
            title: this.title
        });
    },

    buildColumns: function () {
        var cols = [];

        Ext.each(this.columns, function (column) {
            cols.push(this.buildColumn(column.exportWidth != null ? column.exportWidth : null));
        }, this);

        return cols;
    },

    buildColumn: function (width) {
        var usedWidth = Ext.isNumeric(width) && !Ext.isEmpty(width) ? (width > 409 ? 409 : width) : 164
        return Ext.String.format('<ss:Column' + ((Ext.isNumeric(width) && width != 0) ? ' ss:Width="{0}"' : ' ss:AutoFitWidth="1"') + ' />', usedWidth);
    },

    buildRows: function () {
        var rows = [];

        this.store.each(function (record, index) {
            rows.push(this.buildRow(record, index));
        }, this);

        return rows;
    },

    buildHeader: function () {
        var cells = [];

        Ext.each(this.columns, function (col) {
            var title;

            //if(col.dataIndex) {
            if (col.text != undefined) {
                title = col.text;
            } else if (col.name) {
                //make columns taken from Record fields (e.g. with a col.name) human-readable
                title = col.name.replace(/_/g, " ");
                title = Ext.String.capitalize(title);
            }

            cells.push(Ext.String.format('<ss:Cell ss:StyleID="headercell"><ss:Data ss:Type="String">{0}</ss:Data><ss:NamedCell ss:Name="Print_Titles" /></ss:Cell>', title));
            //}
        }, this);

        //return '<ss:Row' + (this.wrapColumnHeaders === false ? '' : ' AutoFitWidth="1" ') + '>' + cells.join("") + '</ss:Row>';
        return cells.join("");
    },

    buildFilterDisplay: function () {
        if (this.filterDisplay != null)
            return '<ss:Row ss:AutoFitHeight="1">' + Ext.String.format('<ss:Cell ss:StyleID="filterdisplaycell" ss:MergeAcross="{1}"><ss:Data ss:Type="String">Filtered by: {0}</ss:Data><ss:NamedCell ss:Name="Print_Titles" /></ss:Cell>', this.filterDisplay, this.columns.length - 1) + '</ss:Row>'
            //return Ext.String.format('<ss:Row ss:AutoFitHeight="1"><ss:Cell ss:StyleID="filterdisplaycell"><ss:Data ss:Type="String">{0}</ss:Data></ss:Cell></ss:Row>', this.filterDisplay);
        else return '';
    },

    buildRow: function (record, index) {
        var style,
        cells = [];
        if (this.stripeRows === true) style = index % 2 == 0 ? 'even' : 'odd';

        Ext.each(this.columns, function (col) {
            var name = col.name || col.dataIndex;

            if (name) {
                //if given a renderer via a ColumnModel, use it and ensure data type is set to String
                if (Ext.isFunction(col.renderer)) {
                    var value = record.get(name),
                        type = "String";

                    try {
                        value = col.renderer(record.get(name), {}, record);
                    }
                    catch (ex) { }

                    var values = [];
                    //to extract value if renderers returning html
                    this.parserDiv.innerHTML = value;
                    var divEls = this.parserDiv.getElementsByTagName('div');
                    if (divEls && divEls.length > 0) {
                        Ext.each(divEls, function (divEl) {
                            var innerValues = [];
                            var imgEls = divEl.getElementsByTagName('img');
                            Ext.each(imgEls, function (imgEl) {
                                innerValues.push(imgEl.getAttribute('title'));
                            });
                            innerValues.push(divEl.innerText || divEl.textContent);
                            values.push(innerValues.join(':'));
                        });
                    } else {
                        values.push(this.parserDiv.innerText || this.parserDiv.textContent);
                    }
                    value = values.join(' ');

                } else {
                    var value = record.get(name),
                        type = this.typeMappings[(col.type || (record.fieldsMap[name] || { type: 'string' }).type).toLowerCase()];
                }

                var matchingStyle = Ext.Array.findBy(this.styles,function (style) { return style.id == col.exportStyle; });
                var exportStyle = null;
                if (col.exportStyle != 'currency' && (matchingStyle || {}).customStyle !== true && Ext.isNumeric(record.get(name)) && !Ext.isEmpty(value) && (!String(value).match(/[^0-9,\-.$\u20ac\u00A3\xA5\u20bd]/g) && String(value).match(/[$\u20ac\u00A3\xA5\u20bd]/g) != null)) 
                    exportStyle = 'currency';
                else if (col.exportStyle != 'percent' && (matchingStyle || {}).customStyle !== true && Ext.isNumeric(record.get(name)) && !Ext.isEmpty(value) && (!String(value).match(/[^0-9,.\-%]/g) && String(value).match(/[%]/g) != null))
                    exportStyle = 'percent';

                cells.push(this.buildCell(((exportStyle || col.exportStyle) == 'string' || type == 'string') && Ext.isString(value) ? value.replace(/[~+$]/, '') : value,
                            type, style, exportStyle || col.exportStyle || null).render());
            }
        }, this);

        return Ext.String.format("<ss:Row>{0}</ss:Row>", cells.join(""));
    },

    buildCell: function (value, type, style, exportStyle) {
        if (exportStyle == null && type == "DateTime" && Ext.isObject(value) && Ext.isFunction(value.format)) value = value.format(this.dateFormatString);

        //var currencyRegex = new RegExp(/[0-9,/-\$\xA2\xA3\xA4\xA5\u058F\u060B\u09F2\u09F3\u09FB\u0AF1\u0BF9\u0E3F\u17DB\u20A0-\u20BD\uA838\uFDFC\uFE69\uFF04\uFFE0\uFFE1\uFFE5\uFFE6]/g)
        //if (exportStyle != 'currency' && !Ext.isEmpty(value) && !String(value).match(/[^0-9,\-.$\u20ac\u00A3\xA5\u20bd]/g)) exportStyle = 'currency'
        //else if (exportStyle != 'percent' && !Ext.isEmpty(value) && !String(value).match(/[^0-9,\-%]/g)) exportStyle = 'percent';

        if (exportStyle != null) exportStyle = exportStyle.toLowerCase();

        if (exportStyle == 'string') {
            type = 'String';
            exportStyle = null;
        } else {
            if (exportStyle == 'currency' || exportStyle == 'percent') {
                value = value.replace(/[^0-9\-.]/g, '');
                type = 'Number';
            }

            if (exportStyle == 'percent' && value != null && value.length > 0) {
                value = (value / 100).toFixed(16).toString();
            }

            //Possible check to include a value with parens to signify negatives
            //if (type != 'Number' && !value.replace(/[, ]/g, '').match(/^-?\(?-?\d*\.?\d*\)?$/g)) type = 'Number';
            //if (type != 'Number' && !Ext.isEmpty(value) && value.trim().match(/^-?-?\d*\.?\d*$/g)) type = 'Number';
            if (type != 'Number' && !Ext.isEmpty(value) && Ext.isString(value) &&
                //(!value.trim().match(/[\(\)]/g) || value.trim().match(/^-?\(.+\)?$/g)) && //Check if parenthesis are present and if they are in acceptable locations
                value.trim().replace(/[\(\)]/g, '').match(/^-?-?\d{1,3}(,?\d{3})*(\.?\d+)?\)?$/g)) { //Check if format of numbers and accepted characters (-,.) are present in logical places

                type = 'Number';
            }
        }

        if (type == 'Number' && Ext.isString(value)) value = value.trim();

        if (style && exportStyle) style = style + (Ext.isEmpty(style) ? '' : ' ' ) + exportStyle;

        return new Ext.ux.exporter.excelFormatter.Cell({
            value: Ext.String.htmlEncode(value),
            type: type,
            style: style || exportStyle || 'Default'
        });
    },

    /**
     * @property typeMappings
     * @type Object
     * Mappings from Ext.data.Record types to Excel types
     */
    typeMappings: {
        'int': "Number",
        'string': "String",
        'float': "Number",
        'date': "DateTime"
    }
});