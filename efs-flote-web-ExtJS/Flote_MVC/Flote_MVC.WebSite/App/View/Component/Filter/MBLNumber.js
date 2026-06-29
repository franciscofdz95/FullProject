/* ====================================================================================================
NAME:			[MBL Number Filter]
BEHAVIOR:		Shows MBL Number Filter.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/26/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.View.Component.Filter.MBLNumber', {
    extend: 'BIA.container.FilterContainer',
    alias: 'widget.App-View-Component-Filter-MBLNumber',
    layout: 'column',
    width: 210,
    items: [
          { xtype: 'label', text: 'MBL Number:', baseCls: 'UPS_White', width: '48%' },

          {
              xtype: 'clearCombo',
              store:
              {
                  type: 'webapi',
                  api: {
                      read: 'api/WebAPIFilter/MBLNo'
                  },
                  remoteFilter: false
              },
              emptyText: 'MBL Number',
              itemId: 'MBLNumber',
              value: '',
              minChars: 3,
              hideLabel: true,
              hideTrigger: true,
              typeAhead: false,
              width: '48%',
              valueField: 'mbl_busid',
              displayField: 'mbl_busid',
              listConfig: {
                  loadingText: 'Searching...',
                  emptyText: 'No matching posts found.',
                  // Custom rendering template for each item
                  getInnerTpl: function () {
                      return '<div>' + '{mbl_busid}' + '</div>';
                  }
              }

          }

    ]
    ,
    GetFilterDisplay: function () {
        var value = this.down('#MBLNumber').getRawValue();
        // forceSelection: true makes this a bit retarded.
        return (value) ? 'MBL Number: ' + value : '';
    }
});