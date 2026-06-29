/* ====================================================================================================
NAME:			[Scan Image Search]
BEHAVIOR:		Scan Image search result grid for Invoice Reference Number.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
09/22/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.View.Reports.Bills.PopUps.ScannedImage.SearchGrid', {
    extend: 'BIA.grid.PagedPanel',
    alias: 'widget.App-View-Bills-PopUps-ScannedImage-SearchGrid',
    border: true,
    rec: '',
    store:
    {
        type: 'webapi',
        api: {
            read: 'api/WebAPIReport/SearchScanDocument'
        }
    },
    viewConfig: {
        enableTextSelection: true,
        deferEmptyText: false,
        emptyText: 'Click Search to begin.',
        forceFit: true
    },
    columnLines: true,
    defaults: { menuDisabled: false, align: 'left' },
    cls: 'UBlue',
    columns: [
        {
            xtype: 'actioncolumn',
            text: '',
            sortable: false,
            tdCls: 'x-grid-cell-Other',
            cls: 'UBlue',
            autoColumnResize: true,
            items: [{
                icon: 'images/scanned_16.png',  // Use a URL in the icon config
                tooltip: 'Invoice details and Approve bill',
                handler: function (grid, rowIndex, colIndex) {
                    var recImg = grid.getStore().getAt(rowIndex);
                    var win = this.up('window');
                    var rec = win.rowDetScan;

                    var win2 = Ext.widget('App-View-Bills-PopUps-ScannedImage-DocViewer');
                    win2.rec = rec;
                    win2.recImg = recImg;
                    win2.type = 'attach';
                    win2.show();
                }
            }]
        },
        {
            text: '<Div style="color:white;">Document Id</Div>', itemId: 'colImageNumber', dataIndex: 'IMAGENUMBER', cls: 'UBlue', border: 1, autoColumnResize: true,
            style: {
                borderColor: 'white',
                borderStyle: 'thin'
            },
            renderer: function (value, metaData, record) {
                return '<a><span style="color:#1D598E;" >' + value + '</span></a>';
            }
        },

        {
            text: '<Div style="color:white;">Pages</Div>', dataIndex: 'PAGES', cls: 'UBlue', border: 1, autoColumnResize: true,
            style: {
                borderColor: 'white',
                borderStyle: 'thin'
            }
        },
        {
            text: '<Div style="color:white;">Scan Dest</Div>', dataIndex: 'SCAN_DEST', cls: 'UBlue', border: 1, autoColumnResize: true,
            style: {
                borderColor: 'white',
                borderStyle: 'thin'
            }
        },
        {
            text: '<Div style="color:white;">Scan Date</Div>', dataIndex: 'SCAN_DATE', cls: 'UBlue', border: 1, autoColumnResize: true,
            style: {
                borderColor: 'white',
                borderStyle: 'thin'
            }
        },
        {
            text: '<Div style="color:white;">Vendor Invoice Id</Div>', dataIndex: 'VEN_INVOICE', cls: 'UBlue', border: 1, autoColumnResize: true,
            style: {
                borderColor: 'white',
                borderStyle: 'thin'
            }
        },
        {
            text: '<Div style="color:white;">Folder</Div>', dataIndex: 'FOLDER', cls: 'UBlue', border: 1, autoColumnResize: true,
            style: {
                borderColor: 'white',
                borderStyle: 'thin'
            }
        },
        {
            text: '<Div style="color:white;">Flote Bill Id</Div>', itemId: 'colFloteBillId', dataIndex: '', cls: 'UBlue', border: 1, autoColumnResize: true,
            style: {
                borderColor: 'white',
                borderStyle: 'thin'
            }
        }

    ]


});
