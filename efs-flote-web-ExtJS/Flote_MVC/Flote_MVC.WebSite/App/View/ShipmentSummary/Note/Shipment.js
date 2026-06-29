/* ====================================================================================================
NAME:			[Batch Detail Window]
BEHAVIOR:		Recall / Archive the invoice batches.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
09/30/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/

Ext.define('App.View.ShipmentSummary.Note.Shipment', {
    extend: 'Ext.window.Window',
    alias: 'widget.App-View-ShipmentSummary-Note-Shipment',
    //itemId: 'shipmentNoteWnd',
    border: true,
    title: 'Shipment Note',
    width: '35%',
    modal: true,
    rowDetails: '',
    items:
       [
            {
                xtype: 'container',
                layout: 'vbox',
                height: '10%',
                baseCls: 'UPS_Table_2',
                style: {
                    borderColor: 'white',
                    borderStyle: 'solid'
                },
                items: [
                    {
                        xtype: 'textareafield',
                        itemId: 'cmtShipmentNoteTxt',
                        bodyPadding: 10,
                        inputWidth: 300,
                        width: '100%',
                        height: '90%',
                        labelAlign: 'top',
                        fieldLabel: 'Shipment Note',
                        fieldStyle: 'text-align: right;',
                        anchor: '100%',
                        margin: '5 5 5 5',
                        style: 'margin-left:10px; margin-right:10px;border: 1px solid white;',
                        labelStyle: 'color:white;font-weight:bold; font-size:12px; width:100px',                        
                        allowBlank: false
                    },
                    {
                        xtype: 'panel',
                        width: '100%',
                        items: [
                          { xtype: 'button', itemId: 'btnShipNoteClose', docked: 'bottom', cls: 'btn', margin: '5 5 5 200', text: '<div style="font-weight: bold;color:white;">Close</div>' },
                          { xtype: 'button', itemId: 'btnShipNoteAdd', docked: 'bottom', margin: '5 5 5 5', cls: 'btn', text: '<div style="font-weight: bold;color:white;">Add</div>' },

                        ]
                    }
                ]
            }

       ]

});
