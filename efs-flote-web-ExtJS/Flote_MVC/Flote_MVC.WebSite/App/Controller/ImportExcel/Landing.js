/* ====================================================================================================
NAME:			[Excel Controller]
BEHAVIOR:		Actions and Event related to Import Excel Landing Page.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
03/03/2017        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.Controller.ImportExcel.Landing', {
    extend: 'Ext.app.Controller',

    init: function () {
        //var stoWorkbookList = Ext.create('ImportExcel.store.WorkbookList', {
        //    storeId: 'stoWorkbookList'
        //});

        //stoWorkbookList.load();

        this.control({ '#imgImportFromExcelFile': { click: this.prepareAndJumpToImportFromExcel } });
        this.control({ '#lblImportFromExcelFile': { click: this.prepareAndJumpToImportFromExcel } });
        
//        this.control({ '#imgLaunchODQModule': { click: this.launchODQModule} });
//        this.control({ '#lblLaunchODQModule': { click: this.launchODQModule } });


        this.control({ '#workbooklist': { EditProject: this.editProject} });
        this.control({ '#workbooklist': { DeleteProject: this.deleteProject} });

    },
    launchODQModule: function(){
        //alert('ok');
        //Ext.ComponentQuery.query('App-View-ImportExcel-Report').getLayout().setActiveItem('cardODQ');
    },
    prepareAndJumpToImportFromExcel: function () {
        ViewParameters.pqrID = -1;
        this.jumpToImportFromExcel();
    },

    jumpToImportFromExcel: function () {
        if (ViewParameters.pqrID != -1) {
            Ext.ComponentQuery.query('edtIdentifier').setValue(ViewParameters.Invoice_Id);
            Ext.ComponentQuery.query('edtIdentifier').setDisabled(true);
        }
        else {
            Ext.ComponentQuery.query('edtIdentifier').setValue('');
        }
        Ext.ComponentQuery.query('edtHeaderRow').setValue(1);
        Ext.ComponentQuery.query('edtDataRowStart').setValue(2);
        Ext.ComponentQuery.query('App-View-ImportExcel-Report').getLayout().setActiveItem('cardExcelImport');
        //Ext.ComponentQuery.query('App-View-ImportExcel-Report').getLayout().setActiveItem('cardLanding');
    },
    editProject: function (INVOICE_ID, validated) {
        if (!validated) {
            this.getController('Validate').loadValidation(INVOICE_ID);
            //this.loadValidation();
        } else {
            //this.getController('DecisionSupport').loadDecisionSupport(INVOICE_ID);
            //this.loadDecisionSupport(INVOICE_ID);
        }
    },
    deleteProject: function (INVOICE_ID) {
        var wrkBookStore, record;
        wrkBookStore = Ext.getStore('stoWorkbookList');
        record = wrkBookStore.findRecord('INVOICE_ID', INVOICE_ID);
        Ext.Msg.confirm('Delete Project', 'Are you sure?', function (button) {
            if (button === 'yes') {
                wrkBookStore.remove(record);
                wrkBookStore.sync();
            }
        }, this);
    }

});

