using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using System.Runtime.Serialization;

namespace Northwind.Domain
{
    //[Serializable]
    //[DataContract(IsReference = true)]
    [MetadataType(typeof(EmployeeMetadata))]
    public partial class Employee
    {
    }
}