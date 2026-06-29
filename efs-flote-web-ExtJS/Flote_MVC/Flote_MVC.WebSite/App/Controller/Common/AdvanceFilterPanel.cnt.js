/* ====================================================================================================
NAME:			[Advance Filter Panel Controller ]
BEHAVIOR:		Advance filter panel for filter criteria.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
05/02/2017        Sudhir Dandale		 Created.
 ======================================================================================================*/

Ext.define('App.Controller.Common.AdvanceFilterPanel', {
    extend: 'Ext.app.Controller',
    refs: [
        { ref: 'Current', selector: 'App-View-Main-TabPanel' },
        { ref: 'FilterPanel', selector: 'App-View-Component-Container-FilterPanelBase' }
    ],
    init: function () {
        var me = this;

        me.control({
            '[xtype="App-View-Component-AdvanceFilter"] #btnCancelAD': {
                click: me.CancelButtonAD
            },
            '[xtype="App-View-Component-AdvanceFilter"] #btnClearAllAD': {
                click: me.ClearAllButtonAD
            },
            '[xtype="App-View-Component-AdvanceFilter"] #btnProcessAD': {
                click: me.ProcessButtonAD
            },
            '[xtype="App-View-Component-AdvanceFilter"]': {
                beforerender: me.BeforeRenderAD
            }
        });

    },
    CancelButtonAD: function CancelButtonAD(me) {
        var filter = this.getActiveFilterPanel();
        if (filter == null) {
            filter = this.getAllFilterPanel()[0];
        }
        filter.down('#msgWarning').hide();
        me.up('window').close();

    },
    ClearAllButtonAD: function ClearAllButtonAD(me) {
        var filter = this.getActiveFilterPanel();
        if (filter == null) {
            filter = this.getAllFilterPanel()[0];
        }
        this.resetAll(me.up('window'));
        filter.down('#msgWarning').hide();
    },
    ProcessButtonAD: function ProcessButtonAD(me) {
        var win = me.up('window');
        win.body.mask('loading the data');
        var filter = this.getActiveFilterPanel();
        if (filter == null) {
            filter = this.getAllFilterPanel()[0];
        }
        filter.getAttirbuteFieldValues();
        var button = filter.down('#ApplyButton');
        button.fireEvent('btnApply');
        setTimeout(function () { win.body.unmask(); me.up('window').close(); }, 100);
    },
    BeforeRenderAD: function BeforeRenderAD(me) {
        me.width = Ext.getBody().getViewSize().width / 100 * 65 + 'px';
        this.showHideFilterAD(me);
    },
    showHideFilterAD: function (me) {
        var tabPanel = this.getActiveCurrent();
        if (tabPanel == null) {
            tabPanel = this.getAllCurrent();
        }
        this.setAttirbuteFieldValuesAD(me);
        var tabName = tabPanel.activeTab.tab.text;

        if (tabName == 'Bills') {
            var subTab = tabPanel.activeTab.activeTab.tab.text;
        }
        var reportTab = tabPanel.down("App-View-Accrual-AccrualsTab")
        var rptTabName = reportTab.activeTab.tab.text;
        if (tabName != '') {
            me.down('#btnProcessAD').show();
            if (tabName) {
                switch (tabName) {
                    case 'Home':
                        break;
                    case 'Location Shipment':

                        me.down('#filCompanyCodeAD clearCombo').setDisabled(true);
                        me.down('#filOrigDestAD clearCombo').setDisabled(true);
                        me.down('#filOriginAD clearCombo').setDisabled(true);
                        me.down('#filDestinationAD clearCombo').setDisabled(true);
                        me.down('#filBatchIdAD textfield').setDisabled(true);
                        me.down('#filMBLCostBasisAD clearCombo').setDisabled(true);
                        me.down('#filChargeCodeAD clearCombo').setDisabled(true);
                        me.down('#filInvoiceStatusAD clearCombo').setDisabled(true);
                        me.down('#filCostTypeAD clearCombo').setDisabled(true);
                        me.down('#filVendorCodeAD clearCombo').setDisabled(true);
                        me.down('#filInvoiceRefNoAD clearCombo').setDisabled(true);
                        me.down('#filE2kCarrierCodeAD textfield').setDisabled(true);

                        break;
                    case 'Location Ocean MBL':

                        me.down('#filCompanyCodeAD clearCombo').setDisabled(true);
                        me.down('#filServiceCodeAD clearCombo').setDisabled(true);
                        me.down('#filReceivedDateAD datefield').setDisabled(true);
                        me.down('#filBatchIdAD textfield').setDisabled(true);
                        me.down('#filChargeCodeAD clearCombo').setDisabled(true);
                        me.down('#filInvoiceStatusAD clearCombo').setDisabled(true);
                        me.down('#filCostTypeAD clearCombo').setDisabled(true);
                        me.down('#filVendorCodeAD clearCombo').setDisabled(true);
                        me.down('#filInvoiceRefNoAD clearCombo').setDisabled(true);
                        me.down('#filE2kCarrierCodeAD textfield').setDisabled(true);
                        break;

                    case 'Bills':
                        me.down('#filCountrycodeAD clearCombo').setDisabled(true);
                        me.down('#filOrigDestAD clearCombo').setDisabled(true);
                        me.down('#filOriginAD clearCombo').setDisabled(true);
                        me.down('#filDestinationAD clearCombo').setDisabled(true);
                        me.down('#filMBLNumberAD clearCombo').setDisabled(true);
                        me.down('#filMBLCostBasisAD clearCombo').setDisabled(true);
                        me.down('#filCarrierBOLAD clearCombo').setDisabled(true);
                        me.down('#filShipmentNumberAD clearCombo').setDisabled(true);
                        me.down('#filContainerNumberAD clearCombo').setDisabled(true);
                        me.down('#filChargeCodeAD clearCombo').setDisabled(true);
                        me.down('#filServiceCodeAD clearCombo').setDisabled(true);
                        me.down('#filChargeStatusAD clearCombo').setDisabled(true);
                        me.down('#filReceivedDateAD datefield').setDisabled(true);
                        me.down('#filCostTypeAD clearCombo').setDisabled(true);
                        me.down('#filE2kCarrierCodeAD textfield').setDisabled(true);
                        if (subTab == 'Payment Details') {
                            me.down('#filBatchIdAD textfield').setDisabled(true);
                        }
                        else {
                            me.down('#filPaidStatusAD').setDisabled(true);
                        }
                        break;
                    case 'Location Vendor':

                        me.down('#filCompanyCodeAD clearCombo').setDisabled(true);
                        me.down('#filCountrycodeAD clearCombo').setDisabled(true);
                        me.down('#filOrigDestAD clearCombo').setDisabled(true);
                        me.down('#filOriginAD clearCombo').setDisabled(true);
                        me.down('#filBatchIdAD textfield').setDisabled(true);
                        me.down('#filDestinationAD clearCombo').setDisabled(true);
                        me.down('#filMBLNumberAD clearCombo').setDisabled(true);
                        me.down('#filMBLCostBasisAD clearCombo').setDisabled(true);
                        me.down('#filCarrierBOLAD clearCombo').setDisabled(true);
                        me.down('#filShipmentNumberAD clearCombo').setDisabled(true);
                        me.down('#filContainerNumberAD clearCombo').setDisabled(true);
                        me.down('#filChargeCodeAD clearCombo').setDisabled(true);
                        me.down('#filServiceCodeAD clearCombo').setDisabled(true);
                        me.down('#filChargeStatusAD clearCombo').setDisabled(true);
                        me.down('#filReceivedDateAD datefield').setDisabled(true);
                        me.down('#filCostTypeAD clearCombo').setDisabled(true);
                        me.down('#filE2kCarrierCodeAD textfield').setDisabled(true);
                        me.down('#filInvoiceStatusAD clearCombo').setDisabled(true);
                        me.down('#filVendorCodeAD clearCombo').setDisabled(true);
                        me.down('#filInvoiceRefNoAD clearCombo').setDisabled(true);

                        break;
                    case 'Vendor Shipment':

                        me.down('#filCompanyCodeAD clearCombo').setDisabled(true);
                        me.down('#filOrigDestAD clearCombo').setDisabled(true);
                        me.down('#filBatchIdAD textfield').setDisabled(true);
                        me.down('#filMBLCostBasisAD clearCombo').setDisabled(true);
                        me.down('#filChargeStatusAD clearCombo').setDisabled(true);
                        me.down('#filE2kCarrierCodeAD textfield').setDisabled(true);
                        me.down('#filInvoiceStatusAD clearCombo').setDisabled(true);
                        me.down('#filInvoiceRefNoAD clearCombo').setDisabled(true);

                        break;
                    case 'Vendors':

                        me.down('#filOrigDestAD clearCombo').setDisabled(true);
                        me.down('#filOriginAD clearCombo').setDisabled(true);
                        me.down('#filBatchIdAD textfield').setDisabled(true);
                        me.down('#filDestinationAD clearCombo').setDisabled(true);
                        me.down('#filMBLNumberAD clearCombo').setDisabled(true);
                        me.down('#filMBLCostBasisAD clearCombo').setDisabled(true);
                        me.down('#filCarrierBOLAD clearCombo').setDisabled(true);
                        me.down('#filShipmentNumberAD clearCombo').setDisabled(true);
                        me.down('#filContainerNumberAD clearCombo').setDisabled(true);
                        me.down('#filChargeCodeAD clearCombo').setDisabled(true);
                        me.down('#filServiceCodeAD clearCombo').setDisabled(true);
                        me.down('#filChargeStatusAD clearCombo').setDisabled(true);
                        me.down('#filReceivedDateAD datefield').setDisabled(true);
                        me.down('#filCostTypeAD clearCombo').setDisabled(true);
                        me.down('#filE2kCarrierCodeAD textfield').setDisabled(true);
                        me.down('#filInvoiceStatusAD clearCombo').setDisabled(true);
                        me.down('#filEndDateAD datefield').setDisabled(true);
                        me.down('#filInvoiceRefNoAD clearCombo').setDisabled(true);
                        break;

                    case 'Accruals':

                        me.down('#filOrigDestAD clearCombo').setDisabled(true);
                        me.down('#filOriginAD clearCombo').setDisabled(true);
                        me.down('#filBatchIdAD textfield').setDisabled(true);
                        me.down('#filDestinationAD clearCombo').setDisabled(true);
                        me.down('#filMBLNumberAD clearCombo').setDisabled(true);
                        me.down('#filMBLCostBasisAD clearCombo').setDisabled(true);
                        me.down('#filCarrierBOLAD clearCombo').setDisabled(true);
                        me.down('#filContainerNumberAD clearCombo').setDisabled(true);
                        me.down('#filChargeStatusAD clearCombo').setDisabled(true);
                        me.down('#filCostTypeAD clearCombo').setDisabled(true);
                        me.down('#filE2kCarrierCodeAD textfield').setDisabled(true);
                        me.down('#filInvoiceStatusAD clearCombo').setDisabled(true);
                        me.down('#filEndDateAD datefield').setDisabled(true);
                        me.down('#filInvoiceRefNoAD clearCombo').setDisabled(true);
                        me.down('#filStartDateAD datefield').setDisabled(true);
                        me.down('#filVendorCodeAD clearCombo').setDisabled(true);
                        switch (rptTabName) {
                            case 'Accrual Monthly Journal Entry':
                                me.down('#filShipmentNumberAD clearCombo').setDisabled(true);
                                me.down('#filChargeCodeAD clearCombo').setDisabled(true);
                                me.down('#filServiceCodeAD clearCombo').setDisabled(true);
                                me.down('#filReceivedDateAD datefield').setDisabled(true);
                                break;
                            case 'Accrual Monthly Details':
                                break;
                            case 'Accrual Accuracy Report':
                                me.down('#filShipmentNumberAD clearCombo').setDisabled(true);
                                me.down('#filChargeCodeAD clearCombo').setDisabled(true);
                                me.down('#filServiceCodeAD clearCombo').setDisabled(true);
                                me.down('#filReceivedDateAD datefield').setDisabled(true);
                                me.down('#filCompanyCodeAD clearCombo').setDisabled(true);
                                me.down('#filCountrycodeAD clearCombo').setDisabled(true);
                                break;

                            default:
                                break;
                        }
                        break;
                    case 'Invoice Processing':
                        me.down('#filCompanyCodeAD clearCombo').setDisabled(true);
                        me.down('#filOrigDestAD clearCombo').setDisabled(true);
                        me.down('#filBatchIdAD textfield').setDisabled(true);
                        me.down('#filMBLCostBasisAD clearCombo').setDisabled(true);
                        me.down('#filChargeStatusAD clearCombo').setDisabled(true);
                        me.down('#filE2kCarrierCodeAD textfield').setDisabled(true);
                        me.down('#filInvoiceStatusAD clearCombo').setDisabled(true);
                        me.down('#filVendorCodeAD clearCombo').setDisabled(true);
                        me.down('#filLocCodeAD clearCombo').setDisabled(true);
                        break;
                    default:
                        break;
                }
            }
        }
    },
    setAttirbuteFieldValuesAD: function (me) {

        if (PgAtt.getCost_type() != '') { me.down('#filCostTypeAD clearCombo').setValue(PgAtt.getCost_type()); }
        if (PgAtt.getLocation_code() != '') { me.down('#filLocCodeAD clearCombo').setValue(PgAtt.getLocation_code()); }
        if (PgAtt.getRcvdAtDate() != '') { me.down('#filReceivedDateAD datefield').setValue(PgAtt.getRcvdAtDate()); }
        if (PgAtt.getCompany_code() != '') {
            me.down('#filCompanyCodeAD clearCombo').setValue(PgAtt.getCompany_code());
        }
        if (PgAtt.getCountry_code() != '') {
            me.down('#filCountrycodeAD clearCombo').setValue(PgAtt.getCountry_code());
        }
        if (PgAtt.getOrigin() != '') { me.down('#filOriginAD clearCombo').setValue(PgAtt.getOrigin()); }
        if (PgAtt.getDestination != '') { me.down('#filDestinationAD clearCombo').setValue(PgAtt.getDestination()) }
        if (PgAtt.getOD() != '') { me.down('#filOrigDestAD clearCombo').setValue(PgAtt.getOD()) }
        if (PgAtt.getVendor_code() != '') { me.down('#filVendorCodeAD clearCombo').setValue(PgAtt.getVendor_code()) }
        if (PgAtt.getService_code() != '') { me.down('#filServiceCodeAD clearCombo').setValue(PgAtt.getService_code()) }
        if (PgAtt.getCharge_status() != '') { me.down('#filChargeStatusAD clearCombo').setValue(PgAtt.getCharge_status()) }
        if (PgAtt.getInvoice_status() != '') { me.down('#filInvoiceStatusAD textfield').setValue(PgAtt.getInvoice_status()) }
        if (PgAtt.getCharge_code() != '') { me.down('#filChargeCodeAD clearCombo').setValue(PgAtt.getCharge_code()) }
        if (PgAtt.getMbl_number() != '') { me.down('#filMBLNumberAD clearCombo').setValue(PgAtt.getMbl_number()) }
        if (PgAtt.getShipment_number() != '') { me.down('#filShipmentNumberAD clearCombo').setValue(PgAtt.getShipment_number()) }
        if (PgAtt.getInvRefNo() != '') { me.down('#filInvoiceRefNoAD clearCombo').setValue(PgAtt.getInvRefNo()) }
        if (PgAtt.getContainer_number() != '') { me.down('#filContainerNumberAD clearCombo').setValue(PgAtt.getContainer_number()) }
        if (PgAtt.getInvBatchID() != '') { me.down('#filBatchIdAD textfield').setValue(PgAtt.getInvBatchID()) }
        if (PgAtt.getStartDateFilter() != '') { me.down('#filStartDateAD datefield').setValue(PgAtt.getStartDateFilter()) }
        if (PgAtt.getEndDateFilter() != '') { me.down('#filEndDateAD datefield').setValue(PgAtt.getEndDateFilter()) }
        if (PgAtt.getMbl_cost_basis() != '') { me.down('#filMBLCostBasisAD clearCombo').setValue(PgAtt.getMbl_cost_basis()) }
        if (PgAtt.getE2k_Carrier_Code() != '') { me.down('#filE2kCarrierCodeAD textfield').setValue(PgAtt.getE2k_Carrier_Code()) }
        if (PgAtt.getMbl_iata_busid() != '') { me.down('#filCarrierBOLAD textfield').setValue(PgAtt.getMbl_iata_busid()) }
        if (PgAtt.getPaidStatus() != '') { me.down('#filPaidStatusAD textfield').setValue(PgAtt.getPaidStatus()) }

    },
    resetAll: function (me) {
        me.down('#filCompanyCodeAD clearCombo').setValue('');
        me.down('#filCountrycodeAD clearCombo').setValue('');
        me.down('#filLocCodeAD clearCombo').setValue('');
        me.down('#filOriginAD clearCombo').setValue('');
        me.down('#filDestinationAD clearCombo').setValue('');
        me.down('#filBatchIdAD textfield').setValue('');
        me.down('#filStartDateAD datefield').setValue('');
        me.down('#filMBLCostBasisAD clearCombo').setValue('All');
        me.down('#filMBLNumberAD clearCombo').setValue('');
        me.down('#filContainerNumberAD clearCombo').setValue('');
        me.down('#filShipmentNumberAD clearCombo').setValue('');
        me.down('#filCarrierBOLAD clearCombo').setValue('');
        me.down('#filChargeCodeAD clearCombo').setValue('');
        me.down('#filInvoiceStatusAD clearCombo').setValue('All');
        me.down('#filEndDateAD datefield').setValue('');
        me.down('#filServiceCodeAD clearCombo').setValue('All');
        me.down('#filChargeStatusAD clearCombo').setValue('All');
        me.down('#filCostTypeAD clearCombo').setValue('All');
        me.down('#filVendorCodeAD clearCombo').setValue('');
        me.down('#filInvoiceRefNoAD clearCombo').setValue('');
        me.down('#filReceivedDateAD datefield').setValue('');
        me.down('#filOrigDestAD clearCombo').setValue('All');
        me.down('#filReceivedDateAD datefield').setValue('');
        me.down('#filE2kCarrierCodeAD textfield').setValue('');
        me.down('#filPaidStatusAD textfield').setValue('Paid');


        PgAtt.setCost_type('All');
        PgAtt.setLocation_code('');
        PgAtt.setRcvdAtDate('');
        PgAtt.setCompany_code('');
        PgAtt.setCountry_code('');
        PgAtt.setOrigin('');
        PgAtt.setDestination('');
        PgAtt.setOD('All');
        PgAtt.setVendor_code('');
        PgAtt.setService_code('All');
        PgAtt.setCharge_status('All');
        PgAtt.setInvoice_status('');
        PgAtt.setCharge_code('');
        PgAtt.setMbl_number('');
        PgAtt.setShipment_number('');
        PgAtt.setInvRefNo('');
        PgAtt.setInvoice_id('0');
        PgAtt.setContainer_number('');
        PgAtt.setInvBatchID('');
        PgAtt.setStartDateFilter('');
        PgAtt.setEndDateFilter('');
        PgAtt.setMbl_cost_basis('All');
        PgAtt.setE2k_Carrier_Code('');
        PgAtt.setMbl_iata_busid('');
        PgAtt.setPaidStatus('Paid');
        PgAtt.setVendor_code(null);

    }
});