var customerController = function ($scope, customerService, commonService) {

    $scope.IsNewRecord = 1; //The flag for the new record

    $scope.$watch('IsNewRecord', function () {
        //alert('hey, myVar has changed!');
        $scope.btnNewDisable = $scope.IsNewRecord
        $scope.btnDeleteDisable = $scope.IsNewRecord
    });

    //$scope.$watch('CustomerID', function (newValue, oldValue) {
    //  if (newValue)
    //      console.log("I see a data change!");
    // // $scope.$broadcast('Share_CustomerID', $scope.CustomerID);
    //});

    $scope.broadcast = function () {
        $scope.$emit('Share_CustomerID', $scope.CustomerID);
        // $scope.$broadcast('Share_CustomerID', $scope.CustomerID);
    };

    $scope.$on("Share_CustomerID", function (event, CustomerID) {
        $scope.CustomerID = CustomerID;
    });

    loadRecords();

    //Function to load all Employee records
    function loadRecords() {
        var promiseGet = customerService.getCustomers(); //The MEthod Call from service

        promiseGet.then(function (pl) { $scope.Customers = pl.data },
              function (errorPl) {
                  $log.error('failure loading Customer', errorPl);
              });
    }

    //The Save scope method use to define the Employee object.
    //In this method if IsNewRecord is not zero then Update Employee else 
    //Create the Employee information to the server
    $scope.save = function () {

        var Customer = {
            CustomerID: $scope.CustomerID,
            CompanyName: $scope.CustomerName,
            ContactName: $scope.ContactName,
            ContactTitle: $scope.ContactTitle,
            Address: $scope.Address,
            City: $scope.City,
            Region: $scope.Region,
            PostalCode: $scope.PostalCode,
            Country: $scope.Country,
            Phone: $scope.Phone,
            Fax: $scope.Fax

        };
        //If the flag is 1 the it si new record
        if ($scope.IsNewRecord === 1) {
            var promisePost = customerService.post(Customer);
            promisePost.then(function (pl) {
                $scope.CustomerID = pl.data.CustomerID;
                loadRecords();
                $scope.IsNewRecord = 0;
            }, function (err) {
                $scope.Message = commonService.parseErrors(err); console.log("Err" + $scope.Message);
            });
        } else { //Else Edit the record
            var promisePut = customerService.put($scope.CustomerID, Customer);
            promisePut.then(function (pl) {
                $scope.Message = "Updated Successfuly";
                loadRecords();
            }, function (err) {
                $scope.Message = commonService.parseErrors(err); console.log("Err" + $scope.Message);
            });
        }



    };

    //Method to Delete
    $scope.delete = function () {
        var promiseDelete = customerService.delete($scope.CustomerID);
        promiseDelete.then(function (pl) {

            $scope.CustomerID = 0;
            $scope.CustomerName = '';
            $scope.ContactName = '';
            $scope.ContactTitle = '';
            $scope.Address = '';
            $scope.City = '';
            $scope.Region = '';
            $scope.PostalCode = '';
            $scope.Country = '';
            $scope.Phone = '';
            $scope.Fax = '';

            loadRecords();
        }, function (err) {
            $scope.Message = commonService.parseErrors(err); console.log("Err" + $scope.Message);
        });
    }

    //Method to Get Single Employee based on EmpNo
    $scope.get = function (Customer) {
        var promiseGetSingle = customerService.get(Customer.CustomerID);

        promiseGetSingle.then(function (pl) {
            var res = pl.data;

            $scope.CustomerID = res.CustomerID
            $scope.CustomerName = res.CustomerName
            $scope.ContactName = res.ContactName
            $scope.ContactTitle = res.ContactTitle
            $scope.Address = res.Address
            $scope.City = res.City
            $scope.Region = res.Region
            $scope.PostalCode = res.PostalCode
            $scope.Country = res.Country
            $scope.Phone = res.Phone
            $scope.Fax = res.Fax

            //$scope.$broadcast('Share_CustomerID', $scope.CustomerID);



            //http://gusiev.com/2009/04/clear-upload-file-input-field/
            // var fu = document.getElementById('file');
            //if (fu != null) {
            //  document.getElementById('file').outerHTML = fu.outerHTML;
            // }
            $scope.Message = "";
            $scope.IsNewRecord = 0;
        },
                  function (errorPl) {
                      console.log('failure loading Employee', errorPl);
                  });
    }



    //Clear the Scopr models
    $scope.clear = function () {

        $scope.CustomerID = 0,
        $scope.CustomerName = '',
        $scope.ContactName = '',
        $scope.ContactTitle = '',
        $scope.Address = '',
        $scope.City = '',
        $scope.Region = '',
        $scope.PostalCode = '',
        $scope.Country = '',
        $scope.Phone = '',
        $scope.Fax = ''

    }


}

var employeeController = function ($scope, fileReader, employeeService, commonService) {

    $scope.IsNewRecord = 1; //The flag for the new record

    $scope.$watch('IsNewRecord', function () {
        //alert('hey, myVar has changed!');
        $scope.btnNewDisable = $scope.IsNewRecord
        $scope.btnDeleteDisable = $scope.IsNewRecord
    });

    //scope.$watch('val', function (newValue, oldValue) {
    //  if (newValue)
    //    console.log("I see a data change!");
    //});

    $scope.broadcast = function () {
        $scope.$emit('Share_EmployeeID', $scope.EmployeeID);
        //$scope.$broadcast('Share_EmployeeID', $scope.EmployeeID);
    };

    $scope.$on("Share_EmployeeID", function (event, EmployeeID) {
        $scope.EmployeeID = EmployeeID;
    });

    loadRecords();

    //Function to load all Employee records
    function loadRecords() {
        var promiseGet = employeeService.getEmployees(); //The MEthod Call from service

        promiseGet.then(function (pl) { $scope.Employees = pl.data },
              function (errorPl) {
                  $log.error('failure loading Employee', errorPl);
              });
    }

    //The Save scope method use to define the Employee object.
    //In this method if IsNewRecord is not zero then Update Employee else 
    //Create the Employee information to the server
    $scope.save = function () {
        var x = document.getElementById("imagePreview");
        var y = document.getElementById("imagePreview").src;
        var Employee = {
            EmployeeID: $scope.EmployeeID,
            LastName: $scope.FirstName,
            FirstName: $scope.LastName,
            Title: $scope.Title,
            TitleOfCourtesy: $scope.TitleOfCourtesy,
            BirthDate: $scope.BirthDate,
            HireDate: $scope.HireDate,
            Address: $scope.Address,
            City: $scope.City,
            Region: $scope.Region,
            PostalCode: $scope.PostalCode,
            Country: $scope.Country,
            HomePhone: $scope.HomePhone,
            Extension: $scope.Extension,
            //Photo: document.getElementById("imagePreview").src.replace(/^data:image\/(png|jpg|bmp);base64,/, ""), //$scope.Photo,
            Photo: $scope.Photo,
            Notes: $scope.Notes,
            ReportsTo: $scope.ReportsTo,
            PhotoPath: $scope.PhotoPath
        };
        //If the flag is 1 the it si new record
        if ($scope.IsNewRecord === 1) {
            var promisePost = employeeService.post(Employee);
            promisePost.then(function (pl) {
                $scope.EmployeeID = pl.data.EmployeeID;
                loadRecords();
                $scope.IsNewRecord = 0;
            }, function (err) {
                $scope.Message = commonService.parseErrors(err); console.log("Err" + $scope.Message);
            });
        } else { //Else Edit the record
            var promisePut = employeeService.put($scope.EmployeeID, Employee);
            promisePut.then(function (pl) {
                $scope.Message = "Updated Successfuly";
                loadRecords();
            }, function (err) {
                $scope.Message = commonService.parseErrors(err); console.log("Err" + $scope.Message);
            });
        }



    };

    //Method to Delete
    $scope.delete = function () {
        var promiseDelete = employeeService.delete($scope.EmployeeID);
        promiseDelete.then(function (pl) {

            $scope.EmployeeID = 0,
            $scope.FirstName = "",
            $scope.LastName = "",
            $scope.Title = "",
            $scope.TitleOfCourtesy = "",
            $scope.BirthDate = "",
            $scope.HireDate = "",
            $scope.Address = "",
            $scope.City = "",
            $scope.Region = "",
            $scope.PostalCode = "",
            $scope.Country = "",
            $scope.HomePhone = "",
            $scope.Extension = "",
            $scope.Photo = "",
            $scope.Notes = "",
            $scope.ReportsTo = 0,
            $scope.PhotoPath

            loadRecords();
        }, function (err) {
            $scope.Message = commonService.parseErrors(err); console.log("Err" + $scope.Message);
        });
    }

    //Method to Get Single Employee based on EmpNo
    $scope.get = function (Emp) {
        var promiseGetSingle = employeeService.get(Emp.EmployeeID);

        promiseGetSingle.then(function (pl) {
            var res = pl.data;

            $scope.EmployeeID = res.EmployeeID,
            $scope.LastName = res.FirstName,
            $scope.FirstName = res.LastName,
            $scope.Title = res.Title,
            $scope.TitleOfCourtesy = res.TitleOfCourtesy,
            $scope.BirthDate = res.BirthDate == null ? '' : new Date(res.BirthDate),
            $scope.HireDate = res.HireDate == null ? '' : new Date(res.HireDate),
            $scope.Address = res.Address,
            $scope.City = res.City,
            $scope.Region = res.Region,
            $scope.PostalCode = res.PostalCode,
            $scope.Country = res.Country,
            $scope.HomePhone = res.HomePhone,
            $scope.Extension = res.Extension,
            $scope.Photo = res.Photo,
            //$scope.Photo = res.Photo,
            $scope.Notes = res.Notes,
            $scope.ReportsTo = res.ReportsTo,
            $scope.PhotoPath = res.PhotoPath

            //http://gusiev.com/2009/04/clear-upload-file-input-field/
            // var fu = document.getElementById('file');
            //if (fu != null) {
            //  document.getElementById('file').outerHTML = fu.outerHTML;
            // }
            $scope.Message = "";
            $scope.IsNewRecord = 0;
        },
                  function (errorPl) {
                      console.log('failure loading Employee', errorPl);
                  });
    }
    //Clear the Scopr models
    $scope.clear = function () {
        $scope.IsNewRecord = 1;
        $scope.EmployeeID = 0,
        $scope.FirstName = "",
        $scope.LastName = "",
        $scope.Title = "",
        $scope.TitleOfCourtesy = "",
        $scope.BirthDate = "",
        $scope.HireDate = "",
        $scope.Address = "",
        $scope.City = "",
        $scope.Region = "",
        $scope.PostalCode = "",
        $scope.Country = "",
        $scope.HomePhone = "",
        $scope.Extension = "",
        $scope.Photo = "",
        $scope.Notes = "",
        $scope.ReportsTo = 0,
        $scope.PhotoPath
    }


    //http://plnkr.co/edit/y5n16v?p=preview
    //http://odetocode.com/blogs/scott/archive/2013/07/03/building-a-filereader-service-for-angularjs-the-service.aspx



    $scope.getFile = function () {
        $scope.progress = 0;
        fileReader.readAsDataUrl($scope.file, $scope)
                      .then(function (result) {
                          //$scope.imageSrc = result; //.replace(/^data:image\/(png|jpg|bmp);base64,/, "");
                          $scope.Photo = result.replace(/^data:image\/(png|jpg|bmp);base64,/, "")
                      });
    };

    $scope.$on("fileProgress", function (e, progress) {
        $scope.progress = progress.loaded / progress.total;
    });

}

var orderController = function ($scope, orderService, employeeService, customerService, commonService, shareService) {

    $scope.IsNewRecord = 1; //The flag for the new record
    $scope.SelectMode = '';
    $scope.SelectId = '';

    $scope.$watch('IsNewRecord', function () {
        //alert('hey, myVar has changed!');
        $scope.btnNewDisable = $scope.IsNewRecord
        $scope.btnDeleteDisable = $scope.IsNewRecord
    });

    //$scope.clickFunction = function () {
    //  $scope.$broadcast('Share_OrderID', $scope.OrderID);
    //};

    //scope.$watch('val', function (newValue, oldValue) {
    //  if (newValue)
    //    console.log("I see a data change!");
    //});

    $scope.$on("Share_CustomerID", function (event, CustomerID) {
        // $scope.getOrderByCustomer(CustomerID)
        if (CustomerID !== undefined && CustomerID !== 0) {
            $scope.SelectMode = 'CustomerID';
            $scope.SelectId = CustomerID;
           // $scope.CustomerID = CustomerID
            //$scope.EmployeeID = 0;
            $scope.clear();

            loadRecords();
        }
        //$scope.message = message;
    });

    $scope.$on("Share_EmployeeID", function (event, EmployeeID) {
        // $scope.getOrderByEmployee(EmployeeID)
        if (EmployeeID > 0) {
            $scope.SelectMode = 'EmployeeID';
            $scope.SelectId = EmployeeID;
           // $scope.EmployeeID = EmployeeID;
           // $scope.CustomerID = 0;
            $scope.clear();
            loadRecords();
        }
        //$scope.message = message;
    });

    $scope.broadcastOrderID = function () {
        $scope.$broadcast('Share_OrderID', $scope.OrderID);
    }


    //$scope.$on("Emit_OrderChange", function (event, OrderID) {
    //    $scope.get(OrderID)

    //});
    //$scope.OrderChange = shareService.orderChange;

    //$scope.$watch('OrderChange', function (newValue, oldValue) {
    //    if (newValue) {
    //        if (OrderChange) {
    //            $scope.get($scope.OrderID)
    //        }
    //    }
    //});

    $scope.$watch(function () { return shareService.getOrderChange(); }, function (newValue) {
        if (newValue) {      
                $scope.get($scope.OrderID)
                shareService.setOrderChange(0);
        }
    });



    //$scope.getOrderByCustomer = function (CustomerID) {
    //    var promiseGet = orderService.getOrdersByCustomer(CustomerID); //The MEthod Call from service

    //    promiseGet.then(function (pl) { $scope.Orders = pl.data },
    //          function (errorPl) {
    //              $log.error('failure loading Order/Customer', errorPl);
    //          });
    //}

    //$scope.getOrderByEmployee = function (EmployeeID) {
    //    var promiseGet = orderService.getOrdersByEmployee(EmployeeID); //The MEthod Call from service

    //    promiseGet.then(function (pl) { $scope.Orders = pl.data },
    //          function (errorPl) {
    //              $log.error('failure loading Order/Employee', errorPl);
    //          });
    //}

    //loadRecords();
    loadSupportRecords();

    //Function to load all Employee records
    function loadRecords() {
        var promiseGet = '';

        if ($scope.SelectMode === 'CustomerID') {
            promiseGet = orderService.getOrdersByCustomer($scope.SelectId); //The MEthod Call from service

            promiseGet.then(function (pl) { $scope.Orders = pl.data },
                  function (errorPl) {
                      $log.error('failure loading Order/Customer', errorPl);
                  });
        }

        if ($scope.SelectMode === 'EmployeeID') {
            var promiseGet = orderService.getOrdersByEmployee($scope.SelectId); //The MEthod Call from service

            promiseGet.then(function (pl) { $scope.Orders = pl.data },
                  function (errorPl) {
                      $log.error('failure loading Order/Employee', errorPl);
                  });
        }

        if ($scope.SelectMode === '') {
            //    var promiseGet = orderService.getOrders(); //The MEthod Call from service

            //    promiseGet.then(function (pl) { $scope.Orders = pl.data },
            //          function (errorPl) {
            //              $log.error('failure loading Order', errorPl);
            //          });
        }

    }

    function loadSupportRecords() {
        var promiseGet = employeeService.getEmployees(); //The MEthod Call from service

        promiseGet.then(function (pl) { $scope.Employees = pl.data },
              function (errorPl) {
                  $log.error('failure loading Employee', errorPl);
              });

        promiseGet = customerService.getCustomers(); //The MEthod Call from service

        promiseGet.then(function (pl) { $scope.Customers = pl.data },
              function (errorPl) {
                  $log.error('failure loading Customer', errorPl);
              });

    }

    //The Save scope method use to define the Employee object.
    //In this method if IsNewRecord is not zero then Update Employee else 
    //Create the Employee information to the server
    $scope.save = function () {

        var Order = {
            OrderID: $scope.OrderID,
            CustomerID: $scope.CustomerID,
            EmployeeID: $scope.EmployeeID,
            OrderDate: $scope.OrderDate,
            RequiredDate: $scope.RequiredDate,
            ShippedDate: $scope.ShippedDate,
            ShipVia: $scope.ShipVia,
            Freight: $scope.Freight,
            ShipName: $scope.ShipName,
            ShipAddress: $scope.ShipAddress,
            ShipCity: $scope.ShipCity,
            ShipRegion: $scope.ShipRegion,
            ShipPostalCode: $scope.ShipPostalCode,
            ShipCountry: $scope.ShipCountry,

        };
        //If the flag is 1 the it si new record
        if ($scope.IsNewRecord === 1) {
            var promisePost = orderService.post(Order);
            promisePost.then(function (pl) {
                $scope.OrderID = pl.data.OrderID;
                loadRecords();
                $scope.IsNewRecord = 0;
                $scope.broadcastOrderID();
            }, function (err) {
                $scope.Message = commonService.parseErrors(err); console.log("Err" + $scope.Message);
            });
        } else { //Else Edit the record
            var promisePut = orderService.put($scope.OrderID, Order);
            promisePut.then(function (pl) {
                $scope.Message = "Updated Successfuly";
                loadRecords();
                $scope.broadcastOrderID();
            }, function (err) {
                $scope.Message = commonService.parseErrors(err); console.log("Err" + $scope.Message);


            });
        }



    };

    //Method to Delete
    $scope.delete = function () {
        var promiseDelete = orderService.delete($scope.OrderID);
        promiseDelete.then(function (pl) {

            //$scope.OrderID = 0;
            //$scope.CustomerID = 0;
            //$scope.EmployeeID = 0;
            //$scope.OrderDate = '';
            //$scope.RequiredDate = '';
            //$scope.ShippedDate = '';
            //$scope.ShipVia = '';
            //$scope.Freight = 0;
            //$scope.ShipName = '';
            //$scope.ShipAddress = '';
            //$scope.ShipCity = '';
            //$scope.ShipRegion = '';
            //$scope.ShipPostalCode = '';
            //$scope.ShipCountry = '';

            $scope.clear();

            loadRecords();
        }, function (err) {
            $scope.Message = commonService.parseErrors(err); console.log("Err" + $scope.Message);
        });
    }

    //Method to Get Single Employee based on EmpNo
    $scope.get = function (OrderID) {
        var promiseGetSingle = orderService.get(OrderID);

        promiseGetSingle.then(function (pl) {
            var res = pl.data;


            $scope.OrderID = res.OrderID,
            $scope.CustomerID = res.CustomerID,
            $scope.EmployeeID = res.EmployeeID,
            $scope.OrderDate = res.OrderDate == null ? '' : new Date(res.OrderDate),
            $scope.RequiredDate = res.RequiredDate == null ? '' : new Date(res.RequiredDate),
            $scope.ShippedDate = res.ShippedDate == null ? '' : new Date(res.ShippedDate),
            $scope.ShipVia = res.ShipVia,
            $scope.Freight = res.Freight,
            $scope.ShipName = res.ShipName,
            $scope.ShipAddress = res.ShipAddress,
            $scope.ShipCity = res.ShipCity,
            $scope.ShipRegion = res.ShipRegion,
            $scope.ShipPostalCode = res.ShipPostalCode,
            $scope.ShipCountry = res.ShipCountry,
            $scope.OrderTotal = res.OrderTotal

            $scope.broadcastOrderID(); //$scope.$broadcast('Share_OrderID', $scope.OrderID);

            //http://gusiev.com/2009/04/clear-upload-file-input-field/
            // var fu = document.getElementById('file');
            //if (fu != null) {
            //  document.getElementById('file').outerHTML = fu.outerHTML;
            // }
            $scope.Message = "";
            $scope.IsNewRecord = 0;
        },
                  function (errorPl) {
                      console.log('failure loading Employee', errorPl);
                  });
    }
    //Clear the Scopr models
    $scope.clear = function () {
        $scope.IsNewRecord = 1,
        $scope.OrderID = 0,
        $scope.CustomerID = $scope.SelectMode === 'CustomerID' ? $scope.SelectId : 0,
        $scope.EmployeeID = $scope.SelectMode === 'EmployeeID' ? $scope.SelectId : 0,
        $scope.OrderDate = '',
        $scope.RequiredDate = '',
        $scope.ShippedDate = '',
        $scope.ShipVia = '',
        $scope.Freight = 0,
        $scope.ShipName = '',
        $scope.ShipAddress = '',
        $scope.ShipCity = '',
        $scope.ShipRegion = '',
        $scope.ShipPostalCode = '',
        $scope.ShipCountry = '',
         $scope.OrderTotal = 0
    }

    //separate method for parsing errors into a single flat array
    //function parseErrors(response) {
    //    var errors = [];
    //    for (var key in response.data.ModelState) {
    //        for (var i = 0; i < response.data.ModelState[key].length; i++) {
    //            errors.push(response.data.ModelState[key][i]);
    //        }
    //    }
    //    return errors;
    //}
}

var orderDetailController = function ($scope, orderDetailService, productService, commonService, shareService) {

    $scope.IsNewRecord = 1; //The flag for the new record
    $scope.SelectMode = '';
    $scope.SelectId = '';

    $scope.$watch('IsNewRecord', function () {
        //alert('hey, myVar has changed!');
        $scope.btnNewDisable = $scope.IsNewRecord
        $scope.btnDeleteDisable = $scope.IsNewRecord
    });

    //scope.$watch('val', function (newValue, oldValue) {
    //  if (newValue)
    //    console.log("I see a data change!");
    //});

    $scope.$on("Share_OrderID", function (event, OrderID) {
        //$scope.getOrderDetailsByOrder(OrderID)
        // if (OrderID > 0) {
        $scope.SelectMode = 'OrderID';
        $scope.SelectId = OrderID;
        loadRecords();
        // }
    });

    //loadRecords();
    loadSupportRecords();

    // Function to load all Employee records
    function loadRecords() {
        var promiseGet = '';
        $scope.OrderDetails = [];

        if ($scope.SelectMode === 'OrderID') {
            //$scope.getOrderDetailsByOrder = function (OrderID) {
            promiseGet = orderDetailService.getOrderDetailsByOrder($scope.SelectId); //The MEthod Call from service

            promiseGet.then(function (pl) {
                setTimeout(function () {
                    $scope.$apply(function () {
                        $scope.OrderDetails = pl.data;
                        //$scope.UnitPrice = 10;
                    });
                    // AngularJS unaware of update to $scope
                }, 2000);
            },
                  function (errorPl) {
                      // $log.error('failure loading OrderDetail', errorPl);
                  });
            //  }
        }

        if ($scope.SelectMode === '') {
            //promiseGet = orderDetailService.getOrderDetails(); //The MEthod Call from service

            //promiseGet.then(function (pl) { $scope.OrderDetails = pl.data },
            //      function (errorPl) {
            //           $log.error('failure loading OrderDetail', errorPl);
            //      });
        }

    }

    function loadSupportRecords() {
        promiseGet = productService.getProducts(); //The MEthod Call from service

        promiseGet.then(function (pl) { $scope.Products = pl.data },
              function (errorPl) {
                  $log.error('failure loading Product', errorPl);
              });
    }


    //The Save scope method use to define the Employee object.
    //In this method if IsNewRecord is not zero then Update Employee else 
    //Create the Employee information to the server
    $scope.save = function () {

        var OrderDetail = {
            OrderID: $scope.OrderID,
            ProductID: $scope.ProductID,
            UnitPrice: $scope.UnitPrice,
            Quantity: $scope.Quantity,
            Discount: $scope.Discount

        };
        //If the flag is 1 the it si new record
        if ($scope.IsNewRecord === 1) {
            var promisePost = orderDetailService.post(OrderDetail);
            promisePost.then(function (pl) {
                $scope.OrderID = pl.data.OrderID;
                //$scope.getOrderDetailsByOrder($scope.OrderID)
                loadRecords();
                $scope.IsNewRecord = 0;
                //$scope.$emit("Emit_OrderChange", $scope.OrderID);
                shareService.setOrderChange(1);  //shareService.OrderChange = 1;
            }, function (err) {
                $scope.Message = commonService.parseErrors(err); console.log("Err" + $scope.Message);
            });
        } else { //Else Edit the record
            var promisePut = orderDetailService.put($scope.OrderID, $scope.ProductID, OrderDetail);
            promisePut.then(function (pl) {
                $scope.Message = "Updated Successfuly";
                loadRecords();
                //$scope.$emit("Emit_OrderChange", $scope.OrderID);
                shareService.setOrderChange(1);
            }, function (err) {
                $scope.Message = commonService.parseErrors(err); console.log("Err" + $scope.Message);
            });
        }



    };

    //Method to Delete
    $scope.delete = function () {
        var promiseDelete = orderDetailService.deleteByProduct($scope.OrderID, $scope.ProductID);
        promiseDelete.then(function (pl) {

            //$scope.OrderID = 0;
            //$scope.ProductID = 0;
            //$scope.UnitPrice = 0;
            //$scope.Quantity = 0;
            //$scope.Discount = 0;
            $scope.clear();
            loadRecords();
            shareService.setOrderChange(1);
        }, function (err) {
            $scope.Message = commonService.parseErrors(err); console.log("Err" + $scope.Message);
        });
    }

    //Method to Get Single Employee based on EmpNo
    $scope.getOrderDetailsByProduct = function (OrderDetail) {
        var promiseGetSingle = orderDetailService.getOrderDetailsByProduct(OrderDetail.OrderID, OrderDetail.ProductID);

        promiseGetSingle.then(function (pl) {
            var res = pl.data;

            $scope.OrderID = res.OrderID
            $scope.ProductID = res.ProductID
            $scope.UnitPrice = res.UnitPrice
            $scope.Quantity = res.Quantity
            $scope.Discount = res.Discount


            //http://gusiev.com/2009/04/clear-upload-file-input-field/
            // var fu = document.getElementById('file');
            //if (fu != null) {
            //  document.getElementById('file').outerHTML = fu.outerHTML;
            // }
            $scope.Message = "";
            $scope.IsNewRecord = 0;
        },
                  function (errorPl) {
                      console.log('failure loading Employee', errorPl);
                  });
    }
    //Clear the Scopr models
    $scope.clear = function () {
        $scope.IsNewRecord = 1,
        //$scope.OrderID = 0,
        $scope.ProductID = 0,
        $scope.UnitPrice = 0,
        $scope.Quantity = 0,
        $scope.Discount = 0
    }


}

var productController = function ($scope, productService, commonService) {

    $scope.IsNewRecord = 1; //The flag for the new record

    $scope.$watch('IsNewRecord', function () {
        //alert('hey, myVar has changed!');
        $scope.btnNewDisable = $scope.IsNewRecord
        $scope.btnDeleteDisable = $scope.IsNewRecord
    });

    //scope.$watch('val', function (newValue, oldValue) {
    //  if (newValue)
    //    console.log("I see a data change!");
    //});

    loadRecords();

    //Function to load all Employee records
    function loadRecords() {
        var promiseGet = productService.getProducts(); //The MEthod Call from service

        promiseGet.then(function (pl) { $scope.Products = pl.data },
              function (errorPl) {
                  $log.error('failure loading Product', errorPl);
              });
    }

    //The Save scope method use to define the Employee object.
    //In this method if IsNewRecord is not zero then Update Employee else 
    //Create the Employee information to the server
    $scope.save = function () {

        var Product = {
            ProductID: $scope.ProductID,
            ProductName: $scope.ProductName,
            SupplierID: $scope.UnitPrice,
            CategoryID: $scope.Quantity,
            QuantityPerUnit: $scope.Discount,
            UnitPrice: $scope.UnitPrice,
            UnitsInStock: $scope.UnitsInStock,
            UnitsOnOrder: $scope.UnitsOnOrder,
            ReorderLevel: $scope.ReorderLevel,
            Discontined: $scope.Discontined

        };
        //If the flag is 1 the it si new record
        if ($scope.IsNewRecord === 1) {
            var promisePost = productService.post(Product);
            promisePost.then(function (pl) {
                $scope.ProductID = pl.data.ProductID;
                loadRecords();
                $scope.IsNewRecord = 0;
            }, function (err) {
                $scope.Message = commonService.parseErrors(err); console.log("Err" + $scope.Message);
            });
        } else { //Else Edit the record
            var promisePut = productService.put($scope.ProductID, Product);
            promisePut.then(function (pl) {
                $scope.Message = "Updated Successfuly";
                loadRecords();
            }, function (err) {
                $scope.Message = commonService.parseErrors(err); console.log("Err" + $scope.Message);
            });
        }



    };

    //Method to Delete
    $scope.delete = function () {
        var promiseDelete = productService.delete($scope.ProductID);
        promiseDelete.then(function (pl) {

            $scope.ProductID = 0;
            $scope.ProductName = '';
            $scope.SupplierID = 0;
            $scope.CategoryID = 0;
            $scope.QuantityPerUnit = 0;
            $scope.UnitPrice = 0;
            $scope.UnitsInStock = 0;
            $scope.UnitsOnOrder = 0;
            $scope.ReorderLevel = 0;
            $scope.Discontined = 0;

            loadRecords();
        }, function (err) {
            $scope.Message = commonService.parseErrors(err); console.log("Err" + $scope.Message);
        });
    }

    //Method to Get Single Employee based on EmpNo
    $scope.get = function (Product) {
        var promiseGetSingle = productService.get(Product.ProductID);

        promiseGetSingle.then(function (pl) {
            var res = pl.data;

            $scope.ProductID = res.ProductID
            $scope.ProductName = res.ProductName
            $scope.SupplierID = res.SupplierID
            $scope.CategoryID = res.CategoryID
            $scope.QuantityPerUnit = res.QuantityPerUnit
            $scope.UnitPrice = res.UnitPrice
            $scope.UnitsInStock = res.UnitsInStock
            $scope.UnitsOnOrder = res.UnitsOnOrder
            $scope.ReorderLevel = res.ReorderLevel
            $scope.Discontined = res.Discontined


            //http://gusiev.com/2009/04/clear-upload-file-input-field/
            // var fu = document.getElementById('file');
            //if (fu != null) {
            //  document.getElementById('file').outerHTML = fu.outerHTML;
            // }
            $scope.Message = "";
            $scope.IsNewRecord = 0;
        },
                  function (errorPl) {
                      console.log('failure loading Employee', errorPl);
                  });
    }
    //Clear the Scopr models
    $scope.clear = function () {

        $scope.ProductID = 0,
        $scope.ProductName = '',
        $scope.SupplierID = 0,
        $scope.CategoryID = 0,
        $scope.QuantityPerUnit = 0,
        $scope.UnitPrice = 0,
        $scope.UnitsInStock = 0,
        $scope.UnitsOnOrder = 0,
        $scope.ReorderLevel = 0,
        $scope.Discontined = 0

    }


}

var mainController = function ($scope, $controller) {



    $scope.$on("Share_CustomerID", function (event, CustomerID) {
        $scope.CustomerID = CustomerID;
    });

    $scope.$watch('CustomerID', function (newValue, oldValue) {
        if (newValue)
            $scope.EmployeeID = 0;
        $scope.$broadcast('Share_CustomerID', $scope.CustomerID);
        $scope.$broadcast('Share_CustomerID', $scope.CustomerID);
    });

    $scope.$on("Share_EmployeeID", function (event, EmployeeID) {
        $scope.EmployeeID = EmployeeID;
    });

    $scope.$watch('EmployeeID', function (newValue, oldValue) {
        if (newValue)
            $scope.CustomerID = 0;
        $scope.$broadcast('Share_EmployeeID', $scope.EmployeeID);
        $scope.$broadcast('Share_EmployeeID', $scope.EmployeeID);
    });

}



