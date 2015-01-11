using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Threading.Tasks;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Text;
using Northwind.Domain;
using Northwind.RepositoryInterface;
using Northwind.WebApiAngular.Models;
using AutoMapper;
using Northwind.WebApiAngular.ImageHelper;

namespace Northwind.WebApiAngular.Controllers
{
    [RoutePrefix("api/Customer")]
    public class CustomersApiController : ApiController
    {
        private readonly ICustomerRepository _customerRepository;
        private readonly IUnitOfWork _unitOfWork;

        public CustomersApiController(ICustomerRepository customerRepository, IUnitOfWork unitOfWork)
        {
            _customerRepository = customerRepository;
            _unitOfWork = unitOfWork;
            Mapper.CreateMap<Customer, CustomerIndexViewModel>();
            //    .ForMember(d => d.ReportsToEmployee, opt => opt.MapFrom(e => e.Employee1.FirstName));

             //.ForMember("ReportsToEmployee", opt => opt.ResolveUsing<GetCustomerID>()
             //                                           .ConstructedBy(() => new GetCustomerID(_customerId)));
        }

        // GET api/Employee
        public IEnumerable<CustomerIndexViewModel> GetCustomers()
        {
            var customerrepo = _customerRepository.Get().ToList();
            var customers = Mapper.Map<IEnumerable<CustomerIndexViewModel>>(customerrepo);
            return customers;
           

        }

        // GET api/values/5
        public CustomerIndexViewModel GetCustomer(string id)
        {
            Customer customer = _customerRepository.Get().FirstOrDefault(e => e.CustomerID == id);


            if (customer == null)
            {
                throw new HttpResponseException(Request.CreateResponse(HttpStatusCode.NotFound));
            }

            return Mapper.Map<CustomerIndexViewModel>(customer);
        }

        // PUT api/Customer/5
        public HttpResponseMessage PutCustomer(string id, [FromBody] Customer customer)
        {
            if (!ModelState.IsValid)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }

            if (id != customer.CustomerID.ToString())
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest);
            }


            _customerRepository.Update(customer);


            try
            {
                _unitOfWork.SaveChanges();
            }
            catch (DbUpdateConcurrencyException ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.NotFound, ex);
            }

            return Request.CreateResponse(HttpStatusCode.OK);
        }


        // POST api/Employee
        public HttpResponseMessage PostCustomer(Customer customer)
        {
            if (ModelState.IsValid)
            {
                _customerRepository.Add(customer);
              
                _unitOfWork.SaveChanges();

                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.Created, customer);
                response.Headers.Location = new Uri(Url.Link("DefaultApi", new { id = customer.CustomerID }));
                return response;
            }
            else
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }
        }

        // DELETE api/Customer/5
        public HttpResponseMessage DeleteCustomer(string id)
        {
            Customer customer = _customerRepository.Get().FirstOrDefault(e => e.CustomerID.ToString() == id);
            if (customer == null)
            {
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }
            _customerRepository.Delete(customer);

            try
            {
                _unitOfWork.SaveChanges();
            }
            catch (DbUpdateConcurrencyException ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.NotFound, ex);
            }

            return Request.CreateResponse(HttpStatusCode.OK, customer);
        }

        
    }
}