/* ====================================================================================================
NAME:			[Bill GridShowCheckBox Report]
BEHAVIOR:		Shows Bill Report with CheckBox.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications       Comments
-------------------------------------------------------------------------------------------------------
05/09/2018        Sriram Sundara		 Created.            To remove Duplicate records in Bill Tab for all status .CheckBox selmodel 
                                                             is creating two x-grid-containers inside grid which creates Duplication of records.
                                                             CheckBox is only required for Scanned,Sent,Queued status.So created a Extended
                                                             grid for that.
======================================================================================================*/
Ext.define('App.View.Bills.GridShowCheckBox', {
    extend: 'App.View.Bills.Grid',
    alias: 'widget.App-View-Bills-GridShowCheckBox',
    selType: 'checkboxmodel',
    selModel: {
        checkOnly: true,
        allowDeselect: true,
        mode: 'MULTI',
        itemId: 'colCheckBox',
        renderer: function (value, metaData, record, rowIndex, colIndex, store, view) {
            var me = this;
            return BillsSingCls.billCheckModalRender(me, value, metaData, record, rowIndex, colIndex, store, view);
        }
    }
});
