/* ====================================================================================================
NAME:			[Bills Page Singleton Class]
BEHAVIOR:		All the actions related Bills page.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
11/14/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.Controller.CBOL.SingletonCls', {
    alias: 'widget.App-Controller-CBOL-SingletonCls',
    alternateClassName: ['CBOLSinCls'],
    singleton: true,
    config: {
        cbolRadioType: 'ByCarrierBol',
        cbolStatus: 'NonMatched',
        cbolPageType: 'CBOL',
        invoiceId: '0',
        processedCount: 0,
        matchedCount: 0,
        nonMatchedCount: 0,
        carrier_Id: '',
        charge_Code: '',
        hbl: '',
        isChargeCodeRemoved: false,
        pageType: 'Bills'

    },
    constructor: function (options) {
        this.initConfig(options);
    },
    GetCbolSummaryCount: function (current) {
        var params = {
            InvoiceId: PgAtt.getInvoice_id()
        };

        BIA.Ajax.request({
            url: 'api/WebAPIReport/GetCbolAggregateData',
            method: "POST",
            async: false,
            cache: false,
            headers: {
                "Content-Type": "application/json"
            },
            jsonData: params,
            useDefaultXhrHeader: true,
            success: function (response) {
                var btnFlag = false,
                    data = Ext.decode(response.responseText),
                    tabPanel = current.down('#appCbolSumId');
                Ext.each(data, function (item) {
                    if (item != null && item != '') {

                        if (item.RecType == 'All') {
                            tabPanel.down('#cbolAll').tab.setText('All (' + item.TotalRows + ')');
                        }
                        if (item.RecType == 'Matched') {
                            tabPanel.down('#cbolMatched').tab.setText('Matched (' + item.TotalRows + ')');
                            CBOLSinCls.setMatchedCount(item.TotalRows);
                            if (data.length > 0 && item.TotalRows > 0) {
                                btnFlag = true
                            }
                        }
                        if (item.RecType == 'NonMatched') {
                            tabPanel.down('#cbolNonMatched').tab.setText('Nonmatched(' + item.TotalRows + ')');
                            CBOLSinCls.setNonMatchedCount(item.TotalRows);
                        }
                        if (item.RecType == 'Selected') {
                            tabPanel.down('#cbolSelected').tab.setText('Selected (' + item.TotalRows + ')');
                            CBOLSinCls.setProcessedCount(item.TotalRows);
                        }

                    }
                });

                if (btnFlag && data.length > 0) {
                    tabPanel.down('#cbolAll').down('grid').down('#btnProcessExcelDataToFlote').setVisible(true);
                    tabPanel.down('#cbolNonMatched').down('grid').down('#btnProcessExcelDataToFlote').setVisible(true);
                    tabPanel.down('#cbolMatched').down('grid').down('#btnProcessExcelDataToFlote').setVisible(true);
                    tabPanel.down('#cbolSelected').down('grid').down('#btnProcessExcelDataToFlote').setVisible(true);
                }
                else {
                    tabPanel.down('#cbolAll').down('grid').down('#btnProcessExcelDataToFlote').setVisible(false);
                    tabPanel.down('#cbolNonMatched').down('grid').down('#btnProcessExcelDataToFlote').setVisible(false);
                    tabPanel.down('#cbolMatched').down('grid').down('#btnProcessExcelDataToFlote').setVisible(false);
                    tabPanel.down('#cbolSelected').down('grid').down('#btnProcessExcelDataToFlote').setVisible(false);
                }
            },
            failure: function (conn, response, options, eOpts) {
                BIACore.Exception(conn.responseText);
                BIACore.Message(response);
            },
            scope: this
        });
    },
    processExcelDataToInvDetails: function (record, comment) {
        var invId = PgAtt.getInvoice_id();
        var cbol = '';
        var cc = '';
        var hbl = '';

        var pageType = CBOLSinCls.getCbolPageType()
        if (pageType == 'CC' && (record == '' || record == null)) {
            if (CBOLSinCls.getCbolRadioType() == "ByCarrierBol") {
                cbol = PgAtt.getMbl_iata_busid();
            } else if (CBOLSinCls.getCbolRadioType() == "ByChargeCode") {
                cc = PgAtt.getCharge_code();
            }
            else if (CBOLSinCls.getCbolRadioType() == "ByHBL") {
                hbl = PgAtt.getShipment_number();
            }
        }


        if (record != '' && record != null) {

            if (pageType == 'CBOL') {
                if (CBOLSinCls.getCbolRadioType() == "ByCarrierBol") {
                    cbol = record.get('Carrier_BOL');
                    cc = '';
                    hbl = '';
                } else {
                    cbol = '';
                    cc = record.get('Carrier_BOL');
                    hbl = '';
                }
            } else if (pageType == 'CC') {
                if (CBOLSinCls.getCbolRadioType() == "ByCarrierBol") {
                    cbol = PgAtt.getMbl_iata_busid();
                    cc = record.get('Carrier_BOL');
                    hbl = '';
                } else if (CBOLSinCls.getCbolRadioType() == 'ByHBL') {
                    cc = record.get('Carrier_BOL');
                    hbl = PgAtt.getShipment_number();
                    cbol = '';
                } else {
                    cbol = record.get('Carrier_BOL');
                    cc = PgAtt.getCharge_code();
                    hbl = '';
                }
            }
        }

        var params = {
            InvoiceId: invId,
            CarrierId: cbol,
            ChargeCode: cc,
            hbl: hbl,
            UserId: PgAtt.getUserId(),
            Comments: comment,
            RadioSelection: CBOLSinCls.getCbolRadioType()
        };

        BIA.Ajax.request({
            url: 'api/WebAPIReport/ProcessExcelDataToFlote',
            method: "POST",
            async: false,
            cache: false,
            headers: {
                "Content-Type": "application/json"
            },
            jsonData: params,
            useDefaultXhrHeader: true,
            failure: function (conn, response, options, eOpts) {
                BIACore.Exception(conn.responseText);
                BIACore.Message(response);
            }
        });
    },
    disableEnableMainTab: function (flag, tabPanel) {
        tabPanel.down('#floteHomeTabId').setDisabled(flag);
        tabPanel.down('#locShipmentTabId').setDisabled(flag);
        tabPanel.down('#locOceanMBLTabId').setDisabled(flag);
        tabPanel.down('#AppBillTabPanelId').setDisabled(flag);
        tabPanel.down('#locVendorTabId').setDisabled(flag);
        tabPanel.down('#vendorShipTabId').setDisabled(flag);
        tabPanel.down('#vendorTabId').setDisabled(flag);
        tabPanel.down('#AppAccrualsTabId').setDisabled(flag);
    },
    cbolActionColRendered: function cbolActionColRendered(me, value, metaData, record) {
        var strReturn = '<span style="font-weight:bold; font-size:12px;"></span>';

        if (record.get('Ver_Charge_Code') != 0 && record.get('Shipment_Count') != 0 && record.get('NonVer_charge_code') == 0) {
            me.items[0].icon = 'images/matched.png';
            me.items[0].tooltip = 'Invoice amount and e2k buy amount match';
        } else {
            me.items[0].icon = '';
            me.items[0].tooltip = '';
        }
        if (record.get('NonVer_charge_code') != 0) {
            me.items[1].icon = 'images/unmatched.png';
            me.items[1].tooltip = 'Invoice amount and e2k buy amount do not match';
        } else {
            me.items[1].icon = '';
            me.items[1].tooltip = '';
        }
        if (record.get('Processed_charge_code') != 0 && record.get('NonVer_charge_code') == 0) {
            me.items[2].icon = 'images/selected_img.png';
            me.items[2].tooltip = 'This record has been selected on the invoice';
        } else {
            me.items[2].icon = '';
            me.items[2].tooltip = '';
        }
        if (record.get('ChargeUsed') == 'Y') {
            me.items[3].icon = 'images/info.png';
            me.items[3].tooltip = 'On In-Process Bill';
        } else {
            me.items[3].icon = '';
            me.items[3].tooltip = '';
        }

        if (record.get('Buy_Cid_Orig') != record.get('Invoice_CID')) {
            me.items[4].icon = 'images/Transaction money.png';
            me.items[4].tooltip = 'Edit Exchange Rate';
        } else {
            me.items[4].icon = '';
            me.items[4].tooltip = '';
        }
        if (record.get('Shipment_Count') == 0) {
            me.items[5].icon = 'images/CC-icon.png';
            me.items[5].tooltip = 'CBOL and charge code does not match an e2k record';
        } else {
            me.items[5].icon = '';
            me.items[5].tooltip = '';
        }
        return strReturn;

    },
    cbolColumnRenderSort: function cbolColumnRenderSort(value, metaData, record, rowIndex, colIndex) {
        if (colIndex == 0) {
            if (CBOLSinCls.getCbolPageType() == "CC") {
                if (CBOLSinCls.getCbolRadioType() != 'ByHBL') {
                    metaData.tdAttr += 'data-qtip="' + Ext.String.htmlEncode("Bill Processing by Charge Code and Carrier BOL.") + '"';
                }
                else { metaData.tdAttr += 'data-qtip="' + Ext.String.htmlEncode("Bill Processing by Charge Code and HBL.") + '"'; }
            }
            metaData.style = "color:blue;text-decoration: underline;cursor: pointer";
            return value;
        }

        if (colIndex == 1) {
            if (value != '' && value != undefined) {
                var imgIcon = '';
                if (CBOLSinCls.getCbolPageType() == "CC") {
                    if (CBOLSinCls.getCbolRadioType() == 'ByCarrierBol') {
                        imgIcon = ' <img  title="Bill Processing by Carrier BOL (' + PgAtt.getMbl_iata_busid() + ') & Container Number (' + value + ')" style="width: 14px; height: 16px; vertical-align: middle;" src="images/container_icon.png"  />';
                    } else if (CBOLSinCls.getCbolRadioType() == 'ByChargeCode') {
                        imgIcon = ' <img  title="Bill Processing by Charge Code (' + PgAtt.getCharge_code() + ') & Container Number (' + value + ')" style="width: 14px; height: 16px; vertical-align: middle;" src="images/container_icon.png"  />';
                    } else if (CBOLSinCls.getCbolRadioType() == 'ByHBL') {
                        imgIcon = ' <img  title="Bill Processing by HBL (' + PgAtt.getShipment_number() + ') & Container Number (' + value + ')" style="width: 14px; height: 16px; vertical-align: middle;" src="images/container_icon.png"  />';
                    }
                }
                return imgIcon;
            } else {
                return value;
            }
        }
    },
    resetFilterPopFilter: function resetFilterPopFilter(filter) {
        PgAtt.setCarrier_id(''); filter.down('#filCarrierId textfield').setValue('');
        PgAtt.setShipment_number(''); filter.down('#filShipmentNumber clearCombo').setValue('');
        PgAtt.setMbl_number(''); filter.down('#filMBLNumber clearCombo').setValue('');
        PgAtt.getMbl_iata_busid('');
        PgAtt.setContainer_number(''); filter.down('#filContainerNumber clearCombo').setValue('');
        PgAtt.setVendor_code(''); filter.down('#filVendorCode clearCombo').setValue('');
        PgAtt.setCharge_code(''); filter.down('#filChargeCode clearCombo').setValue('');


        if (CBOLSinCls.getPageType() == 'Bills') {
            filter.down('#filInvoiceId textfield').setValue('');
            PgAtt.setInvoice_id('0');
        } else {
            filter.down('#filUPSRefTypeName textfield').setValue('');
        }
    }

});