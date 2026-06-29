using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Keystone.DAL.Model.Results
{
    public class VendorShipmentRptModel
    {
        public int ROWNUMBER { get; set; }
        public string invOrder { get; set; }
        public string buy_last_update { get; set; }
        public string rcvd_at_dt { get; set; }
        public string vendor_code { get; set; }
        public string vendor_name { get; set; }
        public string location_code { get; set; }
        public string shipment_dim_fk { get; set; }
        public string shpmnt_nbr { get; set; }
        public string mbl_iata_busid { get; set; }
        public string charge_code { get; set; }
        public string charge_code_txt { get; set; }
        public string mbl_chg_fk { get; set; }
        public string CHARGE_DESCRIPTION { get; set; }
        public string Manifested_ind { get; set; }
        public string charge_status { get; set; }
        public string old_sell_amt { get; set; }
        public string sell_amt { get; set; }
        public string sell_cid { get; set; }
        public string buy_cid { get; set; }
        public string buy_amt { get; set; }
        public string invoice_amt { get; set; }
        public string old_cid { get; set; }
        public string old_amt { get; set; }
        public string buy_amt_user { get; set; }
        public string sell_amt_user { get; set; }
        public string diff_amt { get; set; }
        public string invoice_id { get; set; }
        public string invoice_status { get; set; }
        public string Invoice_detail_id { get; set; }
        public string refcomment { get; set; }
        public string comment { get; set; }
        public string invoicevat_id { get; set; }
        public string invoicevat_amt { get; set; }
        public string buy_override { get; set; }
        public string AccrualFlag { get; set; }
        public string MBL_fk { get; set; }
        public string MBL_nbr { get; set; }
        public string rev_split { get; set; }
        public string invoice_cid { get; set; }
        public string reference_id { get; set; }
        public string rowType { get; set; }
        public string PaidDifferentlyReason { get; set; }
        public string TotalRows { get; set; }
        public string TotCount { get; set; }
        public string sellamt { get; set; }
        public string sellamtUser { get; set; }
        public string key_id { get; set; }
        public string RefNotes { get; set; }
        public string DiffAmt { get; set; }

    }
}
