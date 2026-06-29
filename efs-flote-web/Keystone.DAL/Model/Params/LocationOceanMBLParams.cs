using System;

namespace Keystone.DAL.Model.Params
{
    public class LocationOceanMBLParams
    {
        public string? AcctYear { get; set; }
        public string? AcctMonth { get; set; }
        public string? DisplayCurr { get; set; }
        public string? Loctype { get; set; }
        public string? OrigDest { get; set; }
        public string? LocCode { get; set; }
        public string? Origin { get; set; }
        public string? Destination { get; set; }
        public string? StartDate { get; set; }
        public string? EndDate { get; set; }
        public string? MBLCostBasis { get; set; }
        public string? MBLNumber { get; set; }
        public string? ContainerNumber { get; set; }
        public string? ShipmentNumber { get; set; }
        public string? CarrierBol { get; set; }
        public string? ChargeStatus { get; set; }
        public string? Country { get; set; }

        public SP_Params ToSPParams()
        {
            var p = new SP_Params
            {
                PageName = "LocationOceanMBL",
                AcctYear = AcctYear,
                AcctMonth = AcctMonth,
                DisplayCurr = DisplayCurr,
                Loctype = Loctype,
                OrigDest = OrigDest,
                LocCode = LocCode,
                Origin = Origin,
                Destination = Destination,
                MBLCostBasis = MBLCostBasis,
                MBLNumber = MBLNumber,
                ContainerNumber = ContainerNumber,
                ShipmentNumber = ShipmentNumber,
                CarrierCBOL = CarrierBol,
                ChargeStatus = ChargeStatus,
                CountryCode = Country
            };

            if (!string.IsNullOrEmpty(StartDate))
                p.StartDate = StartDate.Length > 10 ? StartDate[..10] : StartDate;

            if (!string.IsNullOrEmpty(EndDate))
                p.EndDate = EndDate.Length > 10 ? EndDate[..10] : EndDate;

            return p;
        }
    }
}