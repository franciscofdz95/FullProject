/* ====================================================================================================
NAME:			[Log Vendor Bill Buttons]
BEHAVIOR:		Shows Log Vendor Bill Buttons.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/26/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.View.LogVendor.LVBButtons', {
    extend: 'Ext.container.Container',
    alias: 'widget.App-View-LogVendor-Filter-LVBButtons',
    border: 0,
    layout: { type: 'hbox' },   
    defaults: { margins: '10 10 10 10', region: 'center' },
    items: [
        { xtype: 'tbfill' },
        {
            xtype: 'button',
            itemId: 'SaveProcess',
            text: 'Save & Process',
            style: 'margin-right:10px;color:white;',
            cls: 'btn',
            status3Hide: true
        },
        {
            xtype: 'button',
            itemId: 'LogNext',
            text: 'Log Next',
            style: 'margin-right:10px;color:white;',
            cls: 'btn'
        },
        {
            xtype: 'button',
            itemId: 'SaveCheckInfo',
            text: 'Save Check Info',
            style: 'margin-right:10px;color:white;',
            cls: 'btn'
        },
        {
            xtype: 'button',
            itemId: 'ExcelUpload',
            text: 'Excel Upload',
            style: 'margin-right:10px;color:white;',
            cls: 'btn'
        },
        {
            xtype: 'button',
            itemId: 'Cancel',
            text: 'Cancel',
            style: 'color:white;',
            cls: 'btn'
        },
         { xtype: 'tbfill' }

    ]
});