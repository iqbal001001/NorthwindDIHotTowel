
using Northwind.Data;
//using Northwind.Data.Context;
using Northwind.RepositoryInterface;
using StructureMap;
using StructureMap.Configuration.DSL;
using StructureMap.Graph;
using StructureMap.Web;

namespace Northwind.DependencyResolverWeb
{

    public class WebAppRegistry : Registry
    {
        public WebAppRegistry()
        {
            Scan(
                scan =>
                {
                    scan.TheCallingAssembly();
                    scan.WithDefaultConventions();
                });

            For<IDbContextFactory>().HybridHttpOrThreadLocalScoped().Use<NorthwindDbContextFactory>();
            For<IUnitOfWork>().HybridHttpOrThreadLocalScoped().Use<NorthwindUnitOfWork>();
            For<IContextProvider>().HybridHttpOrThreadLocalScoped().Use<NorthwindContextProvider>();
            For<IEmployeeRepository>().HybridHttpOrThreadLocalScoped().Use<EmployeeRepository>();
            For<IOrderRepository>().HybridHttpOrThreadLocalScoped().Use<OrderRepository>();
            For<IOrderDetailRepository>().HybridHttpOrThreadLocalScoped().Use<OrderDetailRepository>();
            For<IProductRepository>().HybridHttpOrThreadLocalScoped().Use<ProductRepository>();
            For<ICustomerRepository>().HybridHttpOrThreadLocalScoped().Use<CustomerRepository>();
           

        }
    }

    
}
