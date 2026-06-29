/* ====================================================================================================
NAME:			[Invoice Processing Grid Summary]
BEHAVIOR:		Shows Invoice  processing grid Summary
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/26/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.View.InvoiceProcessing.Grid', {
    extend: 'App.View.Component.Grid.Base',
    alias: 'widget.App-View-InvoiceProcessing-Grid',
    layout: 'fit',
    border: true,
    // Page size was defined  by Sriram Sundara  
    pageSize: 30,
    autoPageSize: false,
    addAPUT: false,
    scrollable: true,
    store: {
        type: 'webapi',
        api: {
            read: 'api/WebAPIReport/InvoiceProcessRpt'
        },
        pageSize: 30,
        sorters: [
            { property: 'location_code_orderer', direction: 'ASC' }
        ],
        autoLoad: false
    },
    rowData: '',
    tbar: [
        { xtype: 'App-View-InvoiceProcessing-TBar', width: '100%' }
    ],
    bbar: [{ xtype: 'App-View-VendorShipment-BBar', width: '100%' }],
    selType: 'rowmodel',
    plugins: [
        Ext.create('Ext.grid.plugin.RowEditing', {
            pluginId: 'InvEditor',
            clicksToEdit: 2
        })

    ],
    viewConfig: {
        enableTextSelection: true,
        deferEmptyText: false,
        emptyText: 'No Matches Found! Verify the selected filter criteria.'
    },
    columnLines: true,
    defaults: { menuDisabled: false, align: 'left', border: 1, sortable: true, autoColumnResize: true },
    cls: 'UBlue1',
    columns: [
        {
            xtype: 'checkcolumn',
            header: '*',
            sortable: false,
            dataIndex: 'frontCheck',
            listeners: {
                checkchange: function (column, rowIdx, checked, eOpts) {
                    var tabPanel = this.up('#tabPanelId');
                    var rec = this.up('grid').getStore().getAt(rowIdx);
                    var type = "item";
                    if (!rec.get('frontCheck')) {
                        rec.set('backCheck', false);
                    }
                    var chgcid = rec.get('buy_cid');
                    if (chgcid != '' && chgcid != rec.get('invoice_cid')) {
                        var rate = IProcessingSCls.GetInvoiceCurrency(rec);
                        rec.set('ConvRate', parseFloat(rate.ConvRate).toFixed(6));
                    } else {
                        rec.set('ConvRate', 1);
                    }
                    rec = IProcessingSCls.billProcessingMblFkValidation(rec, checked, this.up('grid'), tabPanel, type);
                    if (Ext.isDefined(rec) && !Ext.isEmpty(rec)) {
                        IProcessingSCls.OnFronCheckboxSelect(checked, rec);
                    }
                    this.up('grid').down('#InvoiceDetailsId').loadValues();
                    this.up('grid').getView().refresh();
                }
            },
            renderer: IProcessingSCls.invoiceProcessingCheckColRendered
        },
        {
            xtype: 'actioncolumn',
            hidden: false,
            text: '',
            minWidth: 100,
            sortable: false,
            items: [
                {
                    icon: 'images/info.png',
                    handler: function (view, rowIndex, colIndex, item, ev, record) {
                        var rec = '';
                        var invoiceId = 0;
                        var pageType = IProcessingSCls.getPageType();
                        if (pageType == 'LVB') {
                            rec = IProcessingSCls.getNewRecDetails();
                            invoiceId = rec.Invoice_id
                        } else {
                            rec = IProcessingSCls.getRecDetails();
                            invoiceId = rec.get("invoice_id");
                        }
                        if (record.get("invoice_id") != 0 && record.get("invoice_id") != invoiceId && record.get('newRecFlag') === undefined && record.get("AccrualFlag") === 0) {
                            if (record.get('rowtype') !== null) {
                                var win = Ext.widget('App-View-Bills-Detail-Report');
                                win.rec = record;
                                win.show();
                            }
                            record.dirty = false;
                            view.refresh();
                        }
                    }
                },
                {
                    icon: 'images/accrual.png',
                    handler: function (view, rowIndex, colIndex, item, ev, record) {
                        var rec = '';
                        var invoiceId = 0;
                        var pageType = IProcessingSCls.getPageType();
                        if (pageType == 'LVB') {
                            rec = IProcessingSCls.getNewRecDetails();
                            invoiceId = rec.Invoice_id
                        } else {
                            rec = IProcessingSCls.getRecDetails();
                            invoiceId = rec.get("invoice_id");
                        }
                        if (record.get("invoice_id") != 0 && record.get("invoice_id") != invoiceId && record.get('newRecFlag') === undefined && record.get("AccrualFlag") !== 0) {
                            if (record.get('rowtype') !== null) {
                                var win = Ext.widget('App-View-Bills-Detail-Report');
                                win.rec = record;
                                win.show();
                            }
                            record.dirty = false;
                            view.refresh();
                        }
                    }
                },
                {
                    icon: 'images/add-16x16.png',
                    tooltip: 'Split Payment',
                    handler: function (view, rowIndex, colIndex, item, ev, record) {
                        var rec = '';
                        var invoiceId = 0;
                        var pageType = IProcessingSCls.getPageType();
                        if (pageType == 'LVB') {
                            rec = IProcessingSCls.getNewRecDetails();
                            invoiceId = rec.Invoice_id
                        } else {
                            rec = IProcessingSCls.getRecDetails();
                            invoiceId = rec.get("invoice_id");
                        }
                        if (record.get("invoice_id") != 0 && record.get("invoice_id") != invoiceId && record.get('newRecFlag') === undefined && record.get('copied') === undefined && invoiceId !== 0) {
                            var grid = view.up(),
                                editor = grid.getPlugin('InvEditor');
                            var recordCopy = record.copy(null);
                            Ext.Object.merge(record.data, { copied: true });
                            Ext.Object.merge(recordCopy.data, { newRecFlag: true });
                            recordCopy.set('frontCheck', true);
                            var splitRemVal = IProcessingSCls.GetSplitRemainder(record);
                            recordCopy.set('sell_amt', 0);
                            recordCopy.set('buy_amt', splitRemVal.remainder);
                            grid.store.insert((rowIndex + 1), recordCopy);
                            view.refresh();
                            grid.getSelectionModel().select(rowIndex + 1);
                            editor.startEdit(recordCopy, 0);
                        }
                    }
                }
            ],
            renderer: function (value, metaData, record, row, col, store, gridView) {
                var me = this;
                return IProcessingSCls.invoiceProcessingColumnRenderSort(me, value, metaData, record, row, col, store, gridView);
            }
        },
        {
            text: 'Rcvd at date', dataIndex: 'rcvd_at_dt', renderer: BIA.util.Format.dateRenderer('m/d/Y')
        },
        {
            text: 'Loc <BR> Code', dataIndex: 'location_code', width: 20
        },
        {
            text: 'Vendor <BR> Carrier <BR> Code', itemId: 'colVendorCode', dataIndex: 'vendor_code', maxWidth: 80,
            renderer: function (value, metaData, record, row, col, store, gridView) {
                var me = this;
                return IProcessingSCls.invoiceProcessingColumnRenderSort(me, value, metaData, record, row, col, store, gridView);
            }
        },
        {
            text: 'MBL</BR>Number', itemId: 'colMblNumber', dataIndex: 'MBL_nbr', width: 20,
            renderer: function (value, metaData, record, row, col, store, gridView) {
                var me = this;
                return IProcessingSCls.invoiceProcessingColumnRenderSort(me, value, metaData, record, row, col, store, gridView);
            }
        },
        {
            text: 'CBOL', dataIndex: 'mbl_iata_busid', width: 20,
            renderer: function (value, metaData, record, row, col, store, gridView) {
                metaData.tdAttr = 'data-qtip="' + Ext.String.htmlEncode(value) + '"';
                return value;
            }
        },
        {
            text: 'Shipment</BR>Number',
            maxWidth: '100px',
            columns: [
                {
                    text: '', itemId: 'colShipNbrIP', dataIndex: 'shpmnt_nbr', cls: 'colColBlueBorderThin', width: 60,
                    renderer: function (value, metaData, record, row, col, store, gridView) {
                        var me = this;
                        metaData.tdAttr = 'data-qtip="' + Ext.String.htmlEncode(value) + '"';
                        metaData.style = "text-decoration: underline;cursor: pointer"; // All hyperlinks same font and color meaning same format.  Sriram
                        return IProcessingSCls.invoiceProcessingColumnRenderSort(me, '<a><span style="color:#1D598E;" >' + value + '</span></a>', metaData, record, row, col, store, gridView);
                    }
                },
                {
                    text: '', itemId: 'colShipNbrSortIP', dataIndex: 'shpmnt_nbr', cls: 'colColBlueBorderThin', width: 30, renderer: function (value, metaData, record, row, col, store, gridView) {
                        var me = this;
                        return IProcessingSCls.invoiceProcessingColumnRenderSort(me, value, metaData, record, row, col, store, gridView);
                    }
                }
            ]
        },
        {
            text: 'Charge</BR>Split', dataIndex: 'rev_split'
        },
        {
            xtype: 'widgetcolumn',
            text: 'VAT',
            width: 110,
            widget: {
                xtype: 'combobox',
                valueField: 'vat_code',
                displayField: 'displayVat',
                disabledItemCls: 'disabledListItem',
                editable: false,
                matchFieldWidth: false,
                disabledField: 'disabled1',
                border: 1,
                listConfig: {
                    loadingText: 'Searching...',
                    width: 'auto',
                    emptyText: 'No matching posts found.',
                    // Custom rendering template for each item
                    generateTpl: function () {
                        var me = this;
                        me.tpl = new Ext.XTemplate(
                            '<ul class="' + Ext.plainListCls + '"><tpl for=".">',
                            '<li role="option" unselectable="on" class="' + Ext.baseCSSPrefix + 'boundlist-item' + '<tpl if="' + me.pickerField.disabledField + '"> ' + me.pickerField.disabledItemCls + '</tpl>">' + me.getInnerTpl(me.displayField) + '</li>',
                            '</tpl></ul>');
                    }
                },
                listeners: {
                    'select': function (combo, records) {
                        var tabPanel = this.up('#tabPanelId');
                        var record = combo.getWidgetRecord();
                        var selDD = combo.getSelectedRecord();
                        var vatPer = selDD.get('vat_percent');
                        var vatAmt = 0
                        var chkFlag = false;
                        if (!record.get('frontCheck')) {
                            chkFlag = true;
                        }
                        record.set('frontCheck', true);
                        if (parseFloat(vatPer)) {
                            vatAmt = parseFloat(vatPer / 100);
                        }
                        if (selDD.get('invoicevat_id') != 0) { record.set('invoicevat_id', selDD.get('invoicevat_id')); }
                        record.set('invoicevat_amt', vatAmt);
                        record = IProcessingSCls.billProcessingMblFkValidation(record, chkFlag, this.up('grid'), tabPanel, "item");
                        this.up('grid').down('#InvoiceDetailsId').loadValues();
                        this.up('grid').getView().refresh();
                    },
                    'beforeselect': function (combo, record, index, eOpts) {
                        if (record.get('vat_code').indexOf('-OS') >= 0) {
                            return false;
                        }
                    }
                }
            },
            onWidgetAttach: function (column, widget, record) {
                var invoiceId = IProcessingSCls.getInvoice_id();
                var vatData = '';
                widget.clearValue();
                if ((invoiceId == 0 || record.get('invoice_id') == invoiceId) && 'TW-' != record.get('Charge_code').substring(0, 3)) {
                    if (!(record.get("rev_split") == "50/50" && record.get("MBL_nbr") == "" && record.get("Charge_code") != "DCMB")) {
                        vatData = IProcessingSCls.getVatListCodes();
                        widget.setStore(Ext.create('Ext.data.Store', {
                            fields: ['vat_code', 'long_description', 'vat_percent', 'displayVat', 'invoicevat_id'],
                            data: vatData
                        }));
                        if (vatData.length > 0) {
                            if (vatData.length == 1) {
                                Ext.each(vatData, function (item) {
                                    if (item.data != '' && item.data != null) {
                                        widget.setValue(item.get('vat_code'));
                                        widget.setVisible(true);
                                    } else {
                                        if (item.vat_code != undefined) {
                                            widget.setValue(item.vat_code);
                                            widget.setVisible(true);
                                        }
                                    }
                                });
                            }
                            else {
                                var matched = 'false'
                                Ext.each(vatData, function (item) {
                                    if (item.vat_code != undefined) {
                                        if (record.get('invoicevat_id') == item.invoicevat_id) {
                                            widget.setValue(item.vat_code);
                                            widget.setVisible(true);
                                            matched = 'True';
                                        }
                                    }

                                });
                                if (matched == 'false') { widget.setValue('0'); widget.setVisible(true); }

                            }
                        }

                    } else {
                        widget.setVisible(false)
                    }
                }
                else {
                    if (record.get('rowtype') == 'CustomTWH') {
                        vatData = IProcessingSCls.getVatListCodes();
                        if (vatData.length > 0) {
                            widget.setValue(vatData[0]['vat_code']);
                            widget.setVisible(true);
                        }
                        else {
                            vatData.push(new Ext.data.Record({
                                vat_code: 'XMPT',
                                displayVat: 'Exempt',
                                vat_percent: 0,
                                long_description: 'Exempt',
                                invoicevat_id: 0
                            }));
                        }
                        widget.setStore(Ext.create('Ext.data.Store', {
                            fields: ['vat_code', 'long_description', 'vat_percent', 'displayVat', 'invoicevat_id'],
                            data: vatData
                        }));
                        widget.setDisabled(true)
                    } else {
                        widget.setVisible(false);
                    }
                }

            }
        },
        {
            text: 'Charge',
            maxWidth: '140px',
            columns: [
                {
                    text: 'Code', itemId: 'colChargeCode', dataIndex: 'charge_code_txt', width: 60, flex: .1,
                    renderer: function (value, metaData, record, row, col, store, gridView) {
                        var me = this;
                        return IProcessingSCls.invoiceProcessingColumnRenderSort(me, value, metaData, record, row, col, store, gridView);
                    }
                },
                {
                    text: 'Description', dataIndex: 'CHARGE_DESCRIPTION', width: 125, flex: .1,
                    renderer: function (value, metaData, record, row, col, store, gridView) {
                        metaData.tdAttr = 'data-qtip="' + Ext.String.htmlEncode(value) + '"';
                        return value;
                    }
                }
            ]
        },
        {
            text: 'Sell',
            columns: [
                {
                    text: 'Amt', dataIndex: 'sell_amt', align: 'right',
                    renderer: function (value, metaData) {
                        var val = Utility.Formatting.NumFormat_Thousands_2Decimals(value, metaData);
                        metaData.tdAttr = 'data-qtip="' + Ext.String.htmlEncode(val) + '"';
                        return val;
                    }

                },
                {
                    text: 'Curr.', dataIndex: 'sell_cid', align: 'right'
                }
            ]
        },

        {
            text: 'Buy/Ven.Bill',
            columns: [
                {
                    text: 'Amt', dataIndex: 'buy_amt', align: 'right', minWidth: 110,
                    editor: {
                        xtype: 'numberfield',
                        hideTrigger: true,
                        keyNavEnabled: false,
                        mouseWheelEnabled: false,
                        decimalPrecision: 2,
                        allowBlank: false,
                        listeners: {
                            change: function (text, newValue, OldValue) {
                                var value = IProcessingSCls.getInvoiceCID().toUpperCase();
                                var selectedModel = this.up('grid').getSelectionModel().getSelection()[0];
                                var rowNum = selectedModel.get('ROWNUMBER');
                                var rec = this.up('grid').getStore().getAt(rowNum - 1);
                                // Kaizen 13732: Currency Issue  by Sriram
                                if (rec != null)
                                    rec.set('buy_cid', value)
                            }
                        }
                    },
                    renderer: function (value, metaData, record, row, col, store, gridView) {
                        var me = this;
                        return IProcessingSCls.invoiceProcessingColumnRenderSort(me, value, metaData, record, row, col, store, gridView);
                    }
                },
                {
                    text: 'Curr.', dataIndex: 'buy_cid', align: 'right', minWidth: 80,
                    editor: {
                        xtype: 'textfield',
                        maxLength: 3,
                        vType: "text",
                        regex: /[a-zA-Z]/,
                        listeners: {
                            change: function (text, newValue, OldValue) {
                                var value = this.getValue().toUpperCase();
                                if (value.length > 3 || Ext.isNumeric(value)) {
                                    alert("Invalid Curreny Code, Please enter valid Currency Code ");
                                    this.setValue('');
                                } else {
                                    if (value.length == 3) {
                                        var iVal = IProcessingSCls.checkValidCurrency(value)
                                        if (iVal.length == 0) {
                                            alert("Invalid Curreny Code, Please enter valid Currency Code ");
                                            this.setValue('');
                                        } else {
                                            this.setValue(value);
                                        }
                                    }
                                }
                            }
                        }
                    },
                    renderer: function (value, metaData, record, row, col, store, gridView) {
                        var me = this;
                        return IProcessingSCls.invoiceProcessingColumnRenderSort(me, value, metaData, record, row, col, store, gridView);
                    }
                }
            ]
        },
        {
            xtype: 'actioncolumn',
            itemId: 'exchRateActionCol',
            hidden: false,
            text: '',
            sortable: false,
            tdCls: 'x-grid-cell-Other',
            renderer: function (value, metaData, record, row, col, store, gridView) {
                var me = this;
                return IProcessingSCls.invoiceProcessingColumnRenderSort(me, value, metaData, record, row, col, store, gridView);

            },
            items: [
                {
                    icon: 'images/Transaction money.png',  // Use a URL in the icon config
                    tooltip: 'Exchange Rate',
                    handler: function (grid, rowIndex, colIndex) {
                        var rec = '';
                        var invoiceCid = '';
                        var pageType = IProcessingSCls.getPageType();
                        if (pageType == 'LVB') {
                            rec = IProcessingSCls.getNewRecDetails();
                            invoiceCid = rec.Invoice_CID;

                        } else {
                            rec = IProcessingSCls.getRecDetails();
                            invoiceCid = rec.get('Invoice_CID');
                        }

                        var record = grid.getStore().getAt(rowIndex);
                        if (record.get('Invoice_detail_id') != '' && record.get('invoice_id') == parseInt(PgAtt.getInvoice_id()) && record.get('buy_cid') != invoiceCid) {
                            IProcessingSCls.setFromCID(record.get('buy_cid'));
                            IProcessingSCls.setToCID(invoiceCid);
                            IProcessingSCls.setCommentsVisible(false);
                            IProcessingSCls.setExchRateVisible(true);
                            var win = Ext.widget('App-View-InvoiceProcessing-ExchangeRateW');
                            win.rowDetails = record;
                            win.grid = this.up('grid');
                            win.show();
                        }
                    }
                },
                {
                    icon: 'images/comments.png',  // Use a URL in the icon config
                    tooltip: '',
                    handler: function (grid, rowIndex, colIndex) {
                        var rec = '';
                        var invoiceCid = '';
                        var pageType = IProcessingSCls.getPageType();
                        if (pageType == 'LVB') {
                            rec = IProcessingSCls.getNewRecDetails();
                            invoiceCid = rec.Invoice_CID;

                        } else {
                            rec = IProcessingSCls.getRecDetails();
                            invoiceCid = rec.get('Invoice_CID');
                        }
                        var record = grid.getStore().getAt(rowIndex);
                        if ((record.get('comment') != '') || (record.get('PaidDifferentlyReason'))) {
                            IProcessingSCls.setCommentsVisible(true);
                            IProcessingSCls.setExchRateVisible(false);
                            IProcessingSCls.setFromCID(record.get('buy_cid'));
                            IProcessingSCls.setToCID(invoiceCid);
                            var win = Ext.widget('App-View-InvoiceProcessing-CommentsW');
                            win.rowDetails = record;
                            win.grid = this.up('grid');
                            win.show();
                        }
                    }
                }
            ]
        },
        {
            text: 'Bill Amt <BR>(' + PgAtt.getDisplay_currency() + ' )', itemId: 'colBillAmt_IP', dataIndex: 'invoice_amt', align: 'right',
            renderer: function (value, metaData) {
                var val = Utility.Formatting.NumFormat_Thousands_2Decimals(value, metaData);
                metaData.tdAttr = 'data-qtip="' + Ext.String.htmlEncode(val) + '"';
                return val;
            }
        },
        {
            xtype: 'checkcolumn',
            hidden: true,
            sortable: false,
            header: 'A',
            dataIndex: 'backCheck',
            listeners: {
                checkchange: function (column, rowIdx, checked, eOpts) {
                    var record = this.up('grid').getStore().getAt(rowIdx);
                    var invoiceId = 0;
                    var pageType = IProcessingSCls.getPageType();
                    var rec = '';
                    if (pageType == 'LVB') {
                        rec = IProcessingSCls.getNewRecDetails();
                        invoiceId = rec.Invoice_id

                    } else {
                        rec = IProcessingSCls.getRecDetails();
                        invoiceId = rec.get("invoice_id");
                    }
                    if (invoiceId == record.get("invoice_id") && invoiceId != 0 && record.get("AccrualFlag") != undefined) {
                        var tabPanel = this.up('#tabPanelId');
                        if (record.get('frontCheck') == false && checked) {
                            record.set('frontCheck', checked);
                        }
                        rec = IProcessingSCls.billProcessingMblFkValidation(record, checked, this.up('grid'), tabPanel, "i_lineacc");
                        this.up('grid').down('#InvoiceDetailsId').loadValues();
                    }
                    record.dirty = false;
                    this.up('grid').getView().refresh();
                }
            },
            renderer: IProcessingSCls.invoiceProcessingCheckColRendered
        }
        ,
        {
            text: 'Paid Differently Reason', dataIndex: 'PaidDifferentlyReason', width: 20, hidden: true

        }
        ,
        {
            text: 'MBLFK', dataIndex: 'MBL_fk', width: 20, hidden: true
        }
    ]

});