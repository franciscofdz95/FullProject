
Ext.define('App.View.Bills.PopUps.BillReference.Grid', {
    extend: 'BIA.grid.PagedPanel',
    alias: 'widget.App-View-Bills-PopUps-BillReference-Grid',
    border: true,
    skipToolbar: true,
    store:
    {
        type: 'webapi',
        api: {
            read: 'api/WebAPIReport/InvoiceStatusHistory'
        },
        autoLoad: false
    },
    columnLines: true,
    defaults: { menuDisabled: false, align: 'left' },
    cls: 'UBlue',
    columns: [
        {
            text: '<Div style="color:white;">InvoiceStatus</Div>', dataIndex: 'InvoiceStatus', cls: 'UBlue', border: 1, autoColumnResize: true,
            style: {
                borderColor: 'white',
                borderStyle: 'thin'
            }
        },
        {
            text: '<Div style="color:white;">StampDT</Div>', dataIndex: 'StampDT', cls: 'UBlue', border: 1, autoColumnResize: true,
            style: {
                borderColor: 'white',
                borderStyle: 'thin'
            }
        },
        {
            text: '<Div style="color:white;">UserId</Div>', dataIndex: 'UserId', cls: 'UBlue', border: 1, autoColumnResize: true,
            style: {
                borderColor: 'white',
                borderStyle: 'thin'
            }
        },
        {
            text: '<Div style="color:white;">FirstName</Div>', dataIndex: 'FirstName', cls: 'UBlue', border: 1, autoColumnResize: true,
            style: {
                borderColor: 'white',
                borderStyle: 'thin'
            }
        },
        {
            text: '<Div style="color:white;">LastName</Div>', dataIndex: 'LastName', cls: 'UBlue', border: 1, autoColumnResize: true,
            style: {
                borderColor: 'white',
                borderStyle: 'thin'
            }
        },
        {
            text: '<Div style="color:white;">ImageFolder</Div>', dataIndex: 'ImageFolder', cls: 'UBlue', border: 1, autoColumnResize: true,
            style: {
                borderColor: 'white',
                borderStyle: 'thin'
            }
        },
        {
            text: '<Div style="color:white;">ScanDest</Div>', dataIndex: 'ScanDest', cls: 'UBlue', border: 1, autoColumnResize: true,
            style: {
                borderColor: 'white',
                borderStyle: 'thin'
            }
        },
        {
            text: '<Div style="color:white;">ImageNumber</Div>', dataIndex: 'ImageNumber', cls: 'UBlue', border: 1, autoColumnResize: true,
            style: {
                borderColor: 'white',
                borderStyle: 'thin'
            }
        },
        {
            text: '<Div style="color:white;">Comment</Div>', dataIndex: 'Comment', cls: 'UBlue', border: 1, autoColumnResize: true,
            style: {
                borderColor: 'white',
                borderStyle: 'thin'
            }
        }
    ]
});
