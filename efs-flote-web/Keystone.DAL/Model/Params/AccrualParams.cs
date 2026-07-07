using System;

namespace Keystone.DAL.Model.Params
{
    public class AccrualParams
    {
        public string? AcctYear { get; set; }
        public string? AcctMonth { get; set; }
        public string? DisplayCurr { get; set; }
        public string? LocCode { get; set; }

        public SP_Params ToSPParams()
        {
            return new SP_Params
            {
                AcctYear = AcctYear,
                AcctMonth = AcctMonth,
                DisplayCurr = DisplayCurr,
                LocCode = LocCode
            };
        }
    }
}
