/* ====================================================================================================
NAME:			[Location Shipment BBar Fields]
BEHAVIOR:		Shows Vendor Shipment Bbar Info.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Created/Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
6/17/2020            Rama Yagati		 Created.
 ======================================================================================================*/
Ext.define('App.View.VendorShipment.BBar', {
    extend: 'Ext.FormPanel',
    alias: 'widget.App-View-VendorShipment-BBar',
    width: '100%',
    bodyStyle: 'background:#DFE8F6',
    layout: 'hbox',
    items: [
            {
                xtype: 'container',
                layout: 'hbox',
                width: '100%',
                baseCls: 'UPS_Blue_3',
                style: {
                    borderColor: 'white',
                    borderStyle: 'solid'
                },
                items: [
                   {
                       xtype: 'displayfield',
                       labelStyle: 'background-color : white; font-size:10px;', margin: '0 5 5 0',
                        value: '<span style=" color:#1D598E"> <img src="images/info.png" style="vertical-align:bottom"/> <b>Regular Invoice</b> &nbsp;&nbsp;<img src="images/Sinfo.png" style="vertical-align:bottom"/> <b>Shipco Statement Invoice</b> &nbsp;&nbsp;<img src="images/PInfo.png" style="vertical-align:bottom"/> <b>Ocean PUD/CSI</b> &nbsp;&nbsp;<img src="images/NInfo.png" style="vertical-align:bottom"/> <b>Ocean ChargeBacks/NAAF</b> &nbsp;&nbsp;<img src="images/FInfo.png" style="vertical-align:bottom"/> <b>UPS Freight</b> &nbsp;&nbsp;<img src="images/CInfo.png" style="vertical-align:bottom"/> <b>Coyote</b></span>'
                   }
                ]
            }
    ]
});