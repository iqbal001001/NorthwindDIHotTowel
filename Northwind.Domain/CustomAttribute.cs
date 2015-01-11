using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace Northwind.Domain
{
    public static class CustomAttribute
    {
        public static ValidationResult ValidateBirthDate(DateTime? dateToValidate)
        {
            if (dateToValidate.HasValue == true)
            {
                if (dateToValidate.Value.Date > DateTime.Today)
                {
                    return new ValidationResult("BirthDate cannot be in the future.");
                }
            }
            return ValidationResult.Success;
        }
    }
}