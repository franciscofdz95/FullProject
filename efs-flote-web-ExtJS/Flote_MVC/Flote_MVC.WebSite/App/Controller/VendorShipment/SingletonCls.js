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
Ext.define('App.Controller.VendorShipment.SingletonCls', {
    alias: 'widget.App-Controller-VendorShipment-SingletonCls',
    alternateClassName: ['VendorShipSinCls'],
    singleton: true,
    VSColumnRenderSort: function VSColumnRenderSort(value, metaData, record, rowIndex, colIndex) {
        var refId = '';
        if (colIndex == 0) {
            var strReturn = '<span style="font-weight:bold; font-size:12px;"></span>';
            if (record.data['invoice_id'] !== 0) {
                if (record.data['AccrualFlag'] == 0) {
                    refId = record.get('reference_id');
                    switch (refId) {
                        case 100: this.items[0].icon = 'images/Sinfo.png'; break;
                        case 101: this.items[0].icon = 'images/PInfo.png'; break;
                        case 102: this.items[0].icon = 'images/NInfo.png'; break;
                        case 103: this.items[0].icon = 'images/FInfo.png'; break;
                        case 104: this.items[0].icon = 'images/CInfo.png'; break;
                        default: this.items[0].icon = 'images/info.png'; break;
                    }
                    this.items[0].tooltip = 'On In-Process Bill ID: ' + record.get("invoice_id");
                }
                else {
                    this.items[0].icon = 'images/accrual.png';
                    this.items[0].tooltip = 'Accruing: On In-Process Bill ID: ' + record.get("invoice_id");
                }
            } else {
                this.items[0].icon = '';
                this.items[0].tooltip = '';
            }
            return strReturn;
        }

        if (colIndex == 3) {
            if (value !== "") {
                if (PgAtt.getVendor_code() != '') {
                    return value + ' ' + '<i title="Remove Vendor code filter" class="fa fa-search-minus"></i>';
                }
                else {
                    return value + ' ' + '<i title="Add Vendor code filter" class="fa fa-search-plus"></i>';
                }
            }
            else {
                return value;
            }
        }

        if (colIndex == 4) {
            if (value !== "") {
                if (PgAtt.getMbl_number() != '') {
                    return value + ' ' + '<i title="Remove Mbl Number Filter" class="fa fa-search-minus"></i>';
                }
                else {
                    return value + ' ' + '<i title="Add Mbl Number Filter" class="fa fa-search-plus"></i>';
                }
            }
            else {
                return value;
            }
        }
        if (colIndex == 5) {

            if (value !== "") {
                if (PgAtt.getMbl_iata_busid() != '') {
                    return value + ' ' + '<i title="Remove CBOL Filter" class="fa fa-search-minus"></i>';
                }
                else {
                    return value + ' ' + '<i title="Add CBOL Filter" class="fa fa-search-plus"></i>';
                }
            }
            else {
                return value;
            }
        }

        if (colIndex == 6) {
            var comImgStr = '';
            metaData.style = "text-decoration: underline;cursor: pointer";
            if (record.get('RefNotes') != "") {
                comImgStr = ' <img src="images/comments.png" title="Reference Notes Comment" class="cursor_finger iconLaunchCol" style="margin: 0px;width:16px;height:16px;">'
            }
            if (value !== "") {
                return value + ' ' + comImgStr;
            }
            else {
                return '<a><span style="color:#1D598E;" >' + value + '</span></a>';
            }
        }

        if (colIndex == 7) {
            if (value !== "") {
                if (PgAtt.getShipment_number() != '') {
                    return '<i title="Remove Shipment Number Filter" class="fa fa-search-minus"></i>';
                }
                else {
                    return '<i title="Add Shipment Number Filter" class="fa fa-search-plus"></i>';
                }
            }
        }

        if (colIndex == 9) {

            if (value !== "") {
                if (PgAtt.getCharge_code() != '') {
                    return value + ' ' + '<i title="Remove Charge Code Filter" class="fa fa-search-minus"></i>';
                }
                else {
                    return value + ' ' + '<i title="Add Charge Code Filter" class="fa fa-search-plus"></i>';//<img title="" class="cursor_finger iconLaunchCol"  src="images/filter-add.png" />';
                }
            }
            else {
                return value;
            }
        }

        if (colIndex == 15) {
            var referenceId = record.get('reference_id');
            if (record.data['rowType'] == 'Custom' && (referenceId == 100 || referenceId == 101 || referenceId == 102 || referenceId == 103 || referenceId == 104)) {
                return value + ' ' + '<img style="margin: 0px; width: 16px; height: 16px;" src="images/warning.png" title="No E2K Entry">';
            }
            else if (record.data['old_amt'] !== record.data['buy_amt']) {
                return value + ' ' + '<img style="margin: 0px; width: 16px; height: 16px;" src="images/warning.png" title="Original Amt: ' + record.data['old_amt'] + '">';
            }
            else {
                return value;
            }
        }

        if (colIndex == 18) {

            refId = record.get('reference_id');

            if (record.data['comment'] !== "" || record.data['PaidDifferentlyReason'] !== '') {
                if ((record.data['PaidDifferentlyReason'] !== '') && (record.data['comment'] !== '')) {
                    return '<img style="margin: 0px; width: 16px; height: 16px;" id="imgCmt_#cnt#" src="images/comments.png" alt="' + record.data['comment'] + '" title="' + 'Paid Differrently Reason : ' + record.data['PaidDifferentlyReason'] + '       Comments: ' + record.data['comment'] + '">';
                } else if (record.data['PaidDifferentlyReason'] !== '') {
                    return '<img style="margin: 0px; width: 16px; height: 16px;" id="imgCmt_#cnt#" src="images/comments.png" alt="' + record.data['PaidDifferentlyReason'] + '" title="' + 'Paid Differrently Reason : ' + record.data['PaidDifferentlyReason'] + '">';
                } else {
                    return '<img style="margin: 0px; width: 16px; height: 16px;" id="imgCmt_#cnt#" src="images/comments.png" alt="' + record.data['comment'] + '" title="' + 'Comments  :' + record.data['comment'] + '">';
                }
            }
            else if (refId == 100 || refId == 101 || refId == 102 || refId == 103 || refId == 104) {
                if ((record.data['PaidDifferentlyReason'] !== '') && (record.data['comment'] !== '')) {
                    return '<img style="margin: 0px; width: 16px; height: 16px;" id="imgCmt_#cnt#" src="images/comments.png" alt="' + record.data['comment'] + '" title="' + 'Paid Differrently Reason : ' + record.data['PaidDifferentlyReason'] + '      Comments: ' + record.data['comment'] + '">';
                } else if (record.data['PaidDifferentlyReason'] != '') {
                    return '<img style="margin: 0px; width: 16px; height: 16px;" id="imgCmt_#cnt#" src="images/comments.png" alt="' + record.data['PaidDifferentlyReason'] + '" title="' + 'Paid Differrently Reason : ' + record.data['PaidDifferentlyReason'] + '">';
                } else {
                    return '<img style="margin: 0px; width: 16px; height: 16px;" id="imgCmt_#cnt#" src="images/comments.png" alt="' + record.data['comment'] + '" title="' + 'Comments  : ' + record.data['comment'] + '">';
                }
            }            

        }

        if (colIndex == 19) {
            var margin = 0;
            if (record.data['sellamtUser'] !== 0) { margin = ((record.data['sellamtUser'] - record.data['buy_amt_user']) / record.data['sellamtUser']) * 100; }
            return Math.round(margin) + '%';
        }

        if (colIndex == 20) {
            var AccrualFlag = '';
            if (record.data['AccrualFlag'] == 1) { AccrualFlag = 'X' }
            return AccrualFlag
        }
    }

});