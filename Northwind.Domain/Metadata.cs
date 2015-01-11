using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

//using System.Web.Mvc;
//using System.Web.Mvc.Html;
//using System.Web.UI.WebControls;

namespace Northwind.Domain
{
    public class EmployeeMetadata
    {
        [Key]
        public int EmployeeID { get; set; }

        [Required(ErrorMessage = "Please Enter Last Name")]
        [StringLength(20, ErrorMessage = "Last Name should be less than equal to 20 characters long.")]
        [DataType(DataType.Text)]
        [Display(Name = "Last Name")]
        public string LastName { get; set; }

        [Required(ErrorMessage = "Please Enter First Name")]
        [StringLength(20, ErrorMessage = "First Name should be less than equal to 20 characters long.")]
        [DataType(DataType.Text)]
        [Display(Name = "First Name")]
        public string FirstName { get; set; }

        public string Title { get; set; }

        public string TitleOfCourtesy { get; set; }

        [DataType(DataType.Date)]
        [DisplayFormat(DataFormatString = "{0:yyyy-MM-dd}", ApplyFormatInEditMode = true)]
        [CustomValidation(typeof(CustomAttribute), "ValidateBirthDate")]
        [Display(Name = "Date of Birth")]
        public DateTime? BirthDate { get; set; }

        [DataType(DataType.Date)]
        [DisplayFormat(DataFormatString = "{0:yyyy-MM-dd}", ApplyFormatInEditMode = true)]
        [Display(Name = "Hire Date")]
        public DateTime? HireDate { get; set; }

        [StringLength(60, ErrorMessage = "Address should be less than equal to 10 characters long.")]
        public string Address { get; set; }
        [StringLength(15, ErrorMessage = "City should be less than equal to 10 characters long.")]
        public string City { get; set; }
        [StringLength(15, ErrorMessage = "Region should be less than equal to 10 characters long.")]
        public string Region { get; set; }
        [StringLength(10, ErrorMessage = "Postcode should be less than equal to 10 characters long.")]
        public string PostalCode { get; set; }
        [StringLength(15, ErrorMessage = "Country should be less than equal to 10 characters long.")]
        public string Country { get; set; }

        [DataType(DataType.PhoneNumber)]
        [StringLength(15, ErrorMessage = "Phone Number should be less than equal to 10 characters long.")]
        public string HomePhone { get; set; }
        [StringLength(4, ErrorMessage = "Extension should be less than equal to 10 characters long.")]
        public string Extension { get; set; }

        
        //[HiddenInput(DisplayValue = false)]
        public byte[] Photo { get; set; }

        [DataType(DataType.MultilineText)]
        public string Notes { get; set; }

        [Display(Name = "Reports To")]
        public int? ReportsTo { get; set; }

        //[DataType(DataType.ImageUrl)]
        public string PhotoPath { get; set; }
    }
}