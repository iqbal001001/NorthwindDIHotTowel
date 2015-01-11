using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Northwind.Domain;

namespace Northwind.RepositoryInterface
{
    public interface IEmployeeRepository : IRepository<Employee>
    {
    }
}
