/* ====================================================================================================
NAME:			[Company Codes  Grid]
BEHAVIOR:		Shows Company Codes Grid.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/26/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.View.Home.APUTAdmin.CompanyCodesGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.App-View-Home-APUTAdmin-CompanyCodesGrid',
    //  title: 'APUT Users',
    border: true,
    store: {
        type: 'webapi',
        api: {
            read: 'api/WebAPIReport/GetCompanyCodesByUserId'
        }

    },
    selModel: 'cellmodel',
    plugins: {
        ptype: 'cellediting',
        clicksToEdit: 1
    },
    columnLines: true,
    cls: 'UBlue',
    defaults: { menuDisabled: false, align: 'left', autoColumnResize: true,  sortable: false, border: 1 },
    columns: [
         {
             text: 'Company Codes', dataIndex: 'ORA_Company', width: 250,
             renderer: HSCls.homeScreenRenderer
         },
          {
              xtype: 'widgetcolumn',itemId: 'cmpCodesRemoveId',width: 100, sortable: false, text: '',
              widget: {
                  xtype: 'button',
                  text: 'Remove',
                  listeners: {
                      'click': function (btn, records) {
                          var record = btn.getWidgetRecord();
                          var grid = this.up('grid');
                          if (record != '' && record != null) {
                              grid.fireEvent('removecompanycodes', record.get('sysm'), record.get('ORA_Company'));
                              record.dirty = false;
                          }
                          else {
                              alert("Valid record is missing for selected row.")
                          }
                      }
                  }
              }
          }

    ]



});
