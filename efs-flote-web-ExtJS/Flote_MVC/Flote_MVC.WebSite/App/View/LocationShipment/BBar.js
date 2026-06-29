/* ====================================================================================================
NAME:			[Location Shipment BBar Fields]
BEHAVIOR:		Shows Location Shipment Bbar Info.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Created/Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
5/19/2017            Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.View.LocationShipment.BBar', {
    extend: 'Ext.FormPanel',
    alias: 'widget.App-View-LocationShipment-BBar',
    width: '100%',
    bodyStyle: 'background:#DFE8F6',
    layout: 'hbox',
    items: [
            {
                xtype: 'container',
                layout: 'hbox',              
                width: '100%',                
                baseCls: 'UPS_Greenish_1',
                style: {
                    borderColor: 'white',
                    borderStyle: 'solid'
                },
                items: [
                    { xtype: 'label', margin: '5 5 5 10', html: '	O/D - Origin/Destination<BR> I/U - Charge Status: Billed or Unreleased<BR>O/A - Bill Status: Open or Approved<BR>' },
                      
                ]
            }
    ]
});