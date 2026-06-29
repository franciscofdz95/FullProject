/* ====================================================================================================
NAME:			[Filter Criteria Pop up]
BEHAVIOR:		Shows all the filter criteria for invoice processing window.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/26/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.View.Component.FilterFieldsPopUp', {
    extend: 'App.View.Component.Container.FilterPanelBase',
    alias: 'widget.App-View-Component-FilterFieldsPopUp',
    title: '<Div style="font-weight:bold; font-size:12px; color:white;">Filter Criteria</div>',
    itemId: 'FilterFieldsPopUpId',
    layout: 'vbox',
    autoScroll: true,
    layout: {
        type: 'table',
        columns: 2
    },
    rowData: '',
    border: false,
    items: [

            { xtype: 'label', width: '180px', text: 'Filter Criteria', style: 'color:#1D598E;font-weight:bold; font-size:12px;', margin: '2 2 2 2', itemId: "filCriteriaPop" },
            { xtype: 'label', text: '', margin: '2 2 2 2', itemId: "filEmptyPop" },
            { xtype: 'App-View-Component-Filter-AcctYear', margin: '2 2 2 2', itemId: "filAcctYearPop" },
            { xtype: 'App-View-Component-Filter-AcctMon', margin: '2 2 2 2', itemId: "filAcctMonPop" },
            { xtype: 'App-View-Component-Filter-DisplayCurr', margin: '2 2 2 2', itemId: "filDisplayCurrPop" },
            { xtype: 'App-View-Component-Filter-AccrualFlag', margin: '2 2 2 2', itemId: "filAccrualFlagPop" },
            { xtype: 'App-View-Component-Filter-LocType', margin: '2 2 2 2', itemId: "filLocTypePop" },
            { xtype: 'App-View-Component-Filter-LocCode', margin: '2 2 2 2', itemId: "filLocCodePop", readOnly: true },
            { xtype: 'App-View-Component-Filter-UPSRefTypeName', margin: '2 2 2 2', hidden: false, itemId: "filUPSRefTypeNamePop" },
            { xtype: 'App-View-Component-Filter-CompanyCode', hidden: true, margin: '2 2 2 2', itemId: "filCompanyCodePop" },
            { xtype: 'App-View-Component-Filter-Country', hidden: true, margin: '2 2 2 2', itemId: "filCountrycodePop" },
            { xtype: 'App-View-Component-Filter-ReceivedDate', hidden: true, margin: '2 2 2 2', itemId: "filReceivedDatePop" },
            { xtype: 'App-View-Component-Filter-VendorCode', hidden: true, margin: '2 2 2 2', itemId: "filVendorCodePop" },
            { xtype: 'App-View-Component-Filter-Origin', hidden: true, margin: '2 2 2 2', itemId: "filOriginPop" },
            { xtype: 'App-View-Component-Filter-Destination', hidden: true, margin: '2 2 2 2', itemId: "filDestinationPop" },
            { xtype: 'App-View-Component-Filter-ServiceCode', hidden: true, margin: '2 2 2 2', itemId: "filServiceCodePop" },
            { xtype: 'App-View-Component-Filter-ChargeCode', hidden: true, margin: '2 2 2 2', itemId: "filChargeCodePop" },
            { xtype: 'App-View-Component-Filter-MBLNumber', hidden: true, margin: '2 2 2 2', itemId: "filMBLNumberPop" },
            { xtype: 'App-View-Component-Filter-CarrierId', hidden: true, margin: '2 2 2 2', itemId: "filCarrierIdPop" },
            { xtype: 'App-View-Component-Filter-ShipmentNumber', hidden: true, margin: '2 2 2 2', itemId: "filShipmentNumberPop" },
            { xtype: 'App-View-Component-Filter-InvoiceId', hidden: true, margin: '2 2 2 2', itemId: "filInvoiceIdPop" },
            { xtype: 'App-View-Component-Filter-ContainerNumber', hidden: true, margin: '2 2 2 2', itemId: "filContainerNumberPop" },
            { xtype: 'App-View-Component-Filter-CostType', hidden: true, margin: '2 2 2 2', itemId: "filCostTypePop" },
            { xtype: 'App-View-Component-Filter-StartDate', hidden: true, margin: '2 2 2 2', itemId: "filStartDatePop" },
            { xtype: 'App-View-Component-Filter-EndDate', hidden: true, margin: '2 2 2 2', itemId: "filEndDatePop" },
            { xtype: 'App-View-Component-Filter-ReferenceFilter', value: '', itemId: "filReferenceFilterPop" },
            {
                xtype: 'panel',
                layout: 'hbox',
                baseCls: 'UPS_Brown_1',
                itemId: 'filButtonsPop',
                items: [{ xtype: 'textfield', margin: '5 5 5 5', inputwidth: 150, width: '100px', itemId: 'searchTextIdPop', enableKeyEvents: true },
                        { xtype: 'button', itemId: 'ApplyButtonPop', cls: 'btn', text: '<div style="font-weight: bold; color:white;">Go</div>', margin: '5 5 5 5' },
                         {
                             xtype: 'button', cls: 'btn', itemId: 'btnAdvancePop', margin: '5 5 5 5', text: '...', listeners: {
                                 click: function () {
                                     Ext.widget('App-View-Component-AdvanceFilter').showHideFilterAD('PopUp');
                                 }
                             }
                         }
                ]
            },
            { xtype: 'label', itemId: 'msgWarningPop', hidden: true, html: '<Div style= "background-color : white;color:red;font-weight:bold; font-size:12px;border: 1px solid white;border-color:#FFFFFF;">Filters changed but not applied!<BR> Click Go to Apply.</Div>', margin: '5 5 5 5' }

    ],
    setAttirbuteFieldValuesPop: function () {
        var me = this;
        me.down('#filAcctYearPop combobox').setDisabled(true);
        me.down('#filAcctMonPop combobox').setDisabled(true);
        me.down('#filLocCodePop clearCombo').setDisabled(true);


        if (Ext.ComponentQuery.query('#filAcctYear combobox')[0].getValue() != '') { me.down('#filAcctYearPop combobox').setValue(Ext.ComponentQuery.query('#filAcctYear combobox')[0].getValue()) }
        if (Ext.ComponentQuery.query('#filAcctMon combobox')[0].getValue() != '') { me.down('#filAcctMonPop combobox').setValue(Ext.ComponentQuery.query('#filAcctMon combobox')[0].getValue()) }
        if (Ext.ComponentQuery.query('#filDisplayCurr combobox')[0].getValue() != '') { me.down('#filDisplayCurrPop combobox').setValue(Ext.ComponentQuery.query('#filDisplayCurr combobox')[0].getValue()) }
        if (Ext.ComponentQuery.query('#filAccrualFlag combobox')[0].getValue() != '') { me.down('#filAccrualFlagPop combobox').setValue(Ext.ComponentQuery.query('#filAccrualFlag combobox')[0].getValue()) }
        if (Ext.ComponentQuery.query('#filCostType clearCombo')[0].getValue() != 'All') { me.down('#filCostTypePop clearCombo').setValue(Ext.ComponentQuery.query('#filCostType clearCombo')[0].getValue()) }
        if (Ext.ComponentQuery.query('#filLocType combobox')[0].getValue() != '') { me.down('#filLocTypePop combobox').setValue(Ext.ComponentQuery.query('#filLocType combobox')[0].getValue()) }
        if (Ext.ComponentQuery.query('#filLocCode clearCombo')[0].getValue() != '') { me.down('#filLocCodePop clearCombo').setValue(Ext.ComponentQuery.query('#filLocCode clearCombo')[0].getValue()) }
        if (Ext.ComponentQuery.query('#filReceivedDate datefield')[0].getValue() != '') { me.down('#filReceivedDatePop datefield').setValue(Ext.ComponentQuery.query('#filReceivedDate datefield')[0].getValue()) }
        if (Ext.ComponentQuery.query('#filCompanyCode clearCombo')[0].getValue() != '') { me.down('#filCompanyCodePop clearCombo').setValue(Ext.ComponentQuery.query('#filCompanyCode clearCombo')[0].getValue()) }
        if (Ext.ComponentQuery.query('#filCountrycode clearCombo')[0].getValue() != '') { me.down('#filCountrycodePop clearCombo').setValue(Ext.ComponentQuery.query('#filCountrycode clearCombo')[0].getValue()) }
        if (Ext.ComponentQuery.query('#filOrigin clearCombo')[0].getValue() != '') { me.down('#filOriginPop clearCombo').setValuesetOrigin(Ext.ComponentQuery.query('#filOrigin clearCombo')[0].getValue()) }
        if (Ext.ComponentQuery.query('#filDestination clearCombo')[0].getValue() != '') { me.down('#filDestinationPop clearCombo').setValue(Ext.ComponentQuery.query('#filDestination clearCombo')[0].getValue()) }
        if (Ext.ComponentQuery.query('#filVendorCode clearCombo')[0].getValue() != '') { me.down('#filVendorCodePop clearCombo').setValue(Ext.ComponentQuery.query('#filVendorCode clearCombo')[0].getValue()) }
        if (Ext.ComponentQuery.query('#filServiceCode clearCombo')[0].getValue() != 'All') { me.down('#filServiceCodePop clearCombo').setValue(Ext.ComponentQuery.query('#filServiceCode clearCombo')[0].getValue()) }
        if (Ext.ComponentQuery.query('#filChargeCode clearCombo')[0].getValue() != '') { me.down('#filChargeCodePop clearCombo').setValue(Ext.ComponentQuery.query('#filChargeCode clearCombo')[0].getValue()) }
        if (Ext.ComponentQuery.query('#filMBLNumber clearCombo')[0].getValue() != '') { me.down('#filMBLNumberPop clearCombo').setValue(Ext.ComponentQuery.query('#filMBLNumber clearCombo')[0].getValue()) }
        if (Ext.ComponentQuery.query('#filCarrierId textfield')[0].getValue() != '') { me.down('#filCarrierIdPop textfield').setValue(Ext.ComponentQuery.query('#filCarrierId textfield')[0].getValue()) }
        if (Ext.ComponentQuery.query('#filShipmentNumber clearCombo')[0].getValue() != '') { me.down('#filShipmentNumberPop clearCombo').setValue(Ext.ComponentQuery.query('#filShipmentNumber clearCombo')[0].getValue()) }
        if (Ext.ComponentQuery.query('#filInvoiceId textfield')[0].getValue() != '0') { me.down('#filInvoiceIdPop textfield').setValue(Ext.ComponentQuery.query('#filInvoiceId textfield')[0].getValue()) }
        else { me.down('#filInvoiceIdPop textfield').setValue(PgAtt.getInvoice_id()) }
        if (Ext.ComponentQuery.query('#filContainerNumber clearCombo')[0].getValue() != '') { me.down('#filContainerNumberPop clearCombo').setValue(Ext.ComponentQuery.query('#filContainerNumber clearCombo')[0].getValue()) }
        if (PgAtt.getStartDateFilter() != '' && PgAtt.getStartDateFilter() != null) { me.down('#filStartDatePop datefield').setValue(Ext.ComponentQuery.query('#filStartDate datefield')[0].getValue()) }
        if (PgAtt.getEndDateFilter() != '' && PgAtt.getEndDateFilter() != null) { me.down('#filEndDatePop datefield').setValue(Ext.ComponentQuery.query('#filEndDate datefield')[0].getValue()) }
        if (PgAtt.getReferenceFilter() != '') {
            me.down('#filReferenceFilterPop hiddenfield').setValue(PgAtt.getReferenceFilter());
        }

    },
    initComponent: function () {
        this.callParent(arguments);
        this.setAttirbuteFieldValuesPop();
    },
    listeners: {
        afterrender: function () {
            var upsRefTypeName = '';
            var me = this;
            var record = me.rowData;
            if (record == '' || record == null) {
                var record = me.up('window').rec;
            }
            if (record != '' && record != null && me != null && me != undefined) {
                var pageType = record.get('pageType');
                if (pageType == 'Bills') {

                    var upsRef = record.get("ReferenceFilter").split(',');
                    if (record.get("reference_id") == 1 && upsRef.length == 1) { PgAtt.setShipment_number(record.get("ReferenceFilter")); me.down('#filShipmentNumberPop clearCombo').setValue(record.get("ReferenceFilter")); }
                    if (record.get("reference_id") == 2 && upsRef.length == 1) { PgAtt.setMbl_number(record.get("ReferenceFilter")); me.down('#filMBLNumberPop clearCombo').setValue(record.get("ReferenceFilter")); }
                    if (record.get("reference_id") == 3 && upsRef.length == 1) { PgAtt.setCarrier_id(record.get("ReferenceFilter")); me.down('#filCarrierIdPop textfield').setValue(record.get("ReferenceFilter")); }
                    if (record.get("reference_id") == 4 && upsRef.length == 1) { PgAtt.setContainer_number(record.get("ReferenceFilter")); me.down('#filContainerNumberPop clearCombo').setValue(record.get("ReferenceFilter")); }
                    if (record.get("reference_id") == 5 && upsRef.length == 1) { PgAtt.setVendor_code(record.get("ReferenceFilter")); me.down('#filVendorCodePop clearCombo').setValue(record.get("ReferenceFilter")); }
                    if (record.get("reference_id") == 6 && upsRef.length == 1) { upsRefTypeName = 'E2k_Carrier_Code'; }
                    if (record.get("reference_id") == 99) { upsRefTypeName = 'ExcelUpload'; }

                    if (record.get("reference_id") == 1) { upsRefTypeName = 'Shipment_Number'; }
                    if (record.get("reference_id") == 2) { upsRefTypeName = 'Mbl_Number'; }
                    if (record.get("reference_id") == 3) { upsRefTypeName = 'Carrier_Id'; }
                    if (record.get("reference_id") == 4) { upsRefTypeName = 'Container_Number'; }
                    if (record.get("reference_id") == 5) { upsRefTypeName = 'Vendor_Code'; }
                    if (record.get("reference_id") == 6) { upsRefTypeName = 'E2k_Carrier_Code'; }
                    if (record.get("reference_id") == 99) { upsRefTypeName = 'ExcelUpload'; }

                    me.down('#filInvoiceIdPop textfield').setValue(record.get("invoice_id"));
                    if (record.get("ReferenceFilter") != '') {
                        me.down('#filReferenceFilterPop hiddenfield').setValue("Y");
                    }
                    else {
                        me.down('#filReferenceFilterPop hiddenfield').setValue("N");
                    }

                } else if (pageType == 'CbolCC') {
                    upsRefTypeName = 'Carrier_Bol';
                    var chargeCode = me.down('#filChargeCodePop clearCombo');
                    chargeCode.setVisible(true);

                    me.down('#filInvoiceIdPop textfield').setValue(CBOLSinCls.getInvoiceId());
                    if (record.get('Type') == 'CBOL') {
                        PgAtt.setCarrier_id(record.get('Carrier_BOL'));
                        me.down('#filCarrierIdPop textfield').setValue(record.get('Carrier_BOL'));
                        chargeCode.setValue(CBOLSinCls.getCharge_Code());
                    } else {
                        PgAtt.setCarrier_id(PgAtt.getMbl_iata_busid());
                        PgAtt.setCharge_code(record.get('Carrier_BOL'));
                        me.down('#filCarrierIdPop textfield').setValue(CBOLSinCls.getCarrier_Id());
                        chargeCode.setValue(record.get('Carrier_BOL'));
                    }

                } else if (pageType == 'Containers') {
                    var chargeCode = me.down('#filChargeCodePop clearCombo');
                    chargeCode.setVisible(true);
                    upsRefTypeName = 'ExcelUpload';
                    me.down('#filInvoiceIdPop textfield').setValue(CBOLSinCls.getInvoiceId());
                    if (record.get('Containers').split(',').length > 1) {
                        me.down('#filReferenceFilterPop hiddenfield').setValue("Y");
                        upsRefTypeName = 'Containers';
                    } else {
                        upsRefTypeName = 'Container_Number';
                        PgAtt.setContainer_number(record.get('Containers'));
                        me.down('#filReferenceFilterPop hiddenfield').setValue("N");
                        me.down('#filContainerNumberPop clearCombo').setValue(record.get('Containers'));
                    }

                    if (record.get('Type') == 'CBOL') {
                        chargeCode.setValue(CBOLSinCls.getCharge_Code());
                    } else {
                        PgAtt.setCharge_code(record.get('Carrier_BOL'));
                        chargeCode.setValue(record.get('Carrier_BOL'));

                    }

                }

                me.down('#filUPSRefTypeNamePop textfield').setValue(upsRefTypeName);
                me.showHideFilter();
            }
            else {
                alert("Incorrect filter criteria! , Please refresh the page.")
            }
        }
    },
    showHideFilter: function () {        

        var baseRegex = '/|filCriteriaPop|filEmptyPop|filButtonsPop|filDisplayCurrPop|filAcctYearPop|filAcctMonPop|filLocTypePop|filLocCodePop|filAccrualFlagPop|filUPSRefTypeNamePop';

        if (PgAtt.getRcvdAtDate() != null && PgAtt.getRcvdAtDate() != '') { baseRegex = baseRegex + '|filReceivedDatePop'; }
        if (PgAtt.getCountry_code() != '') { baseRegex = baseRegex + '|filCountrycodePop'; }
        if (PgAtt.getService_code() != 'All') { baseRegex = baseRegex + '|filServiceCodePop'; }        
        if (PgAtt.getMbl_number() != '') { baseRegex = baseRegex + '|filMBLNumberPop'; }
        if (PgAtt.getContainer_number() != '') { baseRegex = baseRegex + '|filContainerNumberPop'; }
        if (PgAtt.getShipment_number() != '') { baseRegex = baseRegex + '|filShipmentNumberPop'; }
        if (PgAtt.getStartDateFilter() != null && PgAtt.getStartDateFilter() != '') { baseRegex = baseRegex + '|filStartDatePop'; }
        if (PgAtt.getEndDateFilter() != null && PgAtt.getEndDateFilter() != '') { baseRegex = baseRegex + '|filEndDatePop'; }
        if (PgAtt.getCarrier_id() != '') { baseRegex = baseRegex + '|filCarrierIdPop'; }
        if (PgAtt.getOrigin() != '') { baseRegex = baseRegex + '|filOriginPop'; }
        if (PgAtt.getDestination() != '') { baseRegex = baseRegex + '|filDestinationPop'; }        
        if (PgAtt.getInvoice_id() != "0") { baseRegex = baseRegex + '|filInvoiceIdPop'; }
        if (PgAtt.getCompany_code() != '') { baseRegex = baseRegex + '|filCompanyCodePop'; }        
        if (PgAtt.getVendor_code() != '' || PgAtt.getVendor_id() != '') { baseRegex = baseRegex + '|filVendorCodePop'; }
        if (PgAtt.getCost_type() != 'All') { baseRegex = baseRegex + '|filCostTypePop'; }
        if (PgAtt.getCompany_code() != '') { baseRegex = baseRegex + '|filCompanyCodePop'; }
        if (PgAtt.getCharge_code() != '' || CBOLSinCls.getCharge_Code() != '') { baseRegex = baseRegex + '|filChargeCodePop'; }
        if (PgAtt.getReferenceFilter() != '') { baseRegex = baseRegex + '|filReferenceFilterPop'; }




        var regex = new RegExp(baseRegex + '|/', 'i');

        for (i = 0; i < this.items.length; i++) {
            if (regex.test(this.items.items[i].itemId)) {                
                this.items.items[i].setVisible(true);
            }
            else { this.items.items[i].setVisible(false); }
        }
    },
    getAttirbuteFieldValues: function () {
        var me = this;

        me.down('#filDisplayCurrPop combobox').setValue(PgAtt.getDisplay_currency())
        me.down('#filAccrualFlagPop combobox').setValue(PgAtt.getAccrual_flag());
        me.down('#filCostTypePop clearCombo').setValue(PgAtt.getCost_type());
        me.down('#filLocCodePop clearCombo').setValue(PgAtt.getLocation_code());
        me.down('#filReceivedDatePop datefield').setValue(PgAtt.getRcvdAtDate());             

        var countryCode = me.down('#filCountrycodePop clearCombo');
        countryCode.setValue(PgAtt.getCountry_code());
        countryCode.onChange(PgAtt.getCountry_code());

        var origin = me.down('#filOriginPop clearCombo')
        origin.setValue(PgAtt.getOrigin());
        origin.onChange(PgAtt.getOrigin());

        var destination = me.down('#filDestinationPop clearCombo')
        destination.setValue(PgAtt.getDestination());
        destination.onChange(PgAtt.getDestination());               

        var vendorCode = me.down('#filVendorCodePop clearCombo')
        vendorCode.setValue(PgAtt.getVendor_code());
        vendorCode.onChange(PgAtt.getVendor_code());

        me.down('#filServiceCodePop clearCombo').setValue(PgAtt.getService_code());        

        var chargeCode = me.down('#filChargeCodePop clearCombo')
        if (PgAtt.getCharge_code() != '') {
            chargeCode.setValue(PgAtt.getCharge_code());
            chargeCode.onChange(PgAtt.getCharge_code());
        } else {
            chargeCode.setValue(CBOLSinCls.getCharge_Code());
            chargeCode.onChange(CBOLSinCls.getCharge_Code());
        }        

        var mblNbr = me.down('#filMBLNumberPop clearCombo')
        mblNbr.setValue(PgAtt.getMbl_number());
        mblNbr.onChange(PgAtt.getMbl_number());

        me.down('#filCarrierIdPop textfield').setValue(PgAtt.getCarrier_id());

        var shpNbr = me.down('#filShipmentNumberPop clearCombo')
        shpNbr.setValue(PgAtt.getShipment_number());
        shpNbr.onChange(PgAtt.getShipment_number());
        

        me.down('#filInvoiceIdPop textfield').setValue(PgAtt.getInvoice_id());

        var contNbr = me.down('#filContainerNumberPop clearCombo')
        contNbr.setValue(PgAtt.getContainer_number());
        contNbr.onChange(PgAtt.getContainer_number());
       
        me.down('#filStartDatePop datefield').setValue(PgAtt.getStartDateFilter());
        me.down('#filEndDatePop datefield').setValue(PgAtt.getEndDateFilter());        
    }

});