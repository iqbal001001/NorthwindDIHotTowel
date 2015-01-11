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
    [RoutePrefix("api/OrderDetail")]
    public class OrderDetailsApiController : ApiController
    {
        private readonly IOrderDetailRepository _orderDetailRepository;
        private readonly IUnitOfWork _unitOfWork;

        public OrderDetailsApiController(IOrderDetailRepository orderDetailRepository, IUnitOfWork unitOfWork)
        {
            _orderDetailRepository = orderDetailRepository;
            _unitOfWork = unitOfWork;
            Mapper.CreateMap<Order_Detail, OrderDetailIndexViewModel>()
                .ForMember(d => d.ProductName, opt => opt.MapFrom(p => p.Product.ProductName));

            //.ForMember("ReportsToOrderDetail", opt => opt.ResolveUsing<GetCustomerID>()
            //                                           .ConstructedBy(() => new GetCustomerID(_customerId)));
        }

         //GET api/OrderDetail
        //[Route("api/OrderDetails")]
        public IEnumerable<OrderDetailIndexViewModel> GetOrderDetails()
        {
            return Mapper.Map<IEnumerable<OrderDetailIndexViewModel>>(_orderDetailRepository.Get().ToList());
            //return _orderDetailRepository.Get().ToList();

        }

        // GET api/OrderDetail/5
        //[Route("api/OrderDetails/{orderId}")]
        public IEnumerable<OrderDetailIndexViewModel> GetOrderDetails(int Id)
        {
            IEnumerable<Order_Detail> orderDetail = _orderDetailRepository.Get(e => e.OrderID == Id).ToList();
            return Mapper.Map<IEnumerable<OrderDetailIndexViewModel>>(orderDetail); 
        }

        // GET api/values/orderid/productid
        //[Route("api/OrderDetails/{orderId}/{productId}")]
        public OrderDetailIndexViewModel GetOrderDetail(int orderId, int productId)
        {
            Order_Detail orderDetail = _orderDetailRepository.Get(e => e.OrderID == orderId && e.ProductID == productId).First();
            return Mapper.Map<OrderDetailIndexViewModel>(orderDetail);
        }

        // PUT api/Customer/5
        public HttpResponseMessage PutOrderDetail(int Id, [FromBody] Order_Detail orderDetail)
        {
            if (!ModelState.IsValid)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }

            if (Id != orderDetail.OrderID)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest);
            }


            _orderDetailRepository.Update(orderDetail);


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


        // POST api/OrderDetail
        public HttpResponseMessage PostOrderDetail(Order_Detail orderDetail)
        {
            if (ModelState.IsValid)
            {
                _orderDetailRepository.Add(orderDetail);

                _unitOfWork.SaveChanges();

                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.Created, orderDetail);
                response.Headers.Location = new Uri(Url.Link("DefaultApi", new { OrderId = orderDetail.OrderID, productId = orderDetail.ProductID }));
                return response;
            }
            else
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }
        }

        // DELETE api/Customer/5
        public HttpResponseMessage DeleteOrderDetail(int Id)
        {
            Order_Detail orderDetail = _orderDetailRepository.Get().FirstOrDefault(e => e.OrderID == Id);
            if (orderDetail == null)
            {
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }
            _orderDetailRepository.Delete(orderDetail);

            try
            {
                _unitOfWork.SaveChanges();
            }
            catch (DbUpdateConcurrencyException ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.NotFound, ex);
            }

            return Request.CreateResponse(HttpStatusCode.OK, orderDetail);
        }
        // DELETE api/OrderDetailbyProduct/5
        public HttpResponseMessage DeleteOrderDetailByProduct(int orderId,int ProductID)
        {
            Order_Detail orderDetail = _orderDetailRepository.Get().FirstOrDefault(e => e.OrderID == orderId && e.ProductID == ProductID);
            if (orderDetail == null)
            {
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }
            _orderDetailRepository.Delete(orderDetail);

            try
            {
                _unitOfWork.SaveChanges();
            }
            catch (DbUpdateConcurrencyException ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.NotFound, ex);
            }

            return Request.CreateResponse(HttpStatusCode.OK, orderDetail);
        }


    }
}
