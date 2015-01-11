using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Northwind.Domain;
using Northwind.RepositoryInterface;

namespace Northwind.Data
{
    public class OrderDetailRepository : RepositoryBase<Order_Detail>, IOrderDetailRepository
    {
        public OrderDetailRepository(IDbContextFactory contextFactory) : base(contextFactory) { }
    }

}