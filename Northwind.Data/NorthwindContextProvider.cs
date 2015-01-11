using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;
using Breeze.ContextProvider;
using Breeze.ContextProvider.EF6;
using System.Data.Entity;
using Northwind.RepositoryInterface;
using Northwind.Domain;

namespace Northwind.Data
{
    public class NorthwindContextProvider : IContextProvider
    {
        private EFContextProvider<NORTHWNDDbContext> _contextProvider;

        public NorthwindContextProvider(IDbContextFactory contextFactory)
        {

            _contextProvider = new EFContextProvider<NORTHWNDDbContext>();
        }

        protected EFContextProvider<NORTHWNDDbContext> ContextProvider
        {
            get { return _contextProvider; }
        }

        public string Metadata()
        {
            return _contextProvider.Metadata();
        }

        public IQueryable<Employee> Employees()
        {
            return _contextProvider.Context.Employees;
        }

        public IQueryable<Customer> Customers()
        {
            return _contextProvider.Context.Customers;
        }

        public IQueryable<Order> Orders()
        {
            return _contextProvider.Context.Orders;
        }

        public IQueryable<Order_Detail> Order_Details()
        {
            return _contextProvider.Context.Order_Details;
        }

        public IQueryable<Product> Products()
        {
            return _contextProvider.Context.Products;
        }


        public SaveResult SaveChanges(JObject saveBundle, TransactionSettings transactionSetting = null)
        {
            return _contextProvider.SaveChanges(saveBundle, transactionSetting);
        }



    }
}