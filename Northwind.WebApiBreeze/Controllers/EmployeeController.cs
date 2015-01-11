using System;
using System.Linq;
using System.Web.Http;
using Breeze.ContextProvider;
using Newtonsoft.Json.Linq;
using Breeze.ContextProvider.EF6;
using Breeze.WebApi2;
using Northwind.RepositoryInterface;
using Northwind.Domain;


namespace Northwind.WebApiBreeze.Controllers
{
    [BreezeController]
    public class EmployeeController : ApiController
    {
        private readonly IEmployeeRepository _employeeRepository;
        private readonly ICustomerRepository _customerRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IContextProvider _contextProvider;

        public EmployeeController(IEmployeeRepository employeeRepository, ICustomerRepository customerRepository,
                                    IUnitOfWork unitOfWork, IContextProvider contextProvider)
        {
            _employeeRepository = employeeRepository;
            _customerRepository = customerRepository;
            _unitOfWork = unitOfWork;
            _contextProvider = contextProvider;
           // _contextPovider = new  EFEFContextProvider<>();
        }

        // ~/breeze/todos/Metadata 
        [HttpGet]
        public string Metadata()
        {
            return _contextProvider.Metadata();
        }

        // ~/breeze/todos/Todos
        // ~/breeze/todos/Todos?$filter=IsArchived eq false&$orderby=CreatedAt 
        [HttpGet]
    
        public IQueryable<Employee> Employees()
        {
            return _contextProvider.Employees();
            //return _employeeRepository.Get(); //.Context.Todos;
        }

        [HttpGet]
        public IQueryable<Customer> Customers()
        {
            return _contextProvider.Customers();
            //return _customerRepository.Get(); //.Context.Todos;
        }

        [HttpGet]
        public IQueryable<Order> Orders()
        {
            return _contextProvider.Orders();
        }

        [HttpGet]
        public IQueryable<Order_Detail> OrderDetails()
        {
            return _contextProvider.Order_Details();
        }

        [HttpGet]
        public IQueryable<Product> Products()
        {
            return _contextProvider.Products();
        }

        // ~/breeze/todos/SaveChanges
        [HttpPost]
        public SaveResult SaveChanges(JObject saveBundle)
        {
            return _contextProvider.SaveChanges(saveBundle);
        }

      
       
    }
}
