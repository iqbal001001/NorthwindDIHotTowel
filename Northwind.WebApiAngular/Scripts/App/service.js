/// <reference path="../angular.js" />
/// <reference path="Module.js" />

    var employeeService = function ($http) {


    //Create new record
        this.post = function (Employee) {
            var request = $http({
                method: "post",
                url: "/api/EmployeesAPI",
                data: Employee
            });
            return request;
        };
    //Get Single Records
    this.get = function (EmpNo) {
        return $http.get("/api/EmployeesAPI/" + EmpNo);
    };

    //Get All Employees
    this.getEmployees = function () {
        return $http.get("/api/EmployeesAPI");
    };


    //Update the Record
    this.put = function (EmpNo, Employee) {
        var request = $http({
            method: "put",
            url: "/api/EmployeesAPI/" + EmpNo,
            data: Employee
        });
        return request;
    };
    //Delete the Record
    this.delete = function (EmpNo) {
        var request = $http({
            method: "delete",
            url: "/api/EmployeesAPI/" + EmpNo
        });
        return request;
    }
    }

    employeeService.$inject = ['$http'];

    var orderService = function ($http) {


        //Create new record
        this.post = function (Order) {
            var request = $http({
                method: "post",
                url: "/api/OrdersAPI",
                data: Order
            });
            return request;
        }
        //Get List Records by Customer
        this.getOrdersByCustomer = function (CustomerNo) {
            return $http.get("/api/OrdersAPI/GetOrdersByCustomer/" + CustomerNo);
        }
        //Get List Records by Employee
        this.getOrdersByEmployee = function (EmployeeNo) {
            return $http.get("/api/OrdersAPI/GetOrdersByEmployee/" + EmployeeNo);
        }
        //Get Single Records
        this.get = function (OrderNo) {
            return $http.get("/api/OrdersAPI/GetOrder/" + OrderNo);
        }
        //Get All Employees
        this.getOrders = function () {
            return $http.get("/api/OrdersAPI");
        }
        //Update the Record
        this.put = function (OrderNo, Order) {
            var request = $http({
                method: "put",
                url: "/api/OrdersAPI/" + OrderNo,
                data: Order
            });
            return request;
        }
        //Delete the Record
        this.delete = function (OrderNo) {
            var request = $http({
                method: "delete",
                url: "/api/OrdersAPI/" + OrderNo
            });
            return request;
        }
    }

    orderService.$inject = ['$http'];

    var orderDetailService = function ($http) {


        //Create new record
        this.post = function (OrderDetail) {
            var request = $http({
                method: "post",
                url: "/api/OrderDetailsAPI",
                data: OrderDetail
            });
            return request;
        }
        //Get List Records
        this.getOrderDetailsByOrder = function (OrderNo) {
            return $http.get("/api/OrderDetailsAPI/" + OrderNo);
        }









        //Get Singlr Record
        this.getOrderDetailsByProduct = function (OrderNo, ProductNo) {
            return $http.get("/api/OrderDetailsAPI/GetOrderDetail/" + OrderNo + "/" + ProductNo);
        }

        //Get All Employees
        this.getOrderDetails = function () {
            return $http.get("/api/OrderDetailsAPI");
        }


        //Update the Record
        this.put = function (OrderNo,  ProductNo, Order) {
            var request = $http({
                method: "put",
                url: "/api/OrderDetailsAPI/" + OrderNo,
                data: Order
            });
            return request;
        }
        //Delete the Record
        this.deleteByOrder = function (OrderNo) {
            var request = $http({
                method: "delete",
                url: "/api/OrderDetailsAPI/DeleteOrderDetail" + OrderNo
            });
            return request;
        }
        this.deleteByProduct = function (OrderNo,ProductNo) {
            var request = $http({
                method: "delete",
                url: "/api/OrderDetailsAPI/DeleteOrderDetailByProduct/" + OrderNo + "/" + ProductNo
            });
            return request;
        }
    }

    orderDetailService.$inject = ['$http'];

    var productService = function ($http) {

        //Create new record
        this.post = function (Product) {
            var request = $http({
                method: "post",
                url: "/api/ProductsAPI",
                data: Product
            });
            return request;
        }
        //Get Single Records
        this.get = function (ProductNo) {
            return $http.get("/api/ProductsAPI/" + ProductNo);
        }

        //Get All Employees
        this.getProducts = function () {
            return $http.get("/api/ProductsAPI");
        }


        //Update the Record
        this.put = function (ProductNo, Order) {
            var request = $http({
                method: "put",
                url: "/api/ProductsAPI/" + ProductNo,
                data: Order
            });
            return request;
        }
        //Delete the Record
        this.delete = function (ProductNo) {
            var request = $http({
                method: "delete",
                url: "/api/ProductsAPI/" + ProductNo
            });
            return request;
        }
    }

    productService.$inject = ['$http'];

    var customerService = function ($http) {

        //Create new record
        this.post = function (Customer) {
            var request = $http({
                method: "post",
                url: "/api/CustomersAPI",
                data: Customer
            });
            return request;
        }
        //Get Single Records
        this.get = function (CustomerNo) {
            return $http.get("/api/CustomersAPI/" + CustomerNo);
        }

        //Get All Employees
        this.getCustomers = function () {
            return $http.get("/api/CustomersAPI");
        }


        //Update the Record
        this.put = function (CustomerNo, Order) {
            var request = $http({
                method: "put",
                url: "/api/CustomersAPI/" + CustomerNo,
                data: Order
            });
            return request;
        }
        //Delete the Record
        this.delete = function (CustomerNo) {
            var request = $http({
                method: "delete",
                url: "/api/CustomersAPI/" + CustomerNo
            });
            return request;
        }
    }

    customerService.$inject = ['$http'];

    var commonService = function () {
        //separate method for parsing errors into a single flat array
       this.parseErrors = function (response) {
            var errors = [];
            for (var key in response.data.ModelState) {
                for (var i = 0; i < response.data.ModelState[key].length; i++) {
                    errors.push(response.data.ModelState[key][i]);
                }
            }
            return errors;
        }
    }

    var shareService = function () {
        var data =
       {
           OrderID : '',
           OrderChange : 0
       };

        return {
            getOrderChange: function () {
                return data.OrderChange;
            },
            setOrderChange: function (OrderChange) {
                data.OrderChange = OrderChange;
            }
        };

        return {
            getOrderID: function () {
                return data.OrderID;
            },
            setOrderID: function (OrderID) {
                data.OrderID = OrderID;
            }
        };
    }


   