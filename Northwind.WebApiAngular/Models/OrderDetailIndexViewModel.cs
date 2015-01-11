using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Northwind.WebApiAngular.Models
{
    public class OrderDetailIndexViewModel
    {
        public int OrderID { get; set; }
        public int ProductID { get; set; }
        public string ProductName { get; set; }
        public decimal UnitPrice { get; set; }
        public short Quantity { get; set; }
        public float Discount { get; set; }
    }
}