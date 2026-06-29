/* ====================================================================================================
NAME:			[Accruals Controller]
BEHAVIOR:		Shows Accruals Controller.
_______________________________________________________________________________________________________
REVISION HISTORY
-------------------------------------------------------------------------------------------------------
Date			    Modified By			  Modifications
-------------------------------------------------------------------------------------------------------
02/10/2017        Sudhir Dandale		 Created.
 ======================================================================================================*/
Ext.define('App.Controller.Bills.ScannedImage.DocViewer', {
    extend: 'Ext.app.Controller',
    refs: [
        { ref: 'Current', selector: 'App-View-Main-TabPanel' },
        { ref: 'FilterPanel', selector: 'App-View-Component-Container-FilterPanelBase' }
    ],
    init: function () {
        var me = this;
        me.control({
            'App-View-Bills-PopUps-ScannedImage-DocViewer': {
                beforeshow: me.ReportTabBeforeRender
            },
            '[xtype="App-View-Bills-PopUps-ScannedImage-DocViewer"] #btnRejectScanSD': {
                click: me.RejectedScannedDoc
            },
            '[xtype="App-View-Bills-PopUps-ScannedImage-DocViewer"] #btnAttachScanSD': {
                click: me.AttachScannedDoc
            },
            '[xtype="App-View-Bills-PopUps-ScannedImage-DocViewer"] #btnCloseSD': {
                click: me.CloseWindow
            },
            '[xtype="App-View-Bills-PopUps-ScannedImage-DocViewer"] iframe': {
                click: me.ChangePg
            }

        });
    },
    ReportTabBeforeRender: function ReportTabBeforeRender(me) {
        if (me.type == 'attach') {
            this.AttachImage(me)
        } else {
            this.GetImage(me);
        }
    },
    RejectedScannedDoc: function RejectedScannedDoc(me) {
        var filter = this.getActiveFilterPanel();
        if (filter == null) {
            filter = this.getAllFilterPanel()[0];
        }
        var win = me.up('window');
        if (win.down('#cmtRejectScanDoc').getValue() != '') {
            var rec = win.rec;
            me.fireEvent('btnRejectScanSD', rec.get('invoice_id'), 'Printed', BIACore.Security.User.permissions[PgAtt.getGeoIndex()].userId, win.down('#cmtRejectScanDoc').getValue(), rec.get('ImageNumber'));
            PgAtt.setFilterGoFlag(true);
            filter.fireEvent('btnApply');
            win.close();
        } else {
            alert('Please Enter a comment why the Image is being rejected');
        }
    },
    AttachScannedDoc: function AttachScannedDoc(me) {
        var win = me.up('window');
        var rec = win.rec;
        var recImg = win.recImg;
        if (recImg.get("FOLDER").indexOf("RECYCLE") == -1) {
            this.AttachedScanDocument(rec.get("invoice_id"), recImg.get("IMAGENUMBER"), recImg.get("IMAGEURL"), recImg.get("SCAN_DEST"), recImg.get("FOLDER"));
            win.close();
        }
        else {
            alert("You cannot attach invoices to images that have been recycled by the Accounts Payable team. Please ensure you are selecting the correct image file");
        }
    },
    CloseWindow: function CloseWindow(me) {
        me.up('window').close();
    },
    AttachedScanDocument: function (invId, imgNo, imgURL, scanDest, folder) {
        var params = {
            InvoiceId: invId,
            ImageNumber: imgNo,
            ScanDest: scanDest,
            ImageURL: imgURL,
            UserId: BIACore.Security.User.permissions[PgAtt.getGeoIndex()].userId,
            FolderName: folder
        };

        BIA.Ajax.request({
            url: 'api/WebAPIReport/AttachedScanDocument',
            method: "POST",
            async: false,
            cache: false,
            dataType: "html",
            headers: {
                "Content-Type": "application/json"
            },
            jsonData: params,
            useDefaultXhrHeader: true,
            failure: function (conn, response, options, eOpts) {
                BIACore.Exception(conn.responseText);
                BIACore.Message(response);
            },
            scope: this
        });

        var tabPanel = this.getActiveCurrent();
        if (tabPanel == null) {
            tabPanel = this.getAllCurrent();
        }
        var activeTab = tabPanel.activeTab.activeTab;
        activeTab.fireEvent('activate', activeTab);
    },
    GetImage: function GetImage(me) {
        var rec = me.rec;
        var recImg = me.recImg;
        if (rec.get('invoice_status') == 'Scanned' && BIACore.Security.User.permissions[PgAtt.getGeoIndex()].EA_ProfileId != 1 && BIACore.Security.User.permissions[PgAtt.getGeoIndex()].EA_ProfileId != 3) {
            me.down('#btnRejectScanSD').setVisible(true);
            me.down('#cmtRejectScanDoc').setVisible(true);
        }
        var imgURL = ''
        if (recImg.length != undefined && recImg.length != 0) {
            if (recImg[0].imageURL != undefined) {
                imgURL = recImg[0].imageURL;
                me.down('#invIdSD').setValue(recImg[0].invoice_id);
                me.down('#vendorBillNoIdSD').setValue(recImg[0].InvRefNo);
                me.down('#vandorNameIdSD').setValue(recImg[0].vendor_name_english);
                me.down('#DocIdSD').setValue(recImg[0].ImageNumber);
                me.down('#billAmtIdSD').setValue(Utility.Formatting.NumFormat_Thousands_2Decimals(recImg[0].invoice_amt, ''));
                me.down('#billCurrencyIdSD').setValue(recImg[0].Invoice_CID);
            }
            else {
                imgURL = recImg[0].IMAGEURL;
                me.down('#invIdSD').setValue(rec.get("invoice_id"));
                me.down('#vendorBillNoIdSD').setValue(recImg[0].VEN_INVOICE);
                me.down('#vandorNameIdSD').setValue(rec.get("vendor_name_english"));
                me.down('#DocIdSD').setValue(recImg[0].IMAGENUMBER);
                me.down('#billAmtIdSD').setValue(Utility.Formatting.NumFormat_Thousands_2Decimals(rec.get("invoice_amt"), ''));
                me.down('#billCurrencyIdSD').setValue(rec.get("Invoice_CID"));
            }
        }
        else {
            imgURL = rec.data.imageURL;
            me.down('#invIdSD').setValue(rec.get("invoice_id"));
            me.down('#vendorBillNoIdSD').setValue(rec.get("InvRefNo"));
            me.down('#vandorNameIdSD').setValue(rec.get("vendor_name_english"));
            me.down('#DocIdSD').setValue(rec.get("ImageNumber"));
            me.down('#billAmtIdSD').setValue(Utility.Formatting.NumFormat_Thousands_2Decimals(rec.get("invoice_amt"), ''));
            me.down('#billCurrencyIdSD').setValue(rec.get("Invoice_CID"));
        }
        var filePath = imgURL;
        me.items.items[2].autoEl.src = 'TiffImg.aspx?File=' + filePath;
        return true;
    },
    AttachImage: function AttachImage(me) {
        var win = me;
        var recImg = me.recImg;
        var rec = me.rec;
        var ShowAttachScanBtn = 'Y';
        var scanDest = recImg.get('SCAN_DEST');
        var imgN0 = recImg.get("IMAGENUMBER").toString();
        var remitId = rec.get("AP_Remit_id").substr(rec.get("AP_Remit_id").length - 3, 3).toUpperCase();

        if (scanDest.indexOf(":1US_397") >= 0 && (scanDest.indexOf("STANDARD") >= 0 || scanDest.indexOf("TERM_PAY") >= 0) && remitId == "RCK") {
            ShowAttachScanBtn = 'N';
        }
        if (imgN0 != '' && imgN0.length > 6 && ShowAttachScanBtn == 'Y') {
            win.down('#btnAttachScanSD').setVisible(true);
        }
        var filepath = '';
        if (recImg != '') {
            win.down('#invIdSD').setValue(rec.get("invoice_id"));
            win.down('#vendorBillNoIdSD').setValue(recImg.get("VEN_INVOICE"));
            win.down('#vandorNameIdSD').setValue(rec.get("vendor_name_english"));
            win.down('#DocIdSD').setValue(recImg.get("IMAGENUMBER"));
            win.down('#billAmtIdSD').setValue(Utility.Formatting.NumFormat_Thousands_2Decimals(rec.get("invoice_amt"), ''));
            win.down('#billCurrencyIdSD').setValue(rec.get("Invoice_CID"));
            filepath = recImg.get("IMAGEURL");
        } else {
            win.down('#invIdSD').setValue(recImg.get("invoice_id"));
            win.down('#vendorBillNoIdSD').setValue(recImg.get("InvRefNo"));
            win.down('#vandorNameIdSD').setValue(recImg.get("vendor_name_english"));
            win.down('#DocIdSD').setValue(recImg.get("ImageNumber"));
            win.down('#billAmtIdSD').setValue(Utility.Formatting.NumFormat_Thousands_2Decimals(recImg.get("invoice_amt"), ''));
            win.down('#billCurrencyIdSD').setValue(recImg.get("Invoice_CID"));
            filepath = rec.get("imageURL");
        }
        me.items.items[2].autoEl.src = 'TiffImg.aspx?File=' + filepath;
        return true;

    },
    ChangePg: function ChangePg(Pg) {
        var SrcBig = 'ViewImg.aspx?View=1&FilePath=' + GetBigSrc("FilePath") + "&Pg=" + Pg + "&Height=" + 1000 + "&Width=" + 1000;
        $(document).getElementById('_imgBig').src = SrcBig;
    },
    GetBigSrc: function GetBigSrc(Qrystr) {
        var Qry = $(document).getElementById('_imgBig').src;
        var gy = Qry.split("&");
        for (var i = 0; i < gy.length; i++) {
            var ft = gy[i].split("=");
            if (ft[0] == Qrystr)
                return ft[1];
        }
    }
});