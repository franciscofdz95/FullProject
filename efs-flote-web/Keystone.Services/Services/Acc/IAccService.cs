using Keystone.DAL.Model.Results;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Keystone.Services.Services.Acc
{
    public interface IAccService
    {
        Task<IEnumerable<AccNameModel>> GetAccName(string location_code, DateTime invoice_date);
    }
}
