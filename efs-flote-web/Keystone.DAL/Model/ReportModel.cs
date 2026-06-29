using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Keystone.DAL.Model
{
    public class ReportModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Procedure { get; set; }
        public string Schema { get; set; }
        public bool Active { get; set; }
        public string ParametersSchema { get; set; }
    }
}
