/* ====================================================================================================
NAME:			[Sheet Controller]
BEHAVIOR:		Actions and Event related to Import Excel Sheet Controller.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
03/14/2017        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.Controller.ImportExcel.Excel.Sheet', {
    extend: 'Ext.app.Controller',
    refs: [
        { ref: 'Current', selector: 'App-View-ImportExcel-Report' }
    ],
    init: function () {

        this.control({
            'App-View-ImportExcel-Excel-Sheet': {
                beforeshow: this.SheetBeforeShow,
                DeleteComboBoxes: this.DeleteComboBoxes
            }

        });
    },
    SheetBeforeShow: function SheetBeforeShow(me) {
        var params = { FileName: ImportExcelSCls.getTargetPath(), TabName: ImportExcelSCls.getTabName() };
        BIA.Ajax.request({
            url: 'api/WebAPIReport/ExcelImport',
            method: "POST",
            async: false,
            cache: false,
            dataType: "html",
            headers: {
                "Content-Type": "application/json"
            },
            jsonData: params,
            useDefaultXhrHeader: true,
            success: function (conn, response, options, eOpts) {
                var data = Ext.decode(conn.responseText);
                me.update(data);
                this.createFieldPickers(me);
                this.loadCBData(me);
            },
            scope: this
        });

    },
    updateTemplate: function (data) {
        this.update(data);
    },
    ReloadStores: function ReloadStores(me) {
        var win = this.getActiveCurrent();
        var selectedValues, tempStore, i, idxStore, j;
        selectedValues = new Object({});
        for (i = 1; i <= me.columnCount; i++) {
            if (Ext.ComponentQuery.query('#cbx' + i)[0].getValue() !== undefined && Ext.ComponentQuery.query('#cbx' + i)[0].getValue() !== null) {
                selectedValues['cbx' + i] = Ext.ComponentQuery.query('#cbx' + i)[0].getValue();
                win.down('#btnCommitExcelImport').enable();
            }
        }

        for (idxStore = 1; idxStore <= me.columnCount; idxStore++) {
            tempStore = Ext.getStore('stoFieldList' + idxStore);
            tempStore.clearFilter(false);
            for (j in selectedValues) {
                tempStore.filterBy(function (item) {
                    var flag = true;
                    for (i in selectedValues) {
                        if ([item.get("ColumnName")].indexOf(selectedValues[i]) >= 0) {
                            flag = false;
                            break;
                        }

                    }
                    if (flag) {
                        return item.get("ColumnName");
                    } else {
                        return false;
                    }
                }, me);
            }

        }
    },
    createFieldPickers: function (me) {
        var cb, i, self = this;
        for (i = 1; i <= me.columnCount; i++) {

            Ext.create('Ext.data.Store', {
                fields: [{ name: 'DisplayName', type: 'string' }, { name: 'ColumnName', type: 'string' }],
                storeId: 'stoFieldList' + i,
                data: ImportExcelSCls.getColumnFieldsListData()
            })

            cb = new Ext.form.field.ComboBox({
                store: 'stoFieldList' + i,
                displayField: 'DisplayName',
                valueField: 'ColumnName',
                itemId: 'cbx' + i,
                queryMode: 'local',
                hideLabel: false,
                hideTrigger: false,
                typeAhead: false,
                lastCellColor: '',
                triggers: {
                    clear: {
                        weight: 0,
                        cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                        hidden: false,
                        handler: 'onClearClick',
                        scope: 'this'
                    }
                },
                onClearClick: function () {
                    var cellID;
                    this.clearValue();
                    self.ReloadStores(me, this.itemId, this.store);
                    cellID = this.itemId.replace('cbx', '');
                    if (this.lastCellColor !== '') {
                        $('.trExcelCell_' + cellID).removeClass(this.lastCellColor);
                    }
                },
                listeners: {
                    select: function (combo) {
                        self.ReloadStores(me, this.itemId, this.store);
                        var cellID, cbxValue;
                        cellID = this.itemId.replace('cbx', '');
                        cbxValue = combo.getValue();
                        if (this.lastCellColor !== '') {
                            $('.trExcelCell_' + cellID).removeClass(this.lastCellColor);
                        }
                        $('.trExcelCell_' + cellID).addClass(cbxValue);
                        this.lastCellColor = cbxValue;
                    }
                }
            });
            cb.render(Ext.get("fldF" + i));
        }

        /*ignore jslint end*/
    },
    loadCBData: function (me) {
        var self = this;
        var cbDate, cbContainerNum, cbContainerType, cbContainerCount, cbCarrierBOL, cbJobNum, cbChargeDesc, cbAmount, cbVerifiedAmt, cbRatesMtch, cbComment;
        var stoDate = Ext.data.StoreManager.lookup('stoFieldList1');
        if (stoDate.loading === false) {
            cbDate = Ext.ComponentQuery.query('#cbx1')[0];
            cbDate.setValue(stoDate.getAt(0).get('ColumnName'));
        }

        var stoCN = Ext.data.StoreManager.lookup('stoFieldList2');
        if (stoCN.loading === false) {
            cbContainerNum = Ext.ComponentQuery.query('#cbx2')[0];
            cbContainerNum.setValue(stoCN.getAt(1).get('ColumnName'));
        }

        var stoCT = Ext.data.StoreManager.lookup('stoFieldList3');
        if (stoCT.loading === false) {
            cbContainerType = Ext.ComponentQuery.query('#cbx3')[0];
            cbContainerType.setValue(stoCT.getAt(2).get('ColumnName'));
        }

        var stoCC = Ext.data.StoreManager.lookup('stoFieldList4');
        if (stoCC.loading === false) {
            cbContainerCount = Ext.ComponentQuery.query('#cbx4')[0];
            cbContainerCount.setValue(stoCC.getAt(3).get('ColumnName'));
        }

        var stoCBOL = Ext.data.StoreManager.lookup('stoFieldList5');
        if (stoCBOL.loading === false) {
            cbCarrierBOL = Ext.ComponentQuery.query('#cbx5')[0];
            cbCarrierBOL.setValue(stoCBOL.getAt(4).get('ColumnName'));
        }

        var stoJN = Ext.data.StoreManager.lookup('stoFieldList6');
        if (stoJN.loading === false) {
            cbJobNum = Ext.ComponentQuery.query('#cbx6')[0];
            cbJobNum.setValue(stoJN.getAt(5).get('ColumnName'));
        }

        var stoCD = Ext.data.StoreManager.lookup('stoFieldList7');
        if (stoCD.loading === false) {
            cbChargeDesc = Ext.ComponentQuery.query('#cbx7')[0];
            cbChargeDesc.setValue(stoCD.getAt(6).get('ColumnName'));
        }

        var stoAmt = Ext.data.StoreManager.lookup('stoFieldList8');
        if (stoAmt.loading === false) {
            cbAmount = Ext.ComponentQuery.query('#cbx8')[0];
            cbAmount.setValue(stoAmt.getAt(7).get('ColumnName'));
        }

        var stoVA = Ext.data.StoreManager.lookup('stoFieldList9');
        if (stoVA.loading === false) {
            cbVerifiedAmt = Ext.ComponentQuery.query('#cbx9')[0];
            cbVerifiedAmt.setValue(stoVA.getAt(8).get('ColumnName'));
        }

        var stoRM = Ext.data.StoreManager.lookup('stoFieldList10');
        if (stoRM.loading === false) {
            cbRatesMtch = Ext.ComponentQuery.query('#cbx10')[0];
            cbRatesMtch.setValue(stoRM.getAt(9).get('ColumnName'));
        }

        var stoCom = Ext.data.StoreManager.lookup('stoFieldList11');
        if (stoCom.loading === false) {
            cbComment = Ext.ComponentQuery.query('#cbx11')[0];
            cbComment.setValue(stoCom.getAt(10).get('ColumnName'));
        }

        var stoCCode = Ext.data.StoreManager.lookup('stoFieldList12');
        if (stoCCode.loading === false) {
            var cb12 = Ext.ComponentQuery.query('#cbx12')[0];
            cb12.setValue(stoCCode.getAt(11).get('ColumnName'));
        }

        var stoHBL = Ext.data.StoreManager.lookup('stoFieldList13');
        if (stoHBL.loading === false) {
            var cb13 = Ext.ComponentQuery.query('#cbx13')[0];
            cb13.setValue(stoHBL.getAt(12).get('ColumnName'));
            self.ReloadStores(me, cb13.itemId, stoHBL);
        }


        Ext.ComponentQuery.query('#btnCommitExcelImport')[0].enable();
    },
    DeleteComboBoxes: function DeleteComboBoxes(me) {
        for (var i = 1; i <= me.columnCount; i++) {
            if (Ext.ComponentQuery.query('#cbx' + i)[0].getValue() !== undefined && Ext.ComponentQuery.query('#cbx' + i)[0].getValue() !== null) {
                Ext.ComponentQuery.query('#cbx' + i)[0].destroy();
            }
        }
    }

});

