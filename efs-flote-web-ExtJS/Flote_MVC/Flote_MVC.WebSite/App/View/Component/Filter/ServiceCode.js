/* ====================================================================================================
NAME:			[Service Code Filter]
BEHAVIOR:		Shows Service Code Filter.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
07/26/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.View.Component.Filter.ServiceCode', {
    extend: 'BIA.container.FilterContainer',
    alias: 'widget.App-View-Component-Filter-ServiceCode',
    layout: 'column',
    width: 210,
    items: [
          { xtype: 'label', text: 'Service Code:', baseCls: 'UPS_White',   width: '48%'},
          {
              xtype: 'clearCombo',
              store: {
                  type: 'webapi',
                  api: {
                      read: 'api/WebAPIFilter/SeviceCode'
                  },
                  remoteFilter: false
              },
              emptyText: 'Service Code',
              itemId: 'ServiceCode',              
              width: '48%',
              allowBlank: false,
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
              //triggers: {
              //    clear: {
              //        weight: 0,
              //        cls: Ext.baseCSSPrefix + 'form-clear-trigger',
              //        hidden: true,
              //        handler: 'onClearClick',
              //        scope: 'this'
              //    }
              //},

              ///**
              // * @method onClearClick
              // * execute when  clear trigger is clicked
              // */
              //onClearClick: function () {
              //    var me = this;
              //    me.reset();
              //    me.getTrigger('clear').hide();
              //    me.fireEvent('onclear', me, me.getValue());
              //    me.updateLayout();
              //    PgAtt.setService_code('All');
              //    this.onChange('');
              //},
              //onChange: function (newValue, oldValue, eOpts) {
              //    var me = this;
              //    if (!Ext.isEmpty(newValue) && newValue.length > 0) {
              //        me.getTrigger('clear').show();
              //        PgAtt.setService_code(newValue);
              //    } else {
              //        me.getTrigger('clear').hide();
              //        PgAtt.setService_code('All');
              //    }                 
              //    me.updateLayout();
              //},
              //listeners: {
              //    afterrender: function () {
              //        var me = this;
              //        if (me.getValue() != '') {
              //            me.getTrigger('clear').show();
              //        }
              //    }
              //}
          }

    ]
});