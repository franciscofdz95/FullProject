/* ====================================================================================================
NAME:			[Payment Details BBar Fields]
BEHAVIOR:		Shows Payment Details Bbar Info.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Created/Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
5/06/2021            Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.View.Bill.PaymentDetails.BBar', {
    extend: 'Ext.FormPanel',
    alias: 'widget.App-View-Bill-PaymentDetails-BBar',
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
                {
                    xtype: 'label', margin: '5 5 5 10', html: '<strong>	NOTE:   There is a "24" hour lag time for Oracle updates to be reflected in FLOTE including documents recycled in Image Management </strong>' },

            ]
        }
    ]
});