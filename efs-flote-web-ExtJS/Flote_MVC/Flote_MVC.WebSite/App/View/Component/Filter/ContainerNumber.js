/* ====================================================================================================
NAME:			[Container Number Filter]
BEHAVIOR:		Shows Container Number Filter.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/26/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.View.Component.Filter.ContainerNumber', {
    extend: 'BIA.container.FilterContainer',
    alias: 'widget.App-View-Component-Filter-ContainerNumber',
    layout: 'column',
    width: 210,
    items: [
          { xtype: 'label', text: 'Container Number:', baseCls: 'UPS_White', width: '48%' },

          {
              xtype: 'clearCombo',
              store: {
                  type: 'webapi',
                  api: {
                      read: 'api/WebAPIFilter/ContainerNo'
                  },
                  remoteFilter: false
              },
              emptyText: 'Container Number',
              itemId: 'ContainerNumber',
              width: '48%',
              minChars: 3,
              value: '',
              hideLabel: true,
              hideTrigger: true,
              typeAhead: false,
              valueField: 'container_busid',
              displayField: 'container_busid',
              listConfig: {
                  loadingText: 'Searching...',
                  emptyText: 'No matching posts found.',
                  // Custom rendering template for each item
                  getInnerTpl: function () {
                      return '<div>' + '{container_busid}' + '</div>';
                  }
              }

          }

    ]
});