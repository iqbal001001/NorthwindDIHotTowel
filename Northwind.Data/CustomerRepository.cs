
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Northwind.Domain;
using Northwind.RepositoryInterface;

namespace Northwind.Data
{
    public class CustomerRepository : RepositoryBase<Customer>, ICustomerRepository
    {
        public CustomerRepository(IDbContextFactory contextFactory) : base(contextFactory) { }
    }

}