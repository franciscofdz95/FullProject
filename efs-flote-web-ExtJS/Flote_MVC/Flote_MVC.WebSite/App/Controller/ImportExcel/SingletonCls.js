/* ====================================================================================================
NAME:			[Bills Page Singleton Class]
BEHAVIOR:		All the actions related Bills page.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
11/14/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.Controller.ImportExcel.SingletonCls', {
    alias: 'widget.App-Controller-ImportExcel-SingletonCls',
    alternateClassName: ['ImportExcelSCls'],
    singleton: true,
    config: {
        fileName: '',
        targetPath: '',
        invoiceId: -1,
        tabName: '',
        showErrors: true,
        selectedRecord: '',
        userId: 'system',
        columnFieldsListData: ''

    },
    constructor: function (options) {
        this.initConfig(options);
    },
    getColumnFieldsList: function getColumnFieldsList() {

        var result = BIA.Ajax.request({
            url: 'api/WebAPIReport/FieldList',
            method: "POST",
            async: false,
            cache: false,
            dataType: "html",
            headers: {
                "Content-Type": "application/json"
            },
            useDefaultXhrHeader: true,
            failure: function () {
                BIACore.Exception(conn.responseText);
                BIACore.Message(response);
            },
            scope: this
        });
        this.setColumnFieldsListData(result.responseJSON);
    }

});