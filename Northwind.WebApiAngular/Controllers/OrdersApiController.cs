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
    [RoutePrefix("api/Order")]
    public class OrdersApiController : ApiController
    {
        private readonly IOrderRepository _orderRepository;
        private readonly IUnitOfWork _unitOfWork;

        public OrdersApiController(IOrderRepository orderRepository, 
                                    IEmployeeRepository employeeRepository, 
                                    IUnitOfWork unitOfWork)
        {
            _orderRepository = orderRepository;
            _unitOfWork = unitOfWork;
            Mapper.CreateMap<Order, OrderIndexViewModel>()
                .ForMember(d => d.CustomerName, opt => opt.MapFrom(e => e.Customer.CompanyName))
                .ForMember(d => d.EmployeeName, opt => opt.MapFrom(e => e.Employee.LastName))
                .ForMember(d => d.OrderTotal, opt => opt.MapFrom(e => 
                                                        e.Order_Details.Sum(od=>od.UnitPrice * od.Quantity)))
                                                        ;
            //var Employees = employeeRepository.Get();
            // Mapper.CreateMap<Order, OrderIndexViewModel>()
            //                    .ForMember(d => d.CustomerName, opt => opt.ResolveUsing<GetCustomerName>()
            //                                            .ConstructedBy(() => new GetCustomerName(                                                                                                                                                           ))

            //Companies.SelectMany(c=>c.categories).GroupBy(c=>c).Select(g=>new {Cateogry = g.Key, Count = g.Count()})
        }

        // GET api/Order
        public IEnumerable<OrderIndexViewModel> GetOrders()
        {
            var orderrepo = _orderRepository.Get().ToList();
            //orderrepo
            var order = Mapper.Map<IEnumerable<OrderIndexViewModel>>(orderrepo);
            //return _orderRepository.Get().ToList();
            return order;

        }
        //Get api/Order/CustomerID
        [ActionName("GetOrdersByCustomer")]
        public IEnumerable<OrderIndexViewModel> GetOrdersByCustomer(string Id)
        {
            var orderrepo = _orderRepository.Get(o => o.CustomerID == Id).ToList();
            //orderrepo
            var order = Mapper.Map<IEnumerable<OrderIndexViewModel>>(orderrepo);
            //return _orderRepository.Get().ToList();
            return order;

        }

        //Get api/Order/CustomerID
        [ActionName("GetOrdersByEmployee")]
        public IEnumerable<OrderIndexViewModel> GetOrdersByEmployee(int Id)
        {
            var orderrepo = _orderRepository.Get(o => o.EmployeeID == Id).ToList();
            //orderrepo
            var order = Mapper.Map<IEnumerable<OrderIndexViewModel>>(orderrepo);
            //return _orderRepository.Get().ToList();
            return order;

        }

        // GET api/values/5
        public OrderIndexViewModel GetOrder(int Id)
        {
            Order order = _orderRepository.Get().FirstOrDefault(e => e.OrderID == Id);
          
            if (order == null)
            {
                throw new HttpResponseException(Request.CreateResponse(HttpStatusCode.NotFound));
            }

            return Mapper.Map<OrderIndexViewModel>(order);
        }

        // PUT api/Customer/5
        public HttpResponseMessage PutOrder(string id, [FromBody] Order order)
        {
            if (!ModelState.IsValid)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }

            if (id != order.OrderID.ToString())
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest);
            }


            _orderRepository.Update(order);


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


        // POST api/Order
        public HttpResponseMessage PostOrder(Order order)
        {
            if (ModelState.IsValid)
            {
                _orderRepository.Add(order);

                _unitOfWork.SaveChanges();

                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.Created, order);
                response.Headers.Location = new Uri(Url.Link("DefaultApi", new { id = order.OrderID }));
                return response;
            }
            else
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }
        }

        // DELETE api/Customer/5
        public HttpResponseMessage DeleteOrder(string id)
        {
            Order order = _orderRepository.Get().FirstOrDefault(e => e.OrderID.ToString() == id);
            if (order == null)
            {
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }
            _orderRepository.Delete(order);

            try
            {
                _unitOfWork.SaveChanges();
            }
            catch (DbUpdateConcurrencyException ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.NotFound, ex);
            }

            return Request.CreateResponse(HttpStatusCode.OK, order);
        }


    }
}
