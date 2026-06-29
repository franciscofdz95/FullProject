/* ====================================================================================================
NAME:			[Flote Common Controller ]
BEHAVIOR:		Connects to flote common function/actions for different components.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
09/21/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.Controller.Common.FloteCommonCtrl', {
    extend: 'Ext.app.Controller',
    itemId: 'floteCommonCtrlId',
    refs: [
        { ref: 'Current', selector: 'App-View-Main-TabPanel' },
        { ref: 'FilterPanel', selector: 'App-View-Component-Container-FilterPanelBase' }
    ],
    init: function () {     

        this.control({
            '[xtype="button"]': {
                btnExcelExport: this.exportToExcel
            }

        });

    },
    exportToExcel: function exportToExcel(pageName, colNames, dataIndexes, sorters, radioSel, apiUrl, excelReqParams) {
        var filter = this.getActiveFilterPanel();
        if (filter == null) {
            filter = this.getAllFilterPanel()[0];
        }
        var sort = ''
        if (sorters != null) {
            for (var i = 0; i < sorters.length; i++) {
                sort += sorters[i].property + '  ' + sorters[i].direction;
                if (sorters.length > 1 && sorters.length - 1 != i) {
                    sort = sort + ',';
                }
            }
        }
        var params = filter.GetParameters();
        var paramProps = Object.getOwnPropertyNames(params);
        for (var k = 0; k < paramProps.length; k++) {
            params[paramProps[k]] = excelReqParams[paramProps[k]];
        }
        params.PageName = pageName;       
        params.ColumnNames = colNames;
        params.DataIndexes = dataIndexes;
        params.ApiUrl = apiUrl
        if (PgAtt.getInvoice_id() != null && PgAtt.getInvoice_id() != '0' && PgAtt.getInvoice_id() != '') {
            params.InvoiceId = PgAtt.getInvoice_id();
        }
        if (radioSel != '') { params.RadioSelection = radioSel.rdGroup }
        params.SortParam = sort;
        params.StartDate = params.StartDate != null ? convertDate(params.StartDate) : params.StartDate;
        params.EndDate = params.EndDate != null ? convertDate(params.EndDate) : params.EndDate;
        params.StartPeriod = params.StartPeriod != null ? convertDate(params.StartPeriod) : params.StartPeriod;
        params.EndPeriod = params.EndPeriod != null ? convertDate(params.EndPeriod) : params.EndPeriod;
        var form = Ext.create('Ext.form.Panel', {
            standardSubmit: true,
            url: 'api/WebAPIReport/ExcelExport',
            method: 'POST'
        });

        form.submit({
            target: '_blank',
            params: params
        });
    }

});

function convertDate(dateFilter) {
    var date = new Date(dateFilter);
    var year = date.getFullYear();
    var month = date.getMonth() + 1 //getMonth is zero based;
    var day = date.getDate();
    return year + "-" + month + "-" + day;
}