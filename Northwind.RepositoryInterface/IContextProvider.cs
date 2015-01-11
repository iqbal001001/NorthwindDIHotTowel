using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;
using Breeze.ContextProvider;
using Northwind.Domain;
namespace Northwind.RepositoryInterface
{
    public interface IContextProvider
    {
        string Metadata();
        SaveResult SaveChanges(JObject saveBundle, TransactionSettings transactionSetting = null);
        IQueryable<Employee> Employees();
        IQueryable<Customer> Customers();
        IQueryable<Order> Orders();
        IQueryable<Order_Detail> Order_Details();
        IQueryable<Product> Products();
    }
}
