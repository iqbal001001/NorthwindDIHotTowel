using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Northwind.Domain;
using Northwind.RepositoryInterface;

namespace Northwind.Data
{
    public class EmployeeRepository : RepositoryBase<Employee>, IEmployeeRepository
    {
        public EmployeeRepository(IDbContextFactory contextFactory) : base(contextFactory) { }
    }

}
