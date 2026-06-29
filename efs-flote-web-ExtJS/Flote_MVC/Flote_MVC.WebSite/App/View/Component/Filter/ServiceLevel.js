/* ====================================================================================================
NAME:			[Service Level Filter]
BEHAVIOR:		Shows Service Level Filter.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
03/18/2020        Rama Yagati		 Created.
 ======================================================================================================*/
Ext.define('App.View.Component.Filter.ServiceLevel', {
    extend: 'BIA.container.FilterContainer',
    alias: 'widget.App-View-Component-Filter-ServiceLevel',
    layout: 'column',
    width: 210,
    items: [
          { xtype: 'label', text: 'Service Level:', baseCls: 'UPS_White', width: '48%' },
          {
              xtype: 'clearCombo',
              store: {
                  type: 'webapi',
                  api: {
                      read: 'api/WebAPIFilter/SeviceCode'
                  },
                  remoteFilter: false
              },
              emptyText: 'Service Level',
              itemId: 'ServiceLevel',
              width: '48%',
              //allowBlank: false,
              valueField: 'SERVICE_CODE',
              displayField: 'SERVICE_CODE',
              value: 'All',
              editable: false,
              listConfig: {
                  loadingText: 'Searching...',
                  emptyText: 'No matching posts found.',
                  // Custom rendering template for each item
                  getInnerTpl: function () {
                      return '<div>' + '{SERVICE_CODE} - {Service_Desc}' + '</div>';
                  }
              },
              
             
          }

    ]
});