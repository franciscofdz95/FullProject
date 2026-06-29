using Keystone.DAL.Model;
using static Keystone.Services.Services.MultiUpload.MultiUploadService;

namespace Keystone.Services.Services.MultiUpload
{
    public interface IMultiUploadService
    {
        Task<HashSet<string>> CheckExistingFilesByXml(string name, IEnumerable<string> fileNames);

        IReadOnlyCollection<UploadTypeDefinition> GetUploadTypeDefinitions();
    }
}
