/* ====================================================================================================
NAME:			[Shipment Customer Info]
BEHAVIOR:		Shows Shipment Customer Info.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
12/16/2016        mmw7kwz		 Created.
 ======================================================================================================*/
Ext.define('App.View.ShipmentSummary.CustomerInfo', {
	extend: 'Ext.FormPanel',
	alias: 'widget.App-View-ShipmentSummary-CustomerInfo',
	baseCls: 'UPS_Gray_1',
	tbar: [
		  {
			  xtype: 'App-View-Component-Common-TbarPanel', reportType: 'ShipmentCustInfo', listeners: {
				  afterrender: function () {
				      this.down('label').setText('Customer');
				      this.down('#btnExcelExport').setVisible(false);
				  }
			  }
		  }
	],
	layout: {
		type: 'table',
		columns: 1
	},
	loadValues: function (jsonObject) {
		if (jsonObject != null)
			{
		this.getForm().setValues(jsonObject);
		this.down('#CUSTOMER_GROUP').setValue(jsonObject.CUSTOMER_GROUP);
		var shipper = jsonObject.SH_ACCOUNT_NBR + '-' + jsonObject.SH_NAME + '<br/>' + jsonObject.SH_ADDRESS_ONE + '<br/>' +
						jsonObject.SH_CITY + ' , ' + jsonObject.SH_STATE_CODE + ' - ' + jsonObject.SH_POSTAL_CODE + ' , ' + jsonObject.SH_COUNTRY_CODE;
		this.down('#SH_ACCOUNT_NBR').setValue(shipper);
		var consignee = jsonObject.CO_ACCOUNT_NBR + '-' + jsonObject.CO_NAME + '<br/>' + jsonObject.CO_ADDRESS_ONE + '<br/>' +
						jsonObject.CO_CITY + ' , ' + jsonObject.CO_STATE_CODE + ' - ' + jsonObject.CO_POSTAL_CODE + ' , ' + jsonObject.CO_COUNTRY_CODE;
		this.down('#CO_ACCOUNT_NBR').setValue(consignee);
		var freight =  jsonObject.PAYOR_ACCOUNT_NBR + '-' + jsonObject.PAYOR_NAME + '<br/>' + jsonObject.FP_ADDRESS_ONE + '<br/>' +
						jsonObject.FP_CITY + ' , ' + jsonObject.FP_STATE_CODE + ' - ' + jsonObject.FP_POSTAL_CODE + ' , ' + jsonObject.FP_COUNTRY_CODE;
		this.down('#PAYOR_NAME').setValue(freight);
		}
	},
	items: [
			{ xtype: 'displayfield', fieldLabel: 'Customer Group:', labelStyle: 'color:#292984;font-weight:bold; font-size:11px;', fieldStyle: 'font-weight:bold; font-size:11px;', itemId: 'CUSTOMER_GROUP', border: 2, margin: '2 2 2 2' },
			{ xtype: 'displayfield', fieldLabel: 'Shipper:', labelStyle: 'color:#292984;font-weight:bold; font-size:11px;', fieldStyle: 'font-weight:bold; font-size:11px;', itemId: 'SH_ACCOUNT_NBR', border: 2, margin: '2 2 2 2' },
			{ xtype: 'displayfield', fieldLabel: 'Consignee:', labelStyle: 'color:#292984;font-weight:bold; font-size:11px;', fieldStyle: 'font-weight:bold; font-size:11px;', itemId: 'CO_ACCOUNT_NBR', border: 2, margin: '2 2 2 2' },
			{ xtype: 'displayfield', fieldLabel: 'Freight Payer:', labelStyle: 'color:#292984;font-weight:bold; font-size:11px;', fieldStyle: 'font-weight:bold; font-size:11px;', itemId: 'PAYOR_NAME', border: 2, margin: '2 2 2 2' }
	]
});