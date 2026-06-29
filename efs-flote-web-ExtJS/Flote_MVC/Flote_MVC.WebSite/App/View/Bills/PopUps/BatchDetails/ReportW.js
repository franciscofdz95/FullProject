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

Ext.define('App.View.Reports.Bills.PopUps.BatchDetails.ReportW', {
    extend: 'Ext.window.Window',
    alias: 'widget.App-View-Bills-PopUps-BatchDetails-ReportW',
    itemId: 'batchDetailsWId',
    border: true,
    title: 'Batch Details',
    width: '35%',
    modal: true,
    rowDetails: '',
    items:
       [
           { xtype: 'App-View-Bills-PopUps-BatchDetails-Grid', itemId: "batchDetailGridId" },
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
                        itemId: 'cmtRejectBatchesId',
                        bodyPadding: 10,
                        inputWidth: 300,
                        width: 500,
                        height: '95%',
                        labelAlign: 'top',
                        fieldLabel: 'Please Enter a comment why the invoice is being rejected',
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
                          { xtype: 'button', itemId: 'btnRecallBatchId', docked: 'bottom', cls: 'btn', margin: '5 5 5 200', text: '<div style="font-weight: bold;color:white;">Recall</div>' },
                          { xtype: 'button', itemId: 'btnArchivedBatchId', hidden: true, docked: 'bottom', margin: '5 5 5 5', cls: 'btn', text: '<div style="font-weight: bold;color:white;">Archive Batch</div>' },
                          { xtype: 'button', itemId: 'btnCancelBatchId', docked: 'bottom', cls: 'btn', margin: '5 5 5 5', text: '<div style="font-weight: bold;color:white;">Cancel</div>' }
                        ]
                    }
                ]
            }

       ]

});
