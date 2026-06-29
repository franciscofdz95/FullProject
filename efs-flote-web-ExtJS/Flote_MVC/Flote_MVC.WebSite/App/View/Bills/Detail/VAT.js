/* ====================================================================================================
NAME:			[Bill Detail VAT Info]
BEHAVIOR:		Shows Bill Detail VAT Info.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/26/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.View.Bills.Detail.VAT', {
    extend: 'Ext.container.Container',
    alias: 'widget.App-View-Bills-Detail-VAT',    
    listeners: {
        afterrender: function () {
            var rec = this.up('window').rowDetails
            BillsSingCls.getBillVATDetails(this, rec)
        }
    }

});