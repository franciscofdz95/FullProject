/* ====================================================================================================
NAME:			[Shipment Summary Report Grid]
BEHAVIOR:		Shows Shipment Summary Report Grid.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
09/16/2016        Sheetal Karre		 Created.
 ======================================================================================================*/

Ext.define('App.View.ShipmentSummary.Report', {
    extend: 'Ext.window.Window',
    alias: 'widget.App-View-ShipmentSummary-Report',
    itemId: 'ShipmentRpt',
    title: '<div style="font-weight: bold">Shipment Detail</div>',
    width: '98%',
    height: '98%',    
    modal: true,
    autoScroll: true,
    defaults: {
        labelWidth: 80
    },
    layout: {
        type: 'vbox',
        align: 'stretch',
        pack: 'start'
    },
    items: [
        {

            xtype: 'panel',
            title: '',
            itemId: 'pnlShipmentDeatilsHeaderId',
            baseCls: 'UPS_Greenish_1',
            animCollapse: false,
            collapsible: true,
            margin: '5 5 5 5',
            items: [
                {
                    xtype: 'container',
                    itemId: 'ShipmentHeader',   
                    margin: 5,
                    items: []
                },
                {
                    xtype: 'container',
                    itemId: "CustomerInfoContainer",
                    margin: 5,
                    width: '100%',
                    
                    layout: {
                        type: 'hbox'
                    },
                    items: [
                        { xtype: 'App-View-ShipmentSummary-CustomerInfo', itemId: "custgrid", margin: '5 0 0 0', border: true, flex: 2, width: '30%' }, //Label color: #292984
                        { xtype: 'App-View-ShipmentSummary-ContainerInfo', itemId: "factgrid", margin: '5 0 0 5', border: true, flex: 1, width: '15%' },
                        { xtype: 'App-View-ShipmentSummary-MBLInfo', itemId: "mblgrid", margin: '5 0 0 5', border: true, flex: 3, width: '55%' }
                    ],
                    flex: 1
                }
             ]
         },
        {
            xtype: 'App-View-ShipmentSummary-Grid', itemId: 'ShipmentDetailId', html: HTMLFontElement, layout: 'fit', margin: '0 5 5 5'
        },

        {
            xtype: 'panel',
            title: '<span style="padding:0 2px; font-weight:bold;font-size: 12pt;">Shipment Notes </span>',
            itemId: 'pnlShipmentNoteId',
            baseCls: 'UPS_Greenish_1',
            collapsible: true,
            animCollapse: false,
            margin: '5 5 5 5',
            items: [
                 {
                     xtype: 'container',
                     margin: '5 5 5 5',
                     width: '100%',
                     items: [
                        { xtype: 'button', text: 'Add/View Shipment Note', margin: '20 5 5 5', width: 180, itemId: "btnAddViewShipmentNote" },
                        { xtype: 'tbfill' }
                     ]
                 },
                 { xtype: 'App-View-ShipmentSummary-Note-DisplayGrid', margin: '5 5 5 5' }
     ]
        },
        {
            xtype: 'displayfield',
            margin: '0 0 0 5',
            value: '<span style="font-style:italic;">Italic</span> amounts are from the Master Bill <br> Currency conversions at UPS Treasurys most recent monthly average rate.<br><span style="font-weight:bold; color:blue;">Bold Blue</span> items are calculated based on a Container Allocation process.<br> <span style="font-weight:bold; color:black;">Bold Black</span> items have been Billed in Flote.'
        },
         //{
         //    xtype: 'label', margin: '5 5 5 5', inputWidth: 500,
         //    html: ''
         //},

        { xtype: 'App-View-Main-Footer' }
    ]
});



