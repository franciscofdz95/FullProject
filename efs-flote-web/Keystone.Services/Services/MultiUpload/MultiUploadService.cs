using Keystone.DAL.Model;
using Keystone.DAL.Provider;
using System.Data;

namespace Keystone.Services.Services.MultiUpload
{
    public class MultiUploadService : IMultiUploadService
    {
        private readonly IDataProvider _dataProvider;
        private readonly IDataWrapper _idataWrapper;
        //private readonly ILogger _log = Log.ForContext<Service>();

        public MultiUploadService(IDataProvider dataProvider, IDataWrapper idataWrapper)
        {
            _dataProvider = dataProvider;
            _idataWrapper = idataWrapper;
        }

        public record UploadTypeDefinition(
              string Key,
              string DisplayText,
              string AcceptedFileTypes,
              string? ValidationProperty = null
          );

        // Single source of truth
        private static readonly IReadOnlyDictionary<string, UploadTypeDefinition> UploadTypeConfigs =
            new Dictionary<string, UploadTypeDefinition>(StringComparer.OrdinalIgnoreCase)
            {
                ["adhoc"] = new("adhoc", "Demand Accrual - Adhoc Log", ".xlsx,.xls,.xlsm", "isAdhocFile"),
                ["anc"] = new("anc", "Common Carriage Accrual - ANC File", ".xlsx,.xls", "isAncFile"),
                ["gateway"] = new("gateway", "Scheduled Accrual - Gateway Flight Confirmation File", ".xlsx,.xls", "isGatewayFile"),
                ["hnl"] = new("hnl", "Common Carriage Accrual - HNL File", ".xlsx,.xls", "isHnlFile"),
                ["jrnl_853"] = new("jrnl_853", "Corporate Journals - JE853 Journal", ".xlsx,.xls,.xlsm", "isJrnl853File"),
                ["jrnl_857"] = new("jrnl_857", "Corporate Journals - JE857 Journal", ".xlsx,.xls,.xlsm", "isJrnl857File"),
                ["obi_fdb"] = new("obi_fdb", "Corporate Journals - OBI FDM File", ".xlsx,.xls", "isObiFdbFile"),
                ["onestream"] = new("onestream", "Corporate Journals - OneStream File", ".xlsx,.xls", "isOneStreamFile"),

                ["sdc_demand_approved_invoice"] = new("sdc_demand_approved_invoice", "Demand Accrual - SDC Demand Approved Invoices File", ".xlsx,.xls,.xlsm"),
                ["sdc_demand_review_invoice"] = new("sdc_demand_review_invoice", "Demand Accrual - SDC Demand Reviewed Invoices File", ".xlsx,.xls,.xlsm"),
                ["sdc_demand_submitted_invoice"] = new("sdc_demand_submitted_invoice", "Demand Accrual - SDC Demand Submitted Invoices File", ".xlsx,.xls,.xlsm"),
                ["sdc_demand_uninvoiced"] = new("sdc_demand_uninvoiced", "Demand Accrual - SDC Demand Uninvoiced File", ".xlsx,.xls,.xlsm"),

                ["sdc_sch_approved_invoice"] = new("sdc_sch_approved_invoice", "Scheduled Accrual - SDC Scheduled Approved Invoices File", ".xlsx,.xls,.xlsm"),
                ["sdc_sch_paid_invoice"] = new("sdc_sch_paid_invoice", "Scheduled Accrual - SDC Scheduled Paid Invoices File", ".xlsx,.xls,.xlsm"),

                ["writeoff"] = new("writeoff", "Accrual Writeoff File", ".xlsx,.xls", "isWriteOffFile"),
                //ESE-0326-1
                ["airlinecorporate"] = new("airlinecorporate", "Airline Corporate File", ".xlsx, .xls", "isAirlineCorporateFile"),
                ["airroutecode"] = new("airroutecode", "Air Route Code File", ".xlsx, .xls", "isAirRouteFile")
            };

        // AllowedUploadTypes is derived automatically
        private static HashSet<string> AllowedUploadTypes => UploadTypeConfigs.Keys.ToHashSet(StringComparer.OrdinalIgnoreCase);

        public IReadOnlyCollection<UploadTypeDefinition> GetUploadTypeDefinitions() => [.. UploadTypeConfigs.Values];

        public static void ValidateUploadType(string type)
        {
            if (!AllowedUploadTypes.Contains(type))
                throw new ArgumentException($"Unsupported upload type: {type}");
        }

        public async Task<HashSet<string>> CheckExistingFilesByXml(string name, IEnumerable<string> fileNames)
        {
            ValidateUploadType(name);

            var list = fileNames?
                .Where(x => !string.IsNullOrWhiteSpace(x))
                .Select(x => x.Trim())
                .Distinct(StringComparer.OrdinalIgnoreCase)
                .ToList() ?? [];

            if (list.Count == 0)
                return new HashSet<string>(StringComparer.OrdinalIgnoreCase);

            var reportXml = BuildFileNamesReportXml(list);

            var parameters = new DBParameter[]
            {
                new ("@report_xml", DbType.Xml, reportXml)
            };

            var proc = $"AppObject.usp_GET_Audit_Log_File_Names";

            var rows = await _dataProvider.ExecuteAsync<UploadExistingFileRow>(
                proc,
                CommandType.StoredProcedure,
                parameters);

            return rows
                .Select(r => r.File_Name)
                .Where(x => !string.IsNullOrWhiteSpace(x))
                .ToHashSet(StringComparer.OrdinalIgnoreCase);
        }

        private static string BuildFileNamesReportXml(IEnumerable<string> fileNames)
        {
            // <files><f name="a.xlsx"/><f name="b.xlsx"/></files>
            var root = new System.Xml.Linq.XElement("files",
                fileNames.Select(fn => new System.Xml.Linq.XElement("f",
                    new System.Xml.Linq.XAttribute("name", fn)))
            );

            return root.ToString(System.Xml.Linq.SaveOptions.DisableFormatting);
        }
    }
    public class UploadExistingFileRow
    {
        public string File_Name { get; set; } = "";
    }
}
