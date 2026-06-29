using System;

namespace BIACore.Model
{
    public class FingerprintValue
    {
        public string FingerprintId { get; set; }
        public string Value { get; set; }
        public DateTime CreateDate { get; set; }
        public int UsageCount { get; set; }

        public FingerprintValue() { }
    }
}
