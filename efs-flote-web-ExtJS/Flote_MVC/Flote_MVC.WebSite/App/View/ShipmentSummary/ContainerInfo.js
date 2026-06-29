/* ====================================================================================================
NAME:			[Shipment Container Info]
BEHAVIOR:		Shows Shipment Container Info.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
12/16/2016        mmw7kwz		 Created.
 ======================================================================================================*/
Ext.define('App.View.ShipmentSummary.ContainerInfo', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.App-View-ShipmentSummary-ContainerInfo',
    border: false,    
    autoScroll: true,
    viewConfig: {
        enableTextSelection: true,
        deferEmptyText: false,
        emptyText: 'No Matches Found!'
    },
    store: {
        type: 'webapi',
        pageSize: 20,
        api: {
            read: 'api/WebAPIReport/ContainerSummary'
        }
    },
    tbar: [
          {
              xtype: 'App-View-Component-Common-TbarPanel', reportType: 'ShipmentContainerInfo', listeners: {
                  afterrender: function () {
                      this.down('label').setText('Container Fact');
                      this.down('#btnExcelExport').setVisible(false);
                  }
              }
          }
    ],
    columnLines: true,
    defaults: { menuDisabled: false, align: 'left', border: 1, sortable: false, autoColumnResize: true },
    cls: 'UBlue',
    columns: [

            {
                text: '<Div style="color:white;">Container Number</Div>', dataIndex: 'container_busid',
                renderer: function (value, metaData, record, row, col, store, gridView) {
                    metaData.tdAttr = 'data-qtip="' + Ext.String.htmlEncode(value) + '"';
                    return value;
                }
            },
            {
                text: '<Div style="color:white;">Container Type</BR>Name</Div>', dataIndex: 'container_type'
            }

    ]

});