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
    [RoutePrefix("api/Employee")]
    public class EmployeesApiController : ApiController
    {
        private readonly IEmployeeRepository _employeeRepository;
        private readonly IUnitOfWork _unitOfWork;

        public EmployeesApiController(IEmployeeRepository employeeRepository, IUnitOfWork unitOfWork)
        {
            _employeeRepository = employeeRepository;
            _unitOfWork = unitOfWork;
            Mapper.CreateMap<Employee, EmployeeIndexViewModel>()
                .ForMember(d => d.ReportsToEmployee, opt => opt.MapFrom(e => e.Employee1.FirstName));

             //.ForMember("ReportsToEmployee", opt => opt.ResolveUsing<GetCustomerID>()
             //                                           .ConstructedBy(() => new GetCustomerID(_customerId)));
        }

        // GET api/Employee
        public IEnumerable<EmployeeIndexViewModel> GetEmployees()
        {
            var employeerepo = _employeeRepository.Get().ToList();
            var employees = Mapper.Map<IEnumerable<EmployeeIndexViewModel>>(employeerepo);
            return employees;
           

        }

        // GET api/values/5
        public EmployeeIndexViewModel GetEmployee(int id)
        {
            Employee employee = _employeeRepository.Get().FirstOrDefault(e => e.EmployeeID == id);
            employee.Photo = OleImageUnwrap.GetImageBytesFromOLEField(employee.Photo);
            //var bytes 
            //employee.Photo  = Encoding.Convert(Encoding.Unicode, Encoding.Default, (byte[])employee.Photo);
            //var imageBytes = new byte[bytes.LongLength - 1];
            //System.IO.MemoryStream ms = new System.IO.MemoryStream();
            //ms.Write(bytes, 0, bytes.Length - 1);
            //imageBytes = ms.ToArray();
            //ms.Close();
            //ms.Dispose();
            //employee.Photo = imageBytes;
            if (employee == null)
            {
                throw new HttpResponseException(Request.CreateResponse(HttpStatusCode.NotFound));
            }

            return Mapper.Map<EmployeeIndexViewModel>(employee);
        }

        // PUT api/Customer/5
        public HttpResponseMessage PutEmployee(string id, [FromBody] Employee employee)
        {
            if (!ModelState.IsValid)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }

            if (id != employee.EmployeeID.ToString())
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest);
            }


            _employeeRepository.Update(employee);


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
        public HttpResponseMessage PostCustomer(Employee employee)
        {
            if (ModelState.IsValid)
            {
                _employeeRepository.Add(employee);
              
                _unitOfWork.SaveChanges();

                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.Created, employee);
                response.Headers.Location = new Uri(Url.Link("DefaultApi", new { id = employee.EmployeeID }));
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
            Employee employee = _employeeRepository.Get().FirstOrDefault(e => e.EmployeeID.ToString() == id);
            if (employee == null)
            {
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }
            _employeeRepository.Delete(employee);

            try
            {
                _unitOfWork.SaveChanges();
            }
            catch (DbUpdateConcurrencyException ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.NotFound, ex);
            }

            return Request.CreateResponse(HttpStatusCode.OK, employee);
        }

        
    }
}