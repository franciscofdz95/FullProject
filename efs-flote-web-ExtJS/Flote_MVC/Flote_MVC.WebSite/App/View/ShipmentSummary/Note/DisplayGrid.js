/* ====================================================================================================
NAME:			[Shipment Notes Grid]
BEHAVIOR:		Shows Shipment notes Grid.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
08/16/2017        Sudhir Dandale		 Created.
 ======================================================================================================*/

Ext.define('App.View.ShipmentSummary.Note.DisplayGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.App-View-ShipmentSummary-Note-DisplayGrid',
    border: true,
    autoScroll: true,
    store: {
        type: 'webapi',
        api: {
            read: 'api/WebAPIReport/ViewShipmentNotes'
        },
        remoteSort: false,
        autoLoad: false
    },
    selModel: 'cellmodel',
    plugins: {
        ptype: 'cellediting',
        clicksToEdit: 1
    },
    columnLines: true,
    cls: 'UBlue',
    defaults: { menuDisabled: false, align: 'left', autoColumnResize: true, cls: 'UBlue', sortable: false, border: 1 },
    columns: [
        {
            xtype: 'widgetcolumn', hidden: true,
            widget: {
                xtype: 'button', width: 24, 
                icon: 'images/remove-24x24.gif',
                itemId: 'btnRemoveNoteByNoteId'
            }
        },
    {
        text: 'Date', dataIndex: 'frn_created', width: 150
    },
    {
        text: 'User', dataIndex: 'usr_name', width: 100
    },
     {
         text: 'Note', dataIndex: 'frn_note', width: 350
     }

    ]

});

