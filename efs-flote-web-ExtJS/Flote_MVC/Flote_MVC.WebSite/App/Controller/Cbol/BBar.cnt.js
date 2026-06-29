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


Ext.define('App.Controller.Cbol.BBar', {
    extend: 'Ext.app.Controller',
    refs: [
        { ref: 'Current', selector: 'App-View-Main-TabPanel' },
        { ref: 'FilterPanel', selector: 'App-View-Component-Container-FilterPanelBase' }

    ],
    init: function () {
        var me = this;

        me.control({
            '[xtype="App-View-CBOL-BBar"] #btnConfirmUnmatchedCharges': {
                click: me.ConfirmUnmatchedCharges
            }

        });

    },
    // Get Bills Details Reports cell click event.

    ConfirmUnmatchedCharges: function ConfirmUnmatchedCharges(me) {
        var filter = this.getActiveFilterPanel();
        if (filter == null) {
            filter = this.getAllFilterPanel()[0];
        }
        var nonMatchedCount = CBOLSinCls.getNonMatchedCount();
        var isProcessed = CBOLSinCls.getProcessedCount();
        var cmtSaveBox = me.up('grid').down('#cmtConfirmUnmatchedCharges');
        var cmtSave = cmtSaveBox.getValue();
        var message = '';

        if (cmtSave != '' && cmtSave != 'undefined' && cmtSave != null) {
            if (isProcessed > 0) {
                message = 'Some of these charges (' + isProcessed + ') have already been selected on prior invoices.Please use invoice processing screen to split pay these charges. Click "Yes" to process rest of the charges?';

            }
            else {
                message = 'Are you sure to confirm this comment for all (<span class="titleBrown">' + nonMatchedCount + '</span>) ) Nonmatched records ?';

            }
            Ext.Msg.confirm('Process Cbol Charges Message', message, function (button) {
                if (button === 'yes') {
                    CBOLSinCls.processExcelDataToInvDetails('', cmtSave);
                    filter.fireEvent('btnApply');
                } else {
                    cmtSaveBox.setValue('');
                }

            }, me);

            cmtSaveBox.setValue('');
        }
        else {
            alert("Valid comment is missing for Unmatched charges");
        }
    }
});

