/* ====================================================================================================
NAME:			[Tab List Store]
BEHAVIOR:		Loads the store for all Tab.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
12/12/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/

//Ext.define('App.View.ImportExcel.Model.TabList', {
//    extend: 'Ext.data.Model',
//    fields: [
//        { name: 'TabName', type: 'string' }
//    ],

//    proxy: {
//        type: 'ajax',
//        url: 'api/Excel/ExcelTabList',
//        headers: {
//            "Content-Type": "application/json; charset=utf-8"
//        },
//        actionMethods: {
//            create: 'POST',
//            destroy: 'DELETE',
//            read: 'POST',
//            update: 'POST'
//        }
//    }
//});

//Ext.define('App.View.ImportExcel.Store.TabList', {
//    extend: 'Ext.data.Store',
//    model: 'App.View.ImportExcel.Model.TabList',
//    alias: 'store.TabList',
//    autoLoad: false,
//    listeners: {
//        load: {
//            fn: function () {
//            }
//        }
//    },
//    loadWithParameters: function (fileName) {      
//        this.load({
//            params:
//                Ext.encode({
//                    FileName: fileName,
//                    TabName: tabName
//                })

//            });

//    }
//});