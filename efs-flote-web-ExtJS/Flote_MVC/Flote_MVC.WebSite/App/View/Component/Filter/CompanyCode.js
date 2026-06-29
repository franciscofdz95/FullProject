/* ====================================================================================================
NAME:			[Compnay Code Filter]
BEHAVIOR:		Shows Compnay Code Filter.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/26/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.View.Component.Filter.CompanyCode', {
    extend: 'BIA.container.FilterContainer',
    alias: 'widget.App-View-Component-Filter-CompanyCode',
    layout: 'column',
    width: 210,
    items: [
          { xtype: 'label', text: 'Company Code:', baseCls: 'UPS_White', width: '48%' },

          {
              xtype: 'clearCombo',
              store:
               {
                   type: 'webapi',
                   api: {
                       read: 'api/WebAPIFilter/CompanyCode'
                   },
                   remoteFilter: false
               },
              emptyText: 'Company Code',
              itemId: 'CompanyCode',
              typeAhead: false,
              width: '48%',
              anchor: '100%',
              minChars: 2,
              hideLabel: true,
              hideTrigger: true,
              value: '',
              valueField: 'cmp_company',
              displayField: 'cmp_company',
              listConfig: {
                  loadingText: 'Searching...',
                  emptyText: 'No matching posts found.',
                  // Custom rendering template for each item
                  getInnerTpl: function () {
                      return '<div>' + '{cmp_company}' + ' - ' + '{short_description}' + '</div>';
                  }
              }

          }

    ]
});