namespace Keystone.DAL.Model
{
    public class ValidationResult
    {
        public List<ValidationDetailsResult> Details { get; set; } = [];
        public List<string> Errors => Details.Select(x => $"{x.Field} {x.Message}").ToList();
        public bool WithErrors => Errors.Count != 0;
    }

    public class ValidationDetailsResult
    {
        public string Field { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
    }
}
