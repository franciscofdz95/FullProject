/* ====================================================================================================
NAME:			[Advance Filter Criteria Window]
BEHAVIOR:		Filters the data based on selected filter criteria.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/26/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.View.Component.AdvanceFilter', {
    extend: 'Ext.window.Window',
    alias: 'widget.App-View-Component-AdvanceFilter',
    title: '<div style="font-weight: bold; ">Advanced Filter Panel</div>',
    border: true,
    modal: true,
    autoScroll: true,
    pageName: '',
    defaults: {
        anchor: '100%',
        labelWidth: 100
    },
    items: [
        {
            xtype: 'container',
            itemId: "panel4",
            width: '100%',
            autoScroll: true,
            border: 0,
            baseCls: 'UPS_Greenish_1',
            layout: 'hbox',
            items: [
                {
                    xtype: 'container',
                    itemId: "panel1",
                    margin: '5 5 5 5',
                    layout: 'vbox',
                    baseCls: ' UPS_Greenish_1',
                    border: 0,
                    items: [
                        { xtype: 'App-View-Component-Filter-Country', margin: '5 5 5 5', itemId: "filCountrycodeAD", width: 300 },
                        { xtype: 'App-View-Component-Filter-CompanyCode', margin: '5 5 5 5', itemId: "filCompanyCodeAD", width: 300 },
                        { xtype: 'App-View-Component-Filter-LocCode', margin: '5 5 5 5', itemId: "filLocCodeAD", width: 300 },
                        { xtype: 'App-View-Component-Filter-Origin', margin: '5 5 5 5', itemId: "filOriginAD", width: 300 },
                        { xtype: 'App-View-Component-Filter-Destination', margin: '5 5 5 5', itemId: "filDestinationAD", width: 300 },
                        { xtype: 'App-View-Component-Filter-BatchId', margin: '5 5 5 5', itemId: "filBatchIdAD", width: 300 },
                        { xtype: 'App-View-Component-Filter-StartDate', margin: '5 5 5 5', itemId: "filStartDateAD", width: 300 },
                        { xtype: 'App-View-Component-Filter-MBLCostBasis', margin: '5 5 5 5', itemId: "filMBLCostBasisAD", width: 300 }

                    ]
                },
                {
                    xtype: 'container',
                    itemId: "panel2",
                    layout: 'vbox',
                    margin: '5 5 5 5',
                    baseCls: ' UPS_Greenish_1',
                    border: 0,
                    items: [
                        { xtype: 'App-View-Component-Filter-MBLNumber', margin: '5 5 5 5', itemId: "filMBLNumberAD", width: 300 },
                        { xtype: 'App-View-Component-Filter-ContainerNumber', margin: '5 5 5 5', itemId: "filContainerNumberAD", width: 300 },
                        { xtype: 'App-View-Component-Filter-ShipmentNumber', margin: '5 5 5 5', itemId: "filShipmentNumberAD", width: 300 },
                        { xtype: 'App-View-Component-Filter-CarrierBOL', margin: '5 5 5 5', itemId: "filCarrierBOLAD", width: 300 },
                        { xtype: 'App-View-Component-Filter-ChargeCode', margin: '5 5 5 5', itemId: "filChargeCodeAD", width: 300 },
                        { xtype: 'App-View-Component-Filter-BillStatus', margin: '5 5 5 5', itemId: "filInvoiceStatusAD", width: 300 },
                        { xtype: 'App-View-Component-Filter-EndDate', margin: '5 5 5 5', itemId: "filEndDateAD", width: 300 },
                        { xtype: 'App-View-Component-Filter-PaidStatus', margin: '5 5 5 5', itemId: "filPaidStatusAD", width: 300 },
                    ]
                },
                {
                    xtype: 'container',
                    itemId: "panel3",
                    layout: 'vbox',
                    margin: '5 5 5 5',
                    baseCls: ' UPS_Greenish_1',
                    border: 0,
                    items: [
                        { xtype: 'App-View-Component-Filter-ServiceCode', margin: '5 5 5 5', itemId: "filServiceCodeAD", width: 300 },
                        { xtype: 'App-View-Component-Filter-ChargeStatus', margin: '5 5 5 5', itemId: "filChargeStatusAD", width: 300 },
                        { xtype: 'App-View-Component-Filter-CostType', margin: '5 5 5 5', itemId: "filCostTypeAD", width: 300 },
                        { xtype: 'App-View-Component-Filter-VendorCode', margin: '5 5 5 5', itemId: "filVendorCodeAD", width: 300 },
                        { xtype: 'App-View-Component-Filter-InvoiceRefNo', margin: '5 5 5 5', itemId: "filInvoiceRefNoAD", width: 300 },
                        { xtype: 'App-View-Component-Filter-OrigDest', margin: '5 5 5 5', itemId: "filOrigDestAD", width: 300 },
                        { xtype: 'App-View-Component-Filter-ReceivedDate', margin: '5 5 5 5', itemId: "filReceivedDateAD", width: 300 },
                        { xtype: 'App-View-Component-Filter-E2kCarrierCode', margin: '5 5 5 5', itemId: "filE2kCarrierCodeAD", width: 300 }
                    ]
                },
            ]

        },
        {
            xtype: 'container',
            itemId: "containerBtn",
            baseCls: ' UPS_Greenish_1',
            border: 0,
            items: [
                { xtype: 'tbfill' },
                {
                    xtype: 'button',
                    itemId: 'btnCancelAD',
                    region: 'center',
                    text: '<div style="font-weight: bold;color:white;">Close</div>',
                    style: 'margin-left:40%; margin-top:5px; margin-bottom:20px;',
                    cls: 'btn fa-lg'

                },
                {
                    xtype: 'button',
                    itemId: 'btnClearAllAD',
                    region: 'center',
                    text: '<div style="font-weight: bold;color:white; ">Clear All</div>',
                    style: 'margin-left:5px; margin-top:5px; margin-bottom:20px;',
                    cls: 'btn fa-lg'
                },
                {
                    xtype: 'button',
                    itemId: 'btnProcessAD',
                    region: 'center',
                    text: '<div style="font-weight: bold;color:white; ">Process</div>',
                    style: 'margin-left:5px;margin-top:5px;margin-bottom:20px;',
                    cls: 'btn fa-lg'
                },
                { xtype: 'tbfill' }

            ]
        }
    ]

}
);