/* ====================================================================================================
NAME:			[Bill Grid Report]
BEHAVIOR:		Shows Bill Report.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
03/07/2017        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.View.ImportExcel.Excel.Sheet', {
    extend: 'Ext.container.Container',
    alias: 'widget.App-View-ImportExcel-Excel-Sheet',
    border: true,
    cls: 'UPS_White_1',
    init: function () {
        this.callParent(arguments);
    },  
    bodyStyle: 'padding: 5px;',
    columnCount: 13,
    html: '<div style="margin:15px;font-size:2em;">Please press Import Vendor Template button and upload an .xls file</div>',
    autoScroll: true,
    margin: 5,
    tpl: new Ext.XTemplate(
        '<table id="tblExcel" width="95%" cellspacing="1" cellpadding="1" style="margin-right:2px;">',
            '<tbody id="tblExcelBody">',
                '<tr>',
                        '<td class="header">Row&nbsp;#</td>',
                        '<td class="header" id="fldF1"></td>',
                        '<td class="header" id="fldF2"></td>',
                        '<td class="header" id="fldF3"></td>',
                        '<td class="header" id="fldF4"></td>',
                        '<td class="header" id="fldF5"></td>',
                        '<td class="header" id="fldF6"></td>',
                        '<td class="header" id="fldF7"></td>',
                        '<td class="header" id="fldF8"></td>',
                        '<td class="header" id="fldF9"></td>',
                        '<td class="header" id="fldF10"></td>',
                        '<td class="header" id="fldF11"></td>',
                        '<td class="header" id="fldF12"></td>',
                        '<td class="header" id="fldF13"></td>',
                       /* '<td class="header" id="fldF14"></td>',
                        '<td class="header" id="fldF15"></td>',
                        '<td class="header" id="fldF16"></td>',
                        '<td class="header" id="fldF17"></td>',
                        '<td class="header" id="fldF18"></td>',
                        '<td class="header" id="fldF19"></td>',
                        '<td class="header" id="fldF20"></td>',*/
                    '</tr>',
                '<tpl for=".">',
                    '<tr id="trExcelRow_{[xindex]}" class="{[this.formatStart(xindex)]}">',
                        '<td class="ExcelCell">{[xindex]}</td>',
                        '<td name="trExcelCell_1" class="ExcelCell trExcelCell_1">{F1}</td>',
                        '<td name="trExcelCell_2" class="ExcelCell trExcelCell_2">{F2}</td>',
                        '<td name="trExcelCell_3" class="ExcelCell trExcelCell_3">{F3}</td>',
                        '<td name="trExcelCell_4" class="ExcelCell trExcelCell_4">{F4}</td>',
                        '<td name="trExcelCell_5" class="ExcelCell trExcelCell_5">{F5}</td>',
                        '<td name="trExcelCell_6" class="ExcelCell trExcelCell_6">{F6}</td>',
                        '<td name="trExcelCell_7" class="ExcelCell trExcelCell_7">{F7}</td>',
                        '<td name="trExcelCell_8" class="ExcelCell trExcelCell_8">{F8}</td>',
                        '<td name="trExcelCell_9" class="ExcelCell trExcelCell_9">{F9}</td>',
                        '<td name="trExcelCell_10" class="ExcelCell trExcelCell_10">{F10}</td>',
                        '<td name="trExcelCell_11" class="ExcelCell trExcelCell_11">{F11}</td>',
                        '<td name="trExcelCell_12" class="ExcelCell trExcelCell_12">{F12}</td>',
                        '<td name="trExcelCell_13" class="ExcelCell trExcelCell_13">{F13}</td>',
                       /* '<td name="trExcelCell_14" class="ExcelCell trExcelCell_14">{F14}</td>',
                        '<td name="trExcelCell_15" class="ExcelCell trExcelCell_15">{F15}</td>',
                        '<td name="trExcelCell_16" class="ExcelCell trExcelCell_16">{F16}</td>',
                        '<td name="trExcelCell_17" class="ExcelCell trExcelCell_17">{F17}</td>',
                        '<td name="trExcelCell_18" class="ExcelCell trExcelCell_18">{F18}</td>',
                        '<td name="trExcelCell_19" class="ExcelCell trExcelCell_19">{F19}</td>',
                        '<td name="trExcelCell_20" class="ExcelCell trExcelCell_20">{F20}</td>',*/
                    '</tr>',
                '</tpl>',
            '</tbody>',
        '</table>', {
            formatStart: function (val) {
                if (val === 1) {
                    return "ExcelHeader";
                }
                if (val === 2) {
                    return "ExcelDataStartRow";
                }
            }
        }
    )
});
