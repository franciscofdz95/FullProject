function ChangePg(Pg) {

    Src = 'ViewImg.aspx?View=1&FilePath=' + GetBigSrc("FilePath") + "&Pg=" + Pg + "&Height=" + GetBigSrc("Height") + "&Width=" + GetBigSrc("Width");
    SrcBig = 'ViewImg.aspx?View=1&FilePath=' + GetBigSrc("FilePath") + "&Pg=" + Pg + "&Height=" + 1000 + "&Width=" + 1000;
    SrcRevert = 'ViewImg.aspx?View=1&FilePath=' + GetBigSrc("FilePath") + "&Pg=" + Pg + "&Height=" + 600 + "&Width=" + 600;
    document.getElementById('_imgBig').src = SrcBig;
}

function GetBigSrc(Qrystr) {
    var Qry = document.getElementById('_imgBig').src;
    //alert(Qry);
    gy = Qry.split("&");
    for (i = 0; i < gy.length; i++) {
        ft = gy[i].split("=");
        if (ft[0] == Qrystr)
            return ft[1];
    }
}
$(document).ready(function () {
    $(".imgCls_").click(function () {
        let strId = this.id;
        let pg = strId.split("_");
        ChangePg(pg[1]);
    });
});
