/* ====================================================================================================
NAME:			[Invoice Processing TBAR Controller ]
BEHAVIOR:		Performs Action and  data for Invoice Processing TBar action event.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
03/01/2017        Sudhir Dandale		 Created.
 ======================================================================================================*/


Ext.define('App.Controller.IvvoiceProcessing.TBar', {
    extend: 'Ext.app.Controller',
    refs: [
        { ref: 'Current', selector: 'App-View-Main-TabPanel' },
        { ref: 'FilterPanel', selector: 'App-View-Component-Container-FilterPanelBase' }

    ],
    init: function () {
        var me = this;

        me.control({
            '[xtype="App-View-InvoiceProcessing-TBar"] #viewDetailPop': {
                click: me.ViewBillsDetail
            },
            '[xtype="App-View-InvoiceProcessing-TBar"] #radioProtocolId': {
                change: me.RadioButtonChanged
            }

        });

    },
    // Get Bills Details Reports cell click event.


    ViewBillsDetail: function ViewBillsDetail(me) {
        var win = Ext.widget('App-View-Bills-Detail-Report');
        win.rec = IProcessingSCls.getRecDetails();
        win.show();
    },
    RadioButtonChanged: function RadioButtonChanged(me) {
        var val = me.getValue().rdGroup;
        IProcessingSCls.setRdoType(val);
        var tabPanel = this.getActiveCurrent();
        if (tabPanel == null) {
            tabPanel = this.getAllCurrent();
        }
        tabPanel.activeTab.fireEvent('activate', tabPanel.activeTab);        
    }

});

