/* ====================================================================================================
NAME:			[Field List Store]
BEHAVIOR:		Loads the store for all fields.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
12/12/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/

Ext.define('App.View.ImportExcel.Model.FieldList', {
    extend: 'Ext.data.Model',

    fields: [
        { name: 'DisplayName', type: 'string' },
        { name: 'ColumnName', type: 'string' }
    ],

    proxy: {
        type: 'webapi',
        api: {
            read: 'api/WebAPIReport/FieldList'
        }
    }
});

Ext.define('App.View.ImportExcel.Store.FieldList', {
    extend: 'Ext.data.Store',
    model: 'App.View.ImportExcel.Model.FieldList',
    alias: 'store.FieldList',
    autoLoad: false
});