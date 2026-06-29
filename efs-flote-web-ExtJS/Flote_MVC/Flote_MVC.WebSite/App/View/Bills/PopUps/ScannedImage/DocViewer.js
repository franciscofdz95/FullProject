/* ====================================================================================================
NAME:			[Scanned Document Window]
BEHAVIOR:		Shows Scanned Document.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
08/20/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.View.Reports.Bills.PopUps.ScannedImage.DocViewer', {
    extend: 'Ext.window.Window',
    alias: 'widget.App-View-Bills-PopUps-ScannedImage-DocViewer',
    itemId: 'scannedDocId',
    title: '<div style="font-weight: bold">Flote Scan View</div>',
    width: '65%',
    height: '95%',
    modal: true,
    rec: '',
    recImg: '',
    type: 'attach',
    defaults: {
        anchor: '100%',
        labelWidth: 100
    },
    items: [
        {
            xtype: 'container',
            layout: 'hbox',
            baseCls: 'UPS_YGreen_4',
            height: '12%',
            style: {
                borderColor: 'white',
                borderStyle: 'solid'
            },
            items: [
                { xtype: 'label', region: 'center', width: '180px', text: 'Flote Bill Image Review', labelStyle: 'color:black;font-weight:bold; font-size:14px;', margin: '25 5 5 5', style: 'color:white;font-weight:bold; font-size:14px;border: 1px solid white;background-color:#364505;' },
                { xtype: 'displayfield', width: '10%', fieldLabel: 'Flote Invoice ID', itemId: 'invIdSD', labelStyle: 'color:black;font-weight:bold; font-size:10px;', border: 2, margin: '5 5 5 5', labelAlign: 'top', style: 'border: 1px white;background-color:#A1AC86;', fieldStyle: 'color:white;font-weight:bold; font-size:14px;' },
                { xtype: 'displayfield', width: '15%', fieldLabel: 'Vendor Bill Number', itemId: 'vendorBillNoIdSD', labelStyle: 'color:black;font-weight:bold; font-size:10px;', name: 'Invoice_id', border: 2, margin: '5 5 5 5', labelAlign: 'top', style: 'border: 1px white;background-color:#A1AC86;', fieldStyle: 'color:white;font-weight:bold; font-size:14px;' },
                { xtype: 'displayfield', width: '25%', fieldLabel: 'Vendor Name', itemId: 'vandorNameIdSD', labelStyle: 'color:black;font-weight:bold; font-size:10px;', name: 'Invoice_id', border: 2, margin: '5 5 5 5', labelAlign: 'top', style: 'border: 1px white;background-color:#A1AC86;', fieldStyle: 'color:white;font-weight:bold; font-size:12px;' },
                { xtype: 'displayfield', width: '12%', fieldLabel: 'Document ID', itemId: 'DocIdSD', labelStyle: 'color:black;font-weight:bold; font-size:10px;', name: 'Invoice_id', border: 2, margin: '5 5 5 5', labelAlign: 'top', style: 'border: 1px white;background-color:#A1AC86;', fieldStyle: 'color:white;font-weight:bold; font-size:14px;' },
                { xtype: 'displayfield', width: '10%', fieldLabel: 'Bill Amount', itemId: 'billAmtIdSD', labelStyle: 'color:black;font-weight:bold; font-size:10px;', name: 'Invoice_id', border: 2, margin: '5 5 5 5', labelAlign: 'top', style: 'border: 1px white;background-color:#A1AC86;', fieldStyle: 'color:white;font-weight:bold; font-size:14px;' },
                { xtype: 'displayfield', width: '8%', fieldLabel: 'Bill Currency', itemId: 'billCurrencyIdSD', labelStyle: 'color:black;font-weight:bold; font-size:10px;', name: 'Invoice_id', border: 2, margin: '5 5 5 5', labelAlign: 'top', style: 'border: 1px white;background-color:#A1AC86;', fieldStyle: 'color:white;font-weight:bold; font-size:14px;' },
            ]

        },
        {
            xtype: 'container',
            layout: 'hbox',
            height: '10%',
            baseCls: 'UPS_Table_2',
            style: {
                borderColor: 'white',
                borderStyle: 'solid'
            },
            items: [
                {
                    xtype: 'textareafield',
                    itemId: 'cmtRejectScanDoc',
                    bodyPadding: 10,
                    inputWidth: 300,
                    width: 500,
                    height: '95%',
                    fieldLabel: 'Rejection Comment:',
                    anchor: '100%',
                    style: 'margin-left:300px; margin-right:10px;border: 1px solid white;',
                    labelStyle: 'color:white;font-weight:bold; font-size:12px; width:100px',
                    fieldStyle: 'text-align: left;',
                    allowBlank: false,
                    hidden: true
                },
                { xtype: 'button', itemId: 'btnRejectScanSD', hidden: true, docked: 'bottom', cls: 'btn', margin: '15 0 0 5', text: '<div style="font-weight: bold;color:white;">Reject Scan</div>' },
                {
                    xtype: 'button', itemId: 'btnAttachScanSD', hidden: true, docked: 'bottom', cls: 'btn', text: '<div style="font-weight: bold;color:white;">Attach Scan</div>',
                    style: 'margin-left:750px; margin-right:10px;margin-top:15px;'
                },
                { xtype: 'button', itemId: 'btnCloseSD', docked: 'bottom', cls: 'btn', margin: '15 0 0 5', text: '<div style="font-weight: bold;color:white;">Close</div>' }
            ]
        },
        {
            xtype: 'component',
            itemId: 'scannedDoc',
            style: {
                borderColor: 'black',
                borderStyle: 'solid'
            },
            autoScroll: true,
            autoEl: {
                tag: 'iframe',
                style: 'height: 100%; width: 100%; border: 2px solid black',
                src: Ext.BLANK_IMAGE_URL
            },
            listeners: {
                render: function (component) {
                    component.getEl().on('click', function (e) {
                        console.log(component);
                        alert('test');
                    });
                }
            }
        }
    ]
});
