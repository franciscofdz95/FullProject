/* ====================================================================================================
NAME:			[Ocean MBL Summary Report]
BEHAVIOR:		Shows Ocean MBL Summary Report.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
09/16/2016        Sheetal Karre		 Created.
 ======================================================================================================*/

Ext.define('App.View.LocationMBL.OceanMBL.Report', {
    extend: 'Ext.window.Window',
    alias: 'widget.App-View-LocationMBL-OceanMBL-Report',
    itemId: 'ShipmentRpt',
    title: '<div style="font-weight: bold">Ocean MBL Detail</div>',
    width: '98%',
    height: '98%',
    modal: true,    
    autoScroll: true,
    defaults: {        
        labelWidth: 100
    },    
    layout: {
        type: 'vbox',
        align: 'stretch',
        pack: 'start'
    },
    items: [
        { xtype: 'App-View-LocationMBL-OceanMBL-Grid' },
        { xtype: 'label', margin: '5 5 5 5', html: '<div>Items with * after the buy amounts are from the Master Bill<BR>Currency conversions at UPS Treasury"s most recent monthly average rate.</div>' },
        { xtype: 'App-View-Main-Footer' }
    ]
}
);