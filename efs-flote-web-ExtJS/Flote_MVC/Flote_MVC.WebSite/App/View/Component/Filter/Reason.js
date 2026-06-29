/* ====================================================================================================
NAME:			[Reason Filter]
BEHAVIOR:		Shows Paid Differently reasons Filter.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
02/14/2020        Rama Yagati		 Created.
 ======================================================================================================*/
Ext.define('App.View.Component.Filter.Reason', {
    extend: 'BIA.container.FilterContainer',
    alias: 'widget.App-View-Component-Filter-Reason',
    layout: 'column',
    width: 210,
    items: [
          { xtype: 'label', text: 'Reason:', baseCls: 'UPS_White', width: '48%' },

          {
              xtype: 'clearCombo',
              store:
               {
                   type: 'webapi',
                   api: {
                       read: 'api/WebAPIFilter/Reason'
                   },
                   remoteFilter: false
               },
              emptyText: 'Reason',
              itemId: 'Reason',
              typeAhead: false,
              width: '48%',
              minChars: 3,
              value: 'All',
              //hideTrigger: true,
              //typeAhead: true,
              valueField: 'PaidDifferentlyReason',
              displayField: 'PaidDifferentlyReason',
              listConfig: {
                  loadingText: 'Searching...',
                  emptyText: 'No matching posts found.',
                  // Custom rendering template for each item
                  getInnerTpl: function () {
                      return '<div>' + '{PaidDifferentlyReason}' +'</div>';
                  }
              }

          }

    ]
});