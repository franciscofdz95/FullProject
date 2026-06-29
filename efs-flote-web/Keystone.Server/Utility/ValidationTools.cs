using Keystone.DAL.Model.Results;

namespace Keystone.Server.Utility
{
    public class ValidationTools
    {
        public ValidationTools()
        {

        }

        public List<BillsTResult> RemoveEmptyRows(List<BillsTResult> _billsTResults)
        {
            List<BillsTResult> validRows = _billsTResults.Where(d => !string.IsNullOrEmpty(d.InvRefNo) && !string.IsNullOrEmpty(d.Invoice_CID) && d.invoice_id != 0).ToList();

            return validRows;
        }

        public List<BillsPaymentsTResult> RemoveEmptyRows(List<BillsPaymentsTResult> _billsTResults)
        {
            List<BillsPaymentsTResult> validRows = _billsTResults.Where(d => !string.IsNullOrEmpty(d.InvRefNo) && !string.IsNullOrEmpty(d.Invoice_Num) && d.Invoice_Id != 0).ToList();

            return validRows;
        }
    }
}
