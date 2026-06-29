/* ====================================================================================================
NAME:			[CBOL BBar Controller ]
BEHAVIOR:		Performs Action and  data for Cbol BBar action event.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
02/28/2017        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.Controller.InvoiceProcessing.Comments', {
    extend: 'Ext.app.Controller',
    refs: [
        { ref: 'Current', selector: 'App-View-Main-TabPanel' },
        { ref: 'FilterPanel', selector: 'App-View-Component-Container-FilterPanelBase' }

    ],
    init: function () {
        var me = this;

        me.control({
            '[xtype="App-View-InvoiceProcessing-CommentsW"]': {
                beforerender: me.WindowBeforeRender,
                beforeclose: me.WindowBeforeClose
            },
            '[xtype="App-View-InvoiceProcessing-CommentsW"] #btnSaveCommentId': {
                click: me.SaveComment
            },
            '[xtype="App-View-InvoiceProcessing-CommentsW"] #btnCancelExchangeId': {
                click: me.CloseWindow
            }

        });
    },
    SaveComment: function SaveComment(me) {
        var win = me.up('window');
        var row = win.rowDetails;
        var comment = win.down('#cmtExchRateId').getValue()
        var OriginErrorOther = 'Origin error - other';
        var DestinationErrorOther = 'Destination error - other';
        var ErrorMessage = 'Comment should not start with space or period or"." and Max length 100 characters';
        var ErrorMessage1 = 'Please enter valid comment to save the record.';
        var ErrorMessage2 = 'Please Select the Paid Differently Reason value.';
        if (IProcessingSCls.CheckPaidDifferentReason(row)) {
            var paidDifferentlyreason = win.down('#Pdr').down('combobox').getValue()
            if (paidDifferentlyreason != '' && paidDifferentlyreason == OriginErrorOther || paidDifferentlyreason == DestinationErrorOther) {
                if (comment != '') {
                    var reg = new RegExp("^[A-Za-z0-9]");
                    if (comment.length <= 100 && reg.test(comment) && (comment.match('Period') == null || (comment.match('Period') != null && comment.match(('Period').index != 1)))) {
                        win.down('#msgCommentId').setText('');
                        row.set('comment', comment);
                        row.set('PaidDifferentlyReason', paidDifferentlyreason);
                        var result = IProcessingSCls.postInvoiceLine(row);
                        win.parentRefWin.loadValues();
                        if (result != null && result != '') {
                            row.set('comment', result['comment']);
                            row.set('PaidDifferentlyReason', result['PaidDifferentlyReason']);
                            win.close();
                        }
                    }
                    else { win.down('#msgCommentId').setText(ErrorMessage); return true; }
                } else {
                    win.down('#msgCommentId').setText(ErrorMessage1); return true;
                }
            } else {
                if (paidDifferentlyreason == null) {
                    win.down('#msgCommentId').setText(ErrorMessage2); return true;
                }
                else {
                    if (comment != '') {
                        reg = new RegExp("^[A-Za-z0-9]");
                        if (comment.length > 100 && !reg.test(comment) && !(comment.match('Period') == null || (comment.match('Period') != null && comment.match(('Period').index != 1)))) {
                            win.down('#msgCommentId').setText(ErrorMessage); return true;
                        }
                    }
                    win.down('#msgCommentId').setText('');
                    row.set('comment', comment);
                    row.set('PaidDifferentlyReason', paidDifferentlyreason)
                    result = IProcessingSCls.postInvoiceLine(row);
                    win.parentRefWin.loadValues();
                    if (result != null && result != '') {
                        row.set('comment', result['comment']);
                        row.set('PaidDifferentlyReason', result['PaidDifferentlyReason']);
                        win.close();
                    }
                }
            }
        }
        else {
            if (comment != '') {
                win.down('#msgCommentId').setText('');
                row.set('comment', comment);
                result = IProcessingSCls.postInvoiceLine(row);
                win.parentRefWin.loadValues();
                if (result != null && result != '') {
                    row.set('comment', result['comment']);
                    win.close();
                }
            }
            else { win.down('#msgCommentId').setText(ErrorMessage1); }
        }
    },
    CloseWindow: function CloseWindow(me) {
        var win = me.up('window');
        var comment = win.down('#cmtExchRateId').getValue()
        var paidDifferentlyreason = win.down('#Pdr').down('combobox').getValue()
        var row = win.rowDetails;
        if (paidDifferentlyreason == 'Origin error - other' || paidDifferentlyreason == 'Destination error - other' || paidDifferentlyreason == null || paidDifferentlyreason == '') {
            if (comment != '' && row.get('comment') != '') {
                win.close();
            }
        } else { win.close(); }
    },
    WindowBeforeClose: function WindowBeforeClose(win) {
        var row = win.rowDetails;
        var comment = win.down('#cmtExchRateId').getValue();
        var paidDifferentlyreason = win.down('#Pdr').down('combobox').getValue()
        if (paidDifferentlyreason == 'Origin error - other' || paidDifferentlyreason == 'Destination error - other' || paidDifferentlyreason == null || paidDifferentlyreason == '') {
            if (comment != '' && row.get('comment') != '') {
                return true;
            } else {
                win.down('#msgCommentId').setText('Please enter valid comment to save the record.');
                return false;
            }
        }
    },
    WindowBeforeRender: function WindowBeforeRender(me) {

        // Kaizen 13732: Currency Issue  by Sriram
        var rec = me.rowDetails;
        me.parentRefWin = Ext.ComponentQuery.query('#InvoiceDetailsId')[0];
        // Kaizen 13732: Currency Issue  by Sriram
        me.down('#shipNoExchId').setValue(rec.get('shpmnt_nbr'));
        me.down('#codeChargeExchId').setValue(rec.get('Charge_code'));
        me.down('#codeDescExchId').setValue(rec.get('CHARGE_DESCRIPTION'));
        if (rec.get('comment') != '') {
            me.down('#cmtExchRateId').setValue(rec.get('comment'));
        } else {
            me.down('#cmtExchRateId').setValue('');
        }
        if (IProcessingSCls.CheckPaidDifferentReason(rec)) {
            me.down('#Pdr').setVisible(true);
            if (rec.get('PaidDifferentlyReason') != '') {
                me.down('#Pdr').down('combobox').setValue(rec.get('PaidDifferentlyReason'))
            }
        } else {
            me.down('#Pdr').setVisible(false);
        }
    }


});

