/* ====================================================================================================
NAME:			[Filter Criteria Fields]
BEHAVIOR:		Shows all the filter criteria fields.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/26/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.View.Component.FilterFields', {
    extend: 'App.View.Component.Container.FilterPanelBase',
    alias: 'widget.App-View-Component-FilterFields',
    itemId: 'FilterFieldsId',
    layout: 'vbox',
    baseCls: 'UPS_Blue_2',
    items: [

        { xtype: 'App-View-Component-Filter-AcctYear', margin: '5 5 5 5', itemId: "filAcctYear" },
        { xtype: 'App-View-Component-Filter-AcctMon', margin: '5 5 5 5', itemId: "filAcctMon" },
        { xtype: 'App-View-Component-Filter-DisplayCurr', margin: '5 5 5 5', itemId: "filDisplayCurr" },
        { xtype: 'App-View-Component-Filter-AccrualFlag', hidden: true, margin: '5 5 5 5', itemId: "filAccrualFlag" },
        { xtype: 'App-View-Component-Filter-CostType', hidden: true, margin: '5 5 5 5', itemId: "filCostType" },
        { xtype: 'App-View-Component-Filter-LocType', margin: '5 5 5 5', itemId: "filLocType" },
        { xtype: 'App-View-Component-Filter-LocCode', margin: '5 5 5 5', itemId: "filLocCode" },
        { xtype: 'App-View-Component-Filter-LocCountry', margin: '5 5 5 5', itemId: "filLocCountry" },
        { xtype: 'App-View-Component-Filter-LocRegion', margin: '5 5 5 5', itemId: "filLocRegion" },
        { xtype: 'App-View-Component-Filter-ReceivedDate', hidden: true, margin: '5 5 5 5', itemId: "filReceivedDate" },
        { xtype: 'App-View-Component-Filter-CompanyCode', hidden: true, margin: '5 5 5 5', itemId: "filCompanyCode" },
        { xtype: 'App-View-Component-Filter-Country', hidden: true, margin: '5 5 5 5', itemId: "filCountrycode" },
        { xtype: 'App-View-Component-Filter-Origin', hidden: true, margin: '5 5 5 5', itemId: "filOrigin" },
        { xtype: 'App-View-Component-Filter-Destination', hidden: true, margin: '5 5 5 5', itemId: "filDestination" },
        { xtype: 'App-View-Component-Filter-OrigDest', hidden: true, margin: '5 5 5 5', itemId: "filOrigDest" },
        { xtype: 'App-View-Component-Filter-VendorCode', hidden: true, margin: '5 5 5 5', itemId: "filVendorCode" },
        { xtype: 'App-View-Component-Filter-VendorId', hidden: true, margin: '5 5 5 5', itemId: "filVendorId" },
        { xtype: 'App-View-Component-Filter-ServiceCode', hidden: true, margin: '5 5 5 5', itemId: "filServiceCode" },
        { xtype: 'App-View-Component-Filter-ChargeStatus', hidden: true, margin: '5 5 5 5', itemId: "filChargeStatus" },
        { xtype: 'App-View-Component-Filter-InvoiceStatus', hidden: true, margin: '5 5 5 5', itemId: "filInvoiceStatus" },
        { xtype: 'App-View-Component-Filter-ChargeCode', hidden: true, margin: '5 5 5 5', itemId: "filChargeCode" },
        { xtype: 'App-View-Component-Filter-CurrencyCode', hidden: true, margin: '5 5 5 5', itemId: "filCurrencyCode" },
        { xtype: 'App-View-Component-Filter-MBLNumber', hidden: true, margin: '5 5 5 5', itemId: "filMBLNumber" },
        { xtype: 'App-View-Component-Filter-CarrierId', hidden: true, margin: '5 5 5 5', itemId: "filCarrierId" },
        { xtype: 'App-View-Component-Filter-ShipmentNumber', hidden: true, margin: '5 5 5 5', itemId: "filShipmentNumber" },
        { xtype: 'App-View-Component-Filter-InvoiceRefNo', hidden: true, margin: '5 5 5 5', itemId: "filInvoiceRefNo" },
        { xtype: 'App-View-Component-Filter-InvoiceId', hidden: true, margin: '5 5 5 5', itemId: "filInvoiceId" },
        { xtype: 'App-View-Component-Filter-ContainerNumber', hidden: true, margin: '5 5 5 5', itemId: "filContainerNumber" },
        { xtype: 'App-View-Component-Filter-BatchId', hidden: true, margin: '5 5 5 5', itemId: "filBatchId" },
        { xtype: 'App-View-Component-Filter-StartDate', hidden: true, margin: '5 5 5 5', itemId: "filStartDate" },
        { xtype: 'App-View-Component-Filter-EndDate', hidden: true, margin: '5 5 5 5', itemId: "filEndDate" },
        { xtype: 'App-View-Component-Filter-ModifiedBy', hidden: true, margin: '5 5 5 5', itemId: "filModifiedBy" },
        { xtype: 'App-View-Component-Filter-MBLCostBasis', hidden: true, margin: '5 5 5 5', itemId: "filMBLCostBasis" },
        { xtype: 'App-View-Component-Filter-ImageNumber', hidden: true, margin: '5 5 5 5', itemId: "filImageNumber" },
        { xtype: 'App-View-Component-Filter-E2kCarrierCode', hidden: true, margin: '5 5 5 5', itemId: "filE2kCarrierCode" },
        { xtype: 'App-View-Component-Filter-VendorEnglishName', hidden: true, margin: '5 5 5 5', itemId: "filVendorEnglishName" },
        { xtype: 'App-View-Component-Filter-VendorLegalName', hidden: true, margin: '5 5 5 5', itemId: "filVendorLegalName" },
        { xtype: 'App-View-Component-Filter-CarrierBOL', hidden: true, margin: '5 5 5 5', itemId: "filCarrierBOL" },
        { xtype: 'App-View-Component-Filter-UPSRefTypeName', margin: '2 2 2 2', hidden: true, itemId: "filUPSRefTypeName" },
        { xtype: 'App-View-Component-Filter-ReferenceFilter', value: '', itemId: "filReferenceFilter" },
        { xtype: 'App-View-Component-Filter-OriginTp', hidden: true, margin: '5 5 5 5', itemId: "filOriginTp" },
        { xtype: 'App-View-Component-Filter-DestTp', hidden: true, margin: '5 5 5 5', itemId: "filDestTp" },
        { xtype: 'App-View-Component-Filter-Reason', hidden: true, margin: '5 5 5 5', itemId: "filReason" },
        { xtype: 'App-View-Component-Filter-ServiceLevel', hidden: true, margin: '5 5 5 5', itemId: "filServiceLevel" },
        { xtype: 'App-View-Component-Filter-StartPeriod', hidden: true, margin: '5 5 5 5', itemId: "filStartPeriod" },
        { xtype: 'App-View-Component-Filter-EndPeriod', hidden: true, margin: '5 5 5 5', itemId: "filEndPeriod" },
        { xtype: 'App-View-Component-Filter-VendorName', hidden: true, margin: '5 5 5 5', itemId: "filVendorName" },
        { xtype: 'App-View-Component-Filter-MblNbrFlag', hidden: true, margin: '5 5 5 5', itemId: "filMblNbrFlag" },
        { xtype: 'App-View-Component-Filter-ScanType', hidden: true, margin: '5 5 5 5', itemId: "filScanType" },
        { xtype: 'App-View-Component-Filter-PaidStatus', hidden: true, margin: '5 5 5 5', itemId: "filPaidStatus" },

        {
            xtype: 'panel',
            layout: 'hbox',
            baseCls: 'UPS_Blue_2',
            itemId: 'filButtons',
            width: '100%',
            items: [
                {
                    xtype: 'textfield', margin: '5 5 5 5', inputwidth: 150, width: '60%', itemId: 'searchTextId', enableKeyEvents: true
                },
                {
                    xtype: 'button', itemId: 'ApplyButton', cls: 'btn', width: '16%', margin: '5 5 5 5', text: '<div style="font-weight: bold; color:white;">Go</div>',
                    listeners: {
                        click: function () {
                            PgAtt.setFilterGoFlag(true);
                            this.fireEvent('btnApply');
                        }
                    }
                },
                {
                    xtype: 'button', itemId: 'btnAdvance', cls: 'btn', margin: '5 5 5 5', width: '16%', text: '...', listeners: {
                        click: function () {
                            Ext.widget('App-View-Component-AdvanceFilter').show();
                            this.up('#FilterFieldsId').down('#msgWarning').hide();
                        }
                    }
                }
            ]
        },
        { xtype: 'label', width: '220px', itemId: 'msgWarning', hidden: true, html: '<Div style= "background-color : white;color:red;font-weight:bold; font-size:12px;border: 1px solid white;border-color:#FFFFFF;">Filters changed but not applied!<BR> Click Go to Apply.</Div>', style: 'background-color : white;color:red;font-weight:bold; font-size:11px;border: 1px solid white;border-color:#FFFFFF;', margin: '5 5 5 5' }
    ],
    showHideFilter: function () {
        this.setAttirbuteFieldValues();

        if (PgAtt.getLocation_code() != '') {
            PgAtt.getValidLocation();
        }

        var me = this;

        var tabPanel = this.up('App-View-Viewport').down('#tabPanelId');

        var tabName = tabPanel.activeTab.tab.text;
        if (tabName == 'Bills') {
            var subTab = tabPanel.activeTab.activeTab.tab.text;
        }
        var AccrualsTab = tabPanel.down("App-View-Accrual-AccrualsTab")
        var rptTabName = AccrualsTab.activeTab.tab.text;
        var baseRegex = '/|filButtons|filDisplayCurr|filAcctYear|filAcctMon|filLocType';

        if (PgAtt.getLocation_code() != '') { baseRegex = baseRegex + '|filLocCode'; }
        me.down('#filLocCode textfield').setDisabled(false);
        if (rptTabName == 'Paid Differently') {
            me.down('#searchTextId').setDisabled(true);
            me.down('#btnAdvance').setVisible(false);
        } else {
            me.down('#searchTextId').setDisabled(false);
            me.down('#btnAdvance').setVisible(true);
        }

        if (tabName) {
            switch (tabName) {
                case 'Home':
                    me.down('#filDisplayCurr combobox').setDisabled(false);
                    me.down('#filLocType textfield').setDisabled(false);
                    break;
                case 'Location Shipment':
                    if (PgAtt.getShipment_number() != '' || PgAtt.getMbl_number() != ''
                        || PgAtt.getCarrier_id() != '' || PgAtt.getContainer_number() != '') {
                        me.down('#filAcctYear combobox').setDisabled(true);
                        me.down('#filAcctMon combobox').setDisabled(true);
                    }
                    else {
                        me.down('#filAcctYear combobox').setDisabled(false);
                        me.down('#filAcctMon combobox').setDisabled(false);
                    }
                    if (PgAtt.getLocation_type() == 'DEP') {
                        PgAtt.setOD('');
                        me.down('#filOrigDest clearCombo').setDisabled(true);
                    }
                    else { me.down('#filOrigDest clearCombo').setDisabled(false); }

                    if (PgAtt.getRcvdAtDate() != null && PgAtt.getRcvdAtDate() != '') { baseRegex = baseRegex + '|filReceivedDate'; }
                    if (PgAtt.getCountry_code() != '' && PgAtt.getCountry_code() != null) { baseRegex = baseRegex + '|filCountrycode'; }
                    if (PgAtt.getService_code() != 'All') { baseRegex = baseRegex + '|filServiceCode'; }
                    if (PgAtt.getCharge_status() != 'All') { baseRegex = baseRegex + '|filChargeStatus'; }
                    if (PgAtt.getMbl_number() != '') { baseRegex = baseRegex + '|filMBLNumber'; }
                    if (PgAtt.getContainer_number() != '') { baseRegex = baseRegex + '|filContainerNumber'; }
                    if (PgAtt.getShipment_number() != '' && PgAtt.getShipment_number() != null) { baseRegex = baseRegex + '|filShipmentNumber'; }
                    if (PgAtt.getStartDateFilter() != null && PgAtt.getStartDateFilter() != '') { baseRegex = baseRegex + '|filStartDate'; }
                    if (PgAtt.getEndDateFilter() != null && PgAtt.getEndDateFilter() != '') { baseRegex = baseRegex + '|filEndDate'; }
                    if (PgAtt.getMbl_iata_busid() != '' && PgAtt.getMbl_iata_busid() != null) { baseRegex = baseRegex + '|filCarrierBOL'; }

                    me.down('#filDisplayCurr combobox').setDisabled(false);
                    me.down('#filLocType textfield').setDisabled(false);

                    break;
                case 'Location Ocean MBL':
                    if (PgAtt.getShipment_number() != '' || PgAtt.getMbl_number() != ''
                        || PgAtt.getCarrier_id() != '' || PgAtt.getContainer_number() != '') {
                        me.down('#filAcctYear combobox').setDisabled(true);
                        me.down('#filAcctMon combobox').setDisabled(true);
                    }
                    else {
                        me.down('#filAcctYear combobox').setDisabled(false);
                        me.down('#filAcctMon combobox').setDisabled(false);
                    }
                    if (PgAtt.getCountry_code() != '') { baseRegex = baseRegex + '|filCountrycode'; }
                    if (PgAtt.getCharge_status() != 'All') { baseRegex = baseRegex + '|filChargeStatus'; }
                    if (PgAtt.getMbl_number() != '') { baseRegex = baseRegex + '|filMBLNumber'; }
                    if (PgAtt.getContainer_number() != '') { baseRegex = baseRegex + '|filContainerNumber'; }
                    if (PgAtt.getShipment_number() != '' && PgAtt.getShipment_number() != null) { baseRegex = baseRegex + '|filShipmentNumber'; }
                    if (PgAtt.getStartDateFilter() != null && PgAtt.getStartDateFilter() != '') { baseRegex = baseRegex + '|filStartDate'; }
                    if (PgAtt.getEndDateFilter() != null && PgAtt.getEndDateFilter() != '') { baseRegex = baseRegex + '|filEndDate'; }
                    if (PgAtt.getMbl_iata_busid() != '') { baseRegex = baseRegex + '|filCarrierBOL'; }
                    if (PgAtt.getOrigin() != '') { baseRegex = baseRegex + '|filOrigin'; }
                    if (PgAtt.getDestination() != '') { baseRegex = baseRegex + '|filDestination'; }
                    if (PgAtt.getOD() != 'All') { baseRegex = baseRegex + '|filOrigDest'; }
                    if (PgAtt.getMbl_cost_basis() != 'All') { baseRegex = baseRegex + '|filMBLCostBasis'; }

                    me.down('#filDisplayCurr combobox').setDisabled(false);

                    break;
                case 'Bills':
                    me.down('#filInvoiceId textfield').setDisabled(false);
                    if (PgAtt.getInvoice_id() != "0") {
                        me.down('#filAcctMon combobox').setDisabled(true);
                        baseRegex = baseRegex + '|filInvoiceId';
                    }
                    else {
                        me.down('#filAcctMon combobox').setDisabled(false);
                    }
                    if (PgAtt.getCompany_code() != '') { baseRegex = baseRegex + '|filCompanyCode'; }
                    if (PgAtt.getInvoice_status() != '') { baseRegex = baseRegex + '|filInvoiceStatus'; }
                    if (subTab == 'Payment Details') {
                        if (PgAtt.getPaidStatus() != '' && PgAtt.getPaidStatus() != null) { baseRegex = baseRegex + '|filPaidStatus'; }
                        baseRegex = baseRegex.replace('|filDisplayCurr', '');
                        baseRegex = baseRegex.replace('|filLocType', '');
                    }
                    else {
                        if (PgAtt.getInvoice_status() != '' && (PgAtt.getInvoice_status() == 'Queued' || PgAtt.getInvoice_status() == 'Scanned')) { baseRegex = baseRegex + '|filScanType'; }
                        if (PgAtt.getModifiedBy() != null && PgAtt.getModifiedBy() != '') { baseRegex = baseRegex + '|filModifiedBy'; }
                        if (PgAtt.getInvBatchID() != '') { baseRegex = baseRegex + '|filBatchId'; }
                    }

                    if (PgAtt.getInvRefNo() != '' && PgAtt.getInvRefNo() != null) { baseRegex = baseRegex + '|filInvoiceRefNo'; }
                    if (PgAtt.getVendor_code() != '' && PgAtt.getVendor_code() != null) { baseRegex = baseRegex + '|filVendorCode'; }
                    if (PgAtt.getStartDateFilter() != null && PgAtt.getStartDateFilter() != '') { baseRegex = baseRegex + '|filStartDate'; }
                    if (PgAtt.getEndDateFilter() != null && PgAtt.getEndDateFilter() != '') { baseRegex = baseRegex + '|filEndDate'; }
                    break;
                case 'Location Vendor':
                    if (PgAtt.getStartDateFilter() != null && PgAtt.getStartDateFilter() != '') { baseRegex = baseRegex + '|filStartDate'; }
                    if (PgAtt.getEndDateFilter() != null && PgAtt.getEndDateFilter() != '') { baseRegex = baseRegex + '|filEndDate'; }
                    break;
                case 'Vendor Shipment':
                    baseRegex = baseRegex + '|filAccrualFlag|filCostType';
                    if (PgAtt.getShipment_number() != '' && PgAtt.getShipment_number() != null) { baseRegex = baseRegex + '|filShipmentNumber'; }
                    if (PgAtt.getCountry_code() != '' && PgAtt.getCountry_code() != null) { baseRegex = baseRegex + '|filCountrycode'; }
                    if (PgAtt.getMbl_number() != '') { baseRegex = baseRegex + '|filMBLNumber'; }
                    if (PgAtt.getContainer_number() != '') { baseRegex = baseRegex + '|filContainerNumber'; }
                    if (PgAtt.getCharge_code() != '' && PgAtt.getCharge_code() != null) { baseRegex = baseRegex + '|filChargeCode'; }
                    if (PgAtt.getStartDateFilter() != null && PgAtt.getStartDateFilter() != '') { baseRegex = baseRegex + '|filStartDate'; }
                    if (PgAtt.getEndDateFilter() != null && PgAtt.getEndDateFilter() != '') { baseRegex = baseRegex + '|filEndDate'; }
                    if (PgAtt.getMbl_iata_busid() != '') { baseRegex = baseRegex + '|filCarrierBOL'; }
                    if (PgAtt.getOrigin() != '') { baseRegex = baseRegex + '|filOrigin'; }
                    if (PgAtt.getDestination() != '') { baseRegex = baseRegex + '|filDestination'; }
                    if (PgAtt.getRcvdAtDate() != null && PgAtt.getEndDateFilter() != '') { baseRegex = baseRegex + '|filReceivedDate'; }
                    if (PgAtt.getService_code() != 'All') { baseRegex = baseRegex + '|filServiceCode'; }
                    if (PgAtt.getVendor_code() != '' || PgAtt.getVendor_id() != '') { baseRegex = baseRegex + '|filVendorCode'; }
                    if (PgAtt.getCost_type() != '') { baseRegex = baseRegex + '|filCostType'; }
                    if (PgAtt.getControllerPage() != '') { me.down('#filLocCode').setDisabled(false); }
                    me.down('#filDisplayCurr combobox').setDisabled(false);
                    me.down('#filLocType textfield').setDisabled(false);
                    break;
                case 'Vendors':
                    if (PgAtt.getCountry_code() != '') { baseRegex = baseRegex + '|filCountrycode'; }
                    if (PgAtt.getCompany_code() != '') { baseRegex = baseRegex + '|filCompanyCode'; }
                    if ((PgAtt.getVendor_code() != '' && PgAtt.getVendor_code() != null) || PgAtt.getVendor_id() != '') { baseRegex = baseRegex + '|filVendorCode'; }
                    if (PgAtt.getE2k_Carrier_Code() != '') { baseRegex = baseRegex + '|filE2kCarrierCode'; }
                    if (PgAtt.getVendor_Name_English() != '') { baseRegex = baseRegex + '|filVendorEnglishName'; }
                    if (PgAtt.getVendor_Legal_Name() != '') { baseRegex = baseRegex + '|filVendorLegalName'; }

                    me.down('#filAcctYear combobox').setDisabled(true);
                    me.down('#filAcctMon combobox').setDisabled(true);
                    break;
                case 'Vendor Statement Summary':
                    me.down('#filLocCode textfield').setDisabled(true);
                    if (PgAtt.getInvoice_id() != "0") {
                        baseRegex = baseRegex + '|filInvoiceId';
                    }
                    if (PgAtt.getMbl_iata_busid() != '' && PgAtt.getMbl_iata_busid() != null) { baseRegex = baseRegex + '|filCarrierBOL'; }
                    if (PgAtt.getCharge_code() != '' || CBOLSinCls.getCharge_Code() != '') { baseRegex = baseRegex + '|filChargeCode'; }
                    if (PgAtt.getShipment_number() != '' || CBOLSinCls.getHbl() != '') { baseRegex = baseRegex + '|filShipmentNumber'; }
                    break;
                case 'Accruals':
                    switch (rptTabName) {
                        case 'Accrual Monthly Journal Entry':
                            if (PgAtt.getCountry_code() != '') { baseRegex = baseRegex + '|filCountrycode'; }
                            if (PgAtt.getCompany_code() != '') { baseRegex = baseRegex + '|filCompanyCode'; }
                            break;
                        case 'Accrual Monthly Details':
                            if (PgAtt.getCountry_code() != '') { baseRegex = baseRegex + '|filCountrycode'; }
                            if (PgAtt.getCompany_code() != '') { baseRegex = baseRegex + '|filCompanyCode'; }
                            if (PgAtt.getService_code() != 'All') { baseRegex = baseRegex + '|filServiceCode'; }
                            if (PgAtt.getShipment_number() != '') { baseRegex = baseRegex + '|filShipmentNumber'; }
                            if (PgAtt.getCharge_code() != '') { baseRegex = baseRegex + '|filChargeCode'; }
                            if (PgAtt.getRcvdAtDate() != null && PgAtt.getRcvdAtDate() != '') { baseRegex = baseRegex + '|filReceivedDate'; }
                            break;
                        case 'Accrual Accuracy Report':

                            break;
                        //case 'Paid Differently':
                        //    baseRegex = '/|filButtons|filStartPeriod|filEndPeriod|filReason|filMblNbrFlag|filVendorName|filServiceLevel|filLocCode|filLocCountry|filOriginTp|filDestTp|filLocRegion';

                        default:
                            break;
                    }
                    break;
                case 'Invoice Processing':
                    baseRegex = '/|filButtons|filDisplayCurr|filAcctYear|filAcctMon|filLocCode';
                    me.down('#filLocCode textfield').setDisabled(true);
                    me.down('#filInvoiceId textfield').setDisabled(true);

                    if (PgAtt.getRcvdAtDate() != null && PgAtt.getRcvdAtDate() != '') { baseRegex = baseRegex + '|filReceivedDate'; }
                    if (PgAtt.getCountry_code() != '') { baseRegex = baseRegex + '|filCountrycode'; }
                    if (PgAtt.getService_code() != 'All') { baseRegex = baseRegex + '|filServiceCode'; }
                    if (PgAtt.getMbl_number() != '') { baseRegex = baseRegex + '|filMBLNumber'; }
                    if (PgAtt.getContainer_number() != '') { baseRegex = baseRegex + '|filContainerNumber'; }
                    if (PgAtt.getShipment_number() != '') { baseRegex = baseRegex + '|filShipmentNumber'; }
                    if (PgAtt.getStartDateFilter() != null && PgAtt.getStartDateFilter() != '') { baseRegex = baseRegex + '|filStartDate'; }
                    if (PgAtt.getEndDateFilter() != null && PgAtt.getEndDateFilter() != '') { baseRegex = baseRegex + '|filEndDate'; }
                    if (PgAtt.getCarrier_id() != '') { baseRegex = baseRegex + '|filCarrierId'; }
                    if (PgAtt.getOrigin() != '') { baseRegex = baseRegex + '|filOrigin'; }
                    if (PgAtt.getDestination() != '') { baseRegex = baseRegex + '|filDestination'; }
                    if (PgAtt.getInvoice_id() != "0") { baseRegex = baseRegex + '|filInvoiceId'; }
                    if (PgAtt.getCompany_code() != '') { baseRegex = baseRegex + '|filCompanyCode'; }
                    if (PgAtt.getVendor_code() != '' || PgAtt.getVendor_id() != '') { baseRegex = baseRegex + '|filVendorCode'; }
                    if (PgAtt.getCost_type() != 'All') { baseRegex = baseRegex + '|filCostType'; }
                    if (PgAtt.getCompany_code() != '') { baseRegex = baseRegex + '|filCompanyCode'; }
                    if (PgAtt.getCharge_code() != '') { baseRegex = baseRegex + '|filChargeCode'; }
                    if (PgAtt.getReferenceFilter() != '') { baseRegex = baseRegex + '|filReferenceFilter'; }
                    if (PgAtt.getUpsRefType() != '') { baseRegex = baseRegex + '|filUPSRefTypeName'; }
                    if (PgAtt.getAccrual_flag() != '') { baseRegex = baseRegex + '|filAccrualFlag'; }

                    break;
                case 'Paid Differently':
                    baseRegex = '/|filButtons|filStartPeriod|filEndPeriod|filReason|filMblNbrFlag|filVendorName|filServiceLevel|filLocCode|filLocCountry|filOriginTp|filDestTp|filLocRegion';
                    break;
                //case 'Payment Details':
                //    baseRegex = '/|filButtons|filLocCode|filPaidStatus|filStartDate|filEndDate';
                //    if (PgAtt.getInvoice_id() != "0") { baseRegex = baseRegex + '|filInvoiceId'; }
                //    if (PgAtt.getInvRefNo() != '' && PgAtt.getInvRefNo() != null) { baseRegex = baseRegex + '|filInvoiceRefNo'; }
                //    if (PgAtt.getVendor_code() != '' && PgAtt.getVendor_code() != null) { baseRegex = baseRegex + '|filVendorCode'; }

                // break;
                default:
                    break;
            }

        }
        var regex = new RegExp(baseRegex + '|/', 'i');

        for (var i = 0; i < this.items.length; i++) {
            if (regex.test(this.items.items[i].itemId)) {
                this.items.items[i].setVisible(true);
            }
            else { this.items.items[i].setVisible(false); }
        }

    },
    setAttirbuteFieldValues: function () {
        var me = this;
        me.down('#filDisplayCurr combobox').setDisabled(true);
        me.down('#filLocType textfield').setDisabled(true);
        me.down('#filAcctYear combobox').setDisabled(false);
        me.down('#filAcctMon combobox').setDisabled(false);


        if (me.down('#filAcctYear combobox').getValue() != '') { PgAtt.setYear(me.down('#filAcctYear combobox').getValue()) }
        if (me.down('#filAcctMon combobox').getValue() != '') { PgAtt.setMonth(me.down('#filAcctMon combobox').getValue()) }
        if (me.down('#filDisplayCurr combobox').getValue() != '') { PgAtt.setDisplay_currency(me.down('#filDisplayCurr combobox').getValue()) }
        if (me.down('#filAccrualFlag combobox').getValue() != '') { PgAtt.setAccrual_flag(me.down('#filAccrualFlag combobox').getValue()) }
        if (me.down('#filCostType clearCombo').getValue() != '') { PgAtt.setCost_type(me.down('#filCostType clearCombo').getValue()) }
        if (me.down('#filLocType combobox').getValue() != '') { PgAtt.setLocation_type(me.down('#filLocType combobox').getValue()) }
        if (me.down('#filLocCode clearCombo').getValue() != '') { PgAtt.setLocation_code(me.down('#filLocCode clearCombo').getValue()) }
        if (me.down('#filReceivedDate datefield').getValue() != '' && me.down('#filReceivedDate datefield').getValue() != null) { PgAtt.setRcvdAtDate(me.down('#filReceivedDate datefield').getValue()) }
        if (me.down('#filCompanyCode clearCombo').getValue() != null && me.down('#filCompanyCode clearCombo').getValue() != '') { PgAtt.setCompany_code(me.down('#filCompanyCode clearCombo').getValue()) }
        if (me.down('#filCountrycode clearCombo').getValue() != null && me.down('#filCountrycode clearCombo').getValue() != '') { PgAtt.setCountry_code(me.down('#filCountrycode clearCombo').getValue()) }
        if (me.down('#filOrigin clearCombo').getValue() != '') { PgAtt.setOrigin(me.down('#filOrigin clearCombo').getValue()) }
        if (me.down('#filDestination clearCombo').getValue() != '') { PgAtt.setDestination(me.down('#filDestination clearCombo').getValue()) }
        if (me.down('#filOrigDest clearCombo').getValue() != 'All') { PgAtt.setOD(me.down('#filOrigDest clearCombo').getValue()) }
        if (me.down('#filVendorCode clearCombo').getValue() != '') { PgAtt.setVendor_code(me.down('#filVendorCode clearCombo').getValue()) }
        if (me.down('#filVendorId textfield').getValue() != '') { PgAtt.setVendor_id(me.down('#filVendorId textfield').getValue()) }
        if (me.down('#filServiceCode clearCombo').getValue() != 'All') { PgAtt.setService_code(me.down('#filServiceCode clearCombo').getValue()) }
        if (me.down('#filChargeStatus clearCombo').getValue() != '') { PgAtt.setCharge_status(me.down('#filChargeStatus clearCombo').getValue()) }
        if (me.down('#filInvoiceStatus textfield').getValue() != '') { PgAtt.setInvoice_status(me.down('#filInvoiceStatus textfield').getValue()) }
        if (me.down('#filChargeCode clearCombo').getValue() != '') { PgAtt.setCharge_code(me.down('#filChargeCode clearCombo').getValue()) }
        if (me.down('#filCurrencyCode textfield').getValue() != '') { PgAtt.setCurrency_code(me.down('#filCurrencyCode textfield').getValue()) }
        if (me.down('#filMBLNumber clearCombo').getValue() != null) { PgAtt.setMbl_number(me.down('#filMBLNumber clearCombo').getValue()) }
        if (me.down('#filCarrierId textfield').getValue() != '') { PgAtt.setCarrier_id(me.down('#filCarrierId textfield').getValue()) }
        if (me.down('#filShipmentNumber clearCombo').getValue() != null && me.down('#filShipmentNumber clearCombo').getValue() != '') { PgAtt.setShipment_number(me.down('#filShipmentNumber clearCombo').getValue()) }
        if (me.down('#filInvoiceRefNo clearCombo').getValue() != '') { PgAtt.setInvRefNo(me.down('#filInvoiceRefNo clearCombo').getValue()) }
        if (me.down('#filInvoiceId textfield').getValue() != '') { PgAtt.setInvoice_id(me.down('#filInvoiceId textfield').getValue()) }
        if (me.down('#filContainerNumber clearCombo').getValue() != null) { PgAtt.setContainer_number(me.down('#filContainerNumber clearCombo').getValue()) }
        if (me.down('#filBatchId textfield').getValue() != '') { PgAtt.setInvBatchID(me.down('#filBatchId textfield').getValue()) }
        if (me.down('#filStartDate datefield').getValue() != '' && me.down('#filStartDate datefield').getValue() != null) { PgAtt.setStartDateFilter(me.down('#filStartDate datefield').getValue()) }
        if (me.down('#filEndDate datefield').getValue() != '' && me.down('#filEndDate datefield').getValue() != null) { PgAtt.setEndDateFilter(me.down('#filEndDate datefield').getValue()) }
        if (me.down('#filModifiedBy textfield').getValue() != '') { PgAtt.setModifiedBy(me.down('#filModifiedBy textfield').getValue()) }
        if (me.down('#filMBLCostBasis clearCombo').getValue() != '') { PgAtt.setMbl_cost_basis(me.down('#filMBLCostBasis clearCombo').getValue()) }
        if (me.down('#filImageNumber textfield').getValue() != '') { PgAtt.setImageNumber(me.down('#filImageNumber textfield').getValue()) }
        if (me.down('#filE2kCarrierCode textfield').getValue() != '') { PgAtt.setE2k_Carrier_Code(me.down('#filE2kCarrierCode textfield').getValue()) }
        if (me.down('#filVendorEnglishName textfield').getValue() != '') { PgAtt.setVendor_Name_English(me.down('#filVendorEnglishName textfield').getValue()) }
        if (me.down('#filVendorLegalName textfield').getValue() != '') { PgAtt.setVendor_Legal_Name(me.down('#filVendorLegalName textfield').getValue()) }
        if (me.down('#filCarrierBOL clearCombo').getValue() != null) { PgAtt.setMbl_iata_busid(me.down('#filCarrierBOL clearCombo').getValue()) }
        if (me.down('#filReason clearCombo').getValue() != '') { PgAtt.setReason(me.down('#filReason clearCombo').getValue()) }
        if (me.down('#filOriginTp clearCombo').getValue() != '') { PgAtt.setOriginTp(me.down('#filOriginTp clearCombo').getValue()) }
        if (me.down('#filDestTp clearCombo').getValue() != '') { PgAtt.setDestTp(me.down('#filDestTp clearCombo').getValue()) }
        if (me.down('#filMblNbrFlag clearCombo').getValue() != '') { PgAtt.setMblNbrFlag(me.down('#filMblNbrFlag clearCombo').getValue()) }
        if (me.down('#filServiceLevel clearCombo').getValue() != '') { PgAtt.setServiceLevel(me.down('#filServiceLevel clearCombo').getValue()) }
        if (me.down('#filVendorName textfield').getValue() != '') { PgAtt.setVendorName(me.down('#filVendorName textfield').getValue()) }
        if (me.down('#filStartPeriod datefield').getValue() != '' && me.down('#filStartPeriod datefield').getValue() != null) { PgAtt.setStartPeriod(me.down('#filStartPeriod datefield').getValue()) }
        if (me.down('#filEndPeriod datefield').getValue() != '' && me.down('#filEndPeriod datefield').getValue() != null) { PgAtt.setEndPeriod(me.down('#filEndPeriod datefield').getValue()) }
        if (me.down('#filScanType textfield').getValue() != '') { PgAtt.setScanDest(me.down('#filScanType textfield').getValue()) }
        if (me.down('#filPaidStatus textfield').getValue() != '') { PgAtt.setPaidStatus(me.down('#filPaidStatus textfield').getValue()) }


    },
    getAttirbuteFieldValues: function () {
        var me = this;
        me.down('#filDisplayCurr combobox').setValue(PgAtt.getDisplay_currency())
        me.down('#filAccrualFlag combobox').setValue(PgAtt.getAccrual_flag());
        me.down('#filCostType clearCombo').setValue(PgAtt.getCost_type());
        me.down('#filReceivedDate datefield').setValue(PgAtt.getRcvdAtDate());
        var locCode = me.down('#filLocCode clearCombo')
        locCode.setValue(PgAtt.getLocation_code());
        locCode.onChange(PgAtt.getLocation_code());

        var compCode = me.down('#filCompanyCode clearCombo');
        compCode.setValue(PgAtt.getCompany_code());
        compCode.onChange(PgAtt.getCompany_code());

        var countryCode = me.down('#filCountrycode clearCombo');
        countryCode.setValue(PgAtt.getCountry_code());
        countryCode.onChange(PgAtt.getCountry_code());

        var origin = me.down('#filOrigin clearCombo')
        origin.setValue(PgAtt.getOrigin());
        origin.onChange(PgAtt.getOrigin());

        var destination = me.down('#filDestination clearCombo')
        destination.setValue(PgAtt.getDestination());
        destination.onChange(PgAtt.getDestination());

        me.down('#filOrigDest clearCombo').setValue(PgAtt.getOD());

        var vendorCode = me.down('#filVendorCode clearCombo')

        if (PgAtt.getVendor_Name_English() != '') {
            vendorCode.setValue(PgAtt.getVendor_Name_English());
            vendorCode.onChange(PgAtt.getVendor_Name_English());
        }
        else if (PgAtt.getVendor_code() != '') {
            vendorCode.setValue(PgAtt.getVendor_code());
            vendorCode.onChange(PgAtt.getVendor_code());
        }
        else if (PgAtt.getVendor_id() != '') {
            vendorCode.setValue(PgAtt.getVendor_id());
            vendorCode.onChange(PgAtt.getVendor_id());
        }



        me.down('#filVendorId textfield').setValue(PgAtt.getVendor_id());
        me.down('#filServiceCode clearCombo').setValue(PgAtt.getService_code());
        me.down('#filChargeStatus clearCombo').setValue(PgAtt.getCharge_status());
        me.down('#filInvoiceStatus textfield').setValue(PgAtt.getInvoice_status());

        var chargeCode = me.down('#filChargeCode clearCombo')
        var chgCodeVal = PgAtt.getCharge_code();
        if (PgAtt.getCharge_code() == '' || PgAtt.getCharge_code() == null) {
            chgCodeVal = CBOLSinCls.getCharge_Code();
        }
        chargeCode.setValue(chgCodeVal);
        chargeCode.onChange(chgCodeVal);

        me.down('#filCurrencyCode textfield').setValue(PgAtt.getCurrency_code());

        var mblNbr = me.down('#filMBLNumber clearCombo')
        mblNbr.setValue(PgAtt.getMbl_number());
        mblNbr.onChange(PgAtt.getMbl_number());

        me.down('#filCarrierId textfield').setValue(PgAtt.getCarrier_id());

        var shpNbr = me.down('#filShipmentNumber clearCombo')
        if (PgAtt.getShipment_number() != '') {
            shpNbr.setValue(PgAtt.getShipment_number());
            shpNbr.onChange(PgAtt.getShipment_number());
        }

        var invRefNo = me.down('#filInvoiceRefNo clearCombo')
        invRefNo.setValue(PgAtt.getInvRefNo());
        invRefNo.onChange(PgAtt.getInvRefNo());

        me.down('#filInvoiceId textfield').setValue(PgAtt.getInvoice_id());

        var contNbr = me.down('#filContainerNumber clearCombo')
        contNbr.setValue(PgAtt.getContainer_number());
        contNbr.onChange(PgAtt.getContainer_number());

        me.down('#filBatchId textfield').setValue(PgAtt.getInvBatchID());
        me.down('#filStartDate datefield').setValue(PgAtt.getStartDateFilter());
        me.down('#filEndDate datefield').setValue(PgAtt.getEndDateFilter());
        me.down('#filModifiedBy textfield').setValue(PgAtt.getModifiedBy());
        me.down('#filMBLCostBasis clearCombo').setValue(PgAtt.getMbl_cost_basis());
        me.down('#filImageNumber textfield').setValue(PgAtt.getImageNumber());
        me.down('#filE2kCarrierCode textfield').setValue(PgAtt.getE2k_Carrier_Code());
        me.down('#filVendorEnglishName textfield').setValue(PgAtt.getVendor_Name_English());
        me.down('#filVendorLegalName textfield').setValue(PgAtt.getVendor_Legal_Name());
        me.down('#filMblNbrFlag clearCombo').setValue(PgAtt.getMblNbrFlag());
        me.down('#filServiceLevel clearCombo').setValue(PgAtt.getServiceLevel());
        me.down('#filVendorName textfield').setValue(PgAtt.getVendorName());

        var Reason = me.down('#filReason clearCombo')
        Reason.setValue(PgAtt.getReason());
        Reason.onChange(PgAtt.getReason());

        var OriginTp = me.down('#filOriginTp clearCombo')
        OriginTp.setValue(PgAtt.getOriginTp());
        OriginTp.onChange(PgAtt.getOriginTp());

        var DestTp = me.down('#filDestTp clearCombo')
        DestTp.setValue(PgAtt.getDestTp());
        DestTp.onChange(PgAtt.getDestTp());

        var LocCountry = me.down('#filLocCountry clearCombo')
        LocCountry.setValue(PgAtt.getLocCountry());
        LocCountry.onChange(PgAtt.getLocCountry());

        var LocRegion = me.down('#filLocRegion clearCombo')
        LocRegion.setValue(PgAtt.getLocRegion());
        LocRegion.onChange(PgAtt.getLocRegion());

        if (PgAtt.getStartPeriod() == '' && PgAtt.getEndPeriod() == '') {
            PgAtt.setEndPeriod(new Date());
            PgAtt.setStartPeriod(Ext.Date.add(new Date(), Ext.Date.MONTH, -1));
            me.down('#filStartPeriod datefield').setValue(PgAtt.getStartPeriod());
            me.down('#filEndPeriod datefield').setValue(PgAtt.getEndPeriod());
        }
        var carrBOL = me.down('#filCarrierBOL clearCombo')
        carrBOL.setValue(PgAtt.getMbl_iata_busid());
        carrBOL.onChange(PgAtt.getMbl_iata_busid());
    },
    setInvoiceProcessingFields: function () {
        var upsRefTypeName = '', chargeCode = '';
        var me = this;
        var record = '', upsRef = '';
        var pageType = IProcessingSCls.getPageType();
        if (pageType == 'LVB') {
            record = IProcessingSCls.getNewRecDetails();
        } else {
            record = IProcessingSCls.getRecDetails();
        }
        if (record != '' && record != null && me != null && me != undefined) {
            if (pageType == 'Bills') {
                if (!PgAtt.getSearchTextApplied() && PgAtt.getInvRecFlag()) {
                    PgAtt.setSearchTextApplied(false);
                    PgAtt.setInvRecFlag(false);
                    upsRef = record.get("ReferenceFilter").split(',');
                    if (record.get("reference_id") == 1 && upsRef.length == 1) { PgAtt.setShipment_number(record.get("ReferenceFilter")); me.down('#filShipmentNumber clearCombo').setValue(record.get("ReferenceFilter")); me.down('#filShipmentNumber clearCombo').getTrigger('clear').show(); }
                    if (record.get("reference_id") == 2 && upsRef.length == 1) { PgAtt.setMbl_number(record.get("ReferenceFilter")); me.down('#filMBLNumber clearCombo').setValue(record.get("ReferenceFilter")); me.down('#filMBLNumber clearCombo').getTrigger('clear').show(); }
                    if (record.get("reference_id") == 3 && upsRef.length == 1) { PgAtt.setCarrier_id(record.get("ReferenceFilter")); me.down('#filCarrierId textfield').setValue(record.get("ReferenceFilter")); me.down('#filCarrierId textfield').getTrigger('clear').show(); }
                    if (record.get("reference_id") == 4 && upsRef.length == 1) { PgAtt.setContainer_number(record.get("ReferenceFilter")); me.down('#filContainerNumber clearCombo').setValue(record.get("ReferenceFilter")); me.down('#filContainerNumber clearCombo').getTrigger('clear').show(); }
                    if (record.get("reference_id") == 5 && upsRef.length == 1) { PgAtt.setVendor_code(record.get("ReferenceFilter")); me.down('#filVendorCode clearCombo').setValue(record.get("ReferenceFilter")); me.down('#filVendorCode clearCombo').getTrigger('clear').show(); }
                    if (record.get("reference_id") == 6 && upsRef.length == 1) { upsRefTypeName = 'E2k_Carrier_Code'; }
                    if (record.get("reference_id") == 99) { upsRefTypeName = 'ExcelUpload'; }
                    if (record.get("reference_id") == 1) { upsRefTypeName = 'Shipment_Number'; }
                    if (record.get("reference_id") == 2) { upsRefTypeName = 'Mbl_Number'; }
                    if (record.get("reference_id") == 3) { upsRefTypeName = 'Carrier_Id'; }
                    if (record.get("reference_id") == 4) { upsRefTypeName = 'Container_Number'; }
                    if (record.get("reference_id") == 5) { upsRefTypeName = 'Vendor_Code'; }
                    if (record.get("reference_id") == 6) { upsRefTypeName = 'E2k_Carrier_Code'; }
                    if (record.get("reference_id") == 99) { upsRefTypeName = 'ExcelUpload'; }

                    me.down('#filInvoiceId textfield').setValue(record.get("invoice_id"));
                    if (record.get("ReferenceFilter") != '') {
                        me.down('#filReferenceFilter hiddenfield').setValue("Y");
                    }
                    else {
                        me.down('#filReferenceFilter hiddenfield').setValue("N");
                    }
                } else {
                    me.down('#filInvoiceId textfield').setValue(record.get("invoice_id"));
                    me.down('#filReferenceFilter hiddenfield').setValue("N");
                }

            } else if (pageType == 'CbolCC') {
                if (record.get('Type') == 'HBL') {
                    upsRefTypeName = 'Shipment_Number';
                    var shpNbr = me.down('#filShipmentNumber clearCombo');
                    shpNbr.setVisible(true);

                } else {
                    upsRefTypeName = 'Carrier_Bol';
                    chargeCode = me.down('#filChargeCode clearCombo');
                    chargeCode.setVisible(true);
                }

                me.down('#filInvoiceId textfield').setValue(CBOLSinCls.getInvoiceId());
                if (record.get('Type') == 'CBOL') {
                    PgAtt.setCarrier_id(record.get('Carrier_BOL'));
                    me.down('#filCarrierId textfield').setValue(record.get('Carrier_BOL'));
                    chargeCode.setValue(CBOLSinCls.getCharge_Code());
                } else if (record.get('Type') == 'HBL') {
                    PgAtt.setShipment_number(record.get('shipment_number'))
                    me.down('#filShipmentNumber textfield').setValue(record.get('shipment_number'));
                    shpNbr.setValue(record.get('shipment_number'))
                    if (me.down('#filChargeCode clearCombo').getValue() != "") {
                        chargeCode = me.down('#filChargeCode clearCombo');
                        chargeCode.setValue(record.get('Carrier_BOL'));
                    }

                } else {

                    PgAtt.setCarrier_id(PgAtt.getMbl_iata_busid());
                    me.down('#filCarrierId textfield').setValue(CBOLSinCls.getCarrier_Id());
                    if (me.down('#filChargeCode clearCombo').getValue() != "") {
                        PgAtt.setCharge_code(record.get('Carrier_BOL'));
                        chargeCode.setValue(record.get('Carrier_BOL'));
                    }
                }

            } else if (pageType == 'Containers') {
                chargeCode = me.down('#filChargeCode clearCombo');
                if (!CBOLSinCls.getIsChargeCodeRemoved()) {
                    chargeCode.setVisible(true);
                }
                me.down('#filInvoiceId textfield').setValue(CBOLSinCls.getInvoiceId());
                if (record.get('Containers').split(',').length > 1) {
                    me.down('#filReferenceFilter hiddenfield').setValue("Y");
                    upsRefTypeName = 'Containers';
                } else {
                    upsRefTypeName = 'Container_Number';
                    PgAtt.setContainer_number(record.get('Containers'));
                    me.down('#filReferenceFilter hiddenfield').setValue("N");
                    me.down('#filContainerNumber clearCombo').setValue(record.get('Containers'));
                }

                if (record.get('Type') == 'CBOL') {
                    chargeCode.setValue(CBOLSinCls.getCharge_Code());
                } else {
                    PgAtt.setCharge_code(record.get('Carrier_BOL'));
                    chargeCode.setValue(record.get('Carrier_BOL'));
                }

            }
            else if (pageType == 'LVB') {
                if (!PgAtt.getSearchTextApplied() && PgAtt.getInvRecFlag()) {
                    PgAtt.setSearchTextApplied(false);
                    PgAtt.setInvRecFlag(false);
                    record = IProcessingSCls.getNewRecDetails();
                    upsRef = record.ReferenceFilter.split(',');
                    if (record.Reference_id == 1 && upsRef.length == 1) { PgAtt.setShipment_number(record.ReferenceFilter); me.down('#filShipmentNumber clearCombo').setValue(record.ReferenceFilter); me.down('#filShipmentNumber clearCombo').getTrigger('clear').show(); }
                    if (record.Reference_id == 2 && upsRef.length == 1) { PgAtt.setMbl_number(record.ReferenceFilter); me.down('#filMBLNumber clearCombo').setValue(record.ReferenceFilter); me.down('#filMBLNumber clearCombo').getTrigger('clear').show(); }
                    if (record.Reference_id == 3 && upsRef.length == 1) { PgAtt.setCarrier_id(record.ReferenceFilter); me.down('#filCarrierId textfield').setValue(record.ReferenceFilter); me.down('#filCarrierId textfield').getTrigger('clear').show(); }
                    if (record.Reference_id == 4 && upsRef.length == 1) { PgAtt.setContainer_number(record.ReferenceFilter); me.down('#filContainerNumber clearCombo').setValue(record.ReferenceFilter); me.down('#filContainerNumber clearCombo').getTrigger('clear').show(); }
                    if (record.Reference_id == 5 && upsRef.length == 1) { PgAtt.setVendor_code(record.ReferenceFilter); me.down('#filVendorCode clearCombo').setValue(record.ReferenceFilter); me.down('#filVendorCode clearCombo').getTrigger('clear').show(); }
                    if (record.Reference_id == 6 && upsRef.length == 1) { upsRefTypeName = 'E2k_Carrier_Code'; }
                    if (record.Reference_id == 99) { upsRefTypeName = 'ExcelUpload'; }
                    if (record.Reference_id == 1) { upsRefTypeName = 'Shipment_Number'; }
                    if (record.Reference_id == 2) { upsRefTypeName = 'Mbl_Number'; }
                    if (record.Reference_id == 3) { upsRefTypeName = 'Carrier_Id'; }
                    if (record.Reference_id == 4) { upsRefTypeName = 'Container_Number'; }
                    if (record.Reference_id == 5) { upsRefTypeName = 'Vendor_Code'; }
                    if (record.Reference_id == 6) { upsRefTypeName = 'E2k_Carrier_Code'; }
                    if (record.Reference_id == 99) { upsRefTypeName = 'ExcelUpload'; }

                    me.down('#filInvoiceId textfield').setValue(record.Invoice_id);
                    if (record.ReferenceFilter != '') {
                        me.down('#filReferenceFilter hiddenfield').setValue("Y");
                    }
                    else {
                        me.down('#filReferenceFilter hiddenfield').setValue("N");
                    }
                } else {
                    me.down('#filInvoiceId textfield').setValue(record.Invoice_id);
                    me.down('#filReferenceFilter hiddenfield').setValue("N");
                }
            }
            PgAtt.setUpsRefType(upsRefTypeName);
            me.down('#filUPSRefTypeName textfield').setValue(upsRefTypeName);
            me.showHideFilter();
        }
        else {
            alert("Incorrect filter criteria! , Please refresh the page.")
        }
    }
});