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
    [RoutePrefix("api/Product")]
    public class ProductsApiController : ApiController
    {
        private readonly IProductRepository _productRepository;
        private readonly IUnitOfWork _unitOfWork;

        public ProductsApiController(IProductRepository productRepository, IUnitOfWork unitOfWork)
        {
            _productRepository = productRepository;
            _unitOfWork = unitOfWork;
            Mapper.CreateMap<Product, ProductIndexViewModel>();
                //.ForMember(d => d.ProductName, opt => opt.MapFrom(e => e.Product1.FirstName));

            //.ForMember("ReportsToProduct", opt => opt.ResolveUsing<GetCustomerID>()
            //                                           .ConstructedBy(() => new GetCustomerID(_customerId)));
        }

        // GET api/Product
        public IEnumerable<ProductIndexViewModel> GetProducts()
        {
            return Mapper.Map<IEnumerable<ProductIndexViewModel>>(_productRepository.Get().ToList());
            //return _productRepository.Get().ToList();

        }

        // GET api/values/5
        public ProductIndexViewModel GetProduct(int id)
        {
            Product product = _productRepository.Get().FirstOrDefault(e => e.ProductID == id);

            if (product == null)
            {
                throw new HttpResponseException(Request.CreateResponse(HttpStatusCode.NotFound));
            }

            return Mapper.Map<ProductIndexViewModel>(product);
        }

        // PUT api/Customer/5
        public HttpResponseMessage PutProduct(string id, [FromBody] Product product)
        {
            if (!ModelState.IsValid)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }

            if (id != product.ProductID.ToString())
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest);
            }


            _productRepository.Update(product);


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


        // POST api/Product
        public HttpResponseMessage PostCustomer(Product product)
        {
            if (ModelState.IsValid)
            {
                _productRepository.Add(product);

                _unitOfWork.SaveChanges();

                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.Created, product);
                response.Headers.Location = new Uri(Url.Link("DefaultApi", new { id = product.ProductID }));
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
            Product product = _productRepository.Get().FirstOrDefault(e => e.ProductID.ToString() == id);
            if (product == null)
            {
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }
            _productRepository.Delete(product);

            try
            {
                _unitOfWork.SaveChanges();
            }
            catch (DbUpdateConcurrencyException ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.NotFound, ex);
            }

            return Request.CreateResponse(HttpStatusCode.OK, product);
        }


    }
}
