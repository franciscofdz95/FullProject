/* ====================================================================================================
NAME:			[Bills Page Singleton Class]
BEHAVIOR:		All the actions related Bills page.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
11/14/2016        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.Controller.Vendors.SingletonCls', {
    alias: 'widget.App-Controller-Vendors-SingletonCls',
    alternateClassName: ['VendorsSinCls'],
    singleton: true,
    VendorsColumnRenderSort: function VendorsColumnRenderSort(value, metaData, record, rowIndex, colIndex, store, view) {
        if (colIndex == 2) {
            if (value !== "") {
                if (PgAtt.getVendor_code() != '' && this.columnName == 'colApVendorId') {
                    return value + ' ' + '<i title="remove AP Vendor Id Filter" class="fa fa-search-minus"></i>';
                }
                else {
                    return value + ' ' + '<i title="Add AP Vendor Id Filter" class="fa fa-search-plus"></i>';
                }
            }
            else {
                return value;
            }
        }

        if (colIndex == 3) {
            if (value !== "") {
                if (PgAtt.getE2k_Carrier_Code() != '') {
                    return value + ' ' + '<i title="Remove E2K Carrier Code Filter" class="fa fa-search-minus"></i>';
                }
                else {
                    return value + ' ' + '<i title="Add E2K Carrier Code Filter" class="fa fa-search-plus"></i>';
                }
            }
            else {
                return value;
            }
        }

        if (colIndex == 4) {
            if (value !== "") {
                if (PgAtt.getVendor_Name_English() != '') {
                    return value + ' ' + '<i title="Remove Vendor Name English" class="fa fa-search-minus"></i>';
                }
                else {
                    return value + ' ' + '<i title="Add Vendor Name English" class="fa fa-search-plus"></i>';
                }
            }
            else {
                return value;
            }
        }
        if (colIndex == 5) {

            if (value !== "") {
                if (PgAtt.getVendor_Legal_Name() != '') {
                    return value + ' ' + '<i title="Remove Vendor Legal Name Filter" class="fa fa-search-minus"></i>';
                }
                else {
                    return value + ' ' + '<i title="Add Vendor Legal Name Filter" class="fa fa-search-plus"></i>';
                }
            }
            else {
                return value;
            }
        }

        if (colIndex == 6) {
            if (value !== "") {
                if (PgAtt.getVendor_code() != '' && this.columnName == 'colRemitId') {
                    return value + ' ' + '<i title="Remove AP Remit id Filter" class="fa fa-search-minus"></i>';
                }
                else {
                    return value + ' ' + '<i title="Add AP Remit id Filter" class="fa fa-search-plus"></i>';
                }
            }
            else {
                return value;
            }
        }


    }

});