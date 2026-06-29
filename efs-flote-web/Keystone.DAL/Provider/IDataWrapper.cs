using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Keystone.DAL.Provider
{
    public interface IDataWrapper
    {
        public DataWrapper GetDataFromSP(string spName, string[][] inputParams, string[] colNames);
    }
}
