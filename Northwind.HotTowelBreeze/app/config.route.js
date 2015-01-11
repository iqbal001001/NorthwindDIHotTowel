(function () {
    'use strict';

    var app = angular.module('app');

    // Collect the routes
    app.constant('routes', getRoutes());
    
    // Configure the routes and route resolvers
    app.config(['$routeProvider', 'routes', routeConfigurator]);
    function routeConfigurator($routeProvider, routes) {

        $routeProvider.when('/pass', {
            templateUrl: 'app/employee/employees.html',
            resolve: {fake: fakeAllow}
        })

        $routeProvider.when('/fail', {
            templateUrl: 'app/employee/employee.html',
            resolve: { fake: fakeReject }
        })

        fakeAllow.$inject = ['$q'];
        function fakeAllow($q) {
            var data = { x: 1 };
            var defer = $q.defer();
            defer.resolve(data);
            return defer.promise;
        }

        fakeReject.$inject = ['$q'];
        function fakeReject($q) {
            var defer = $q.defer();
            defer.reject({msg: ' not pass'});
            return defer.promise;
        }

        routes.forEach(function (r) {
            // set resolver for all the route
           // by extending the existing resolve
            r.config.resolve = angular.extend(r.config.resolve || {}, {
                prime: prime
            });
            $routeProvider.when(r.url, r.config);
        });
        $routeProvider.otherwise({ redirectTo: '/' });
    }

    prime.$inject = ['datacontext'];
    function prime(dc) {
       return dc.prime();
    }

    // Define the routes 
    function getRoutes() {
        return [
            {
                url: '/',
                config: {
                    templateUrl: 'app/dashboard/dashboard.html',
                    title: 'dashboard',
                    settings: {
                        nav: 1,
                        content: '<i class="fa fa-dashboard"></i> Dashboard'
                    }
                }
            }, {
                url: '/admin',
                config: {
                    title: 'admin',
                    templateUrl: 'app/admin/admin.html',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
                    }
                }
            }, {
                url: '/employees',
                config: {
                    title: 'employees',
                    templateUrl: 'app/employee/employees.html',
                    settings: {
                        nav: 3,
                        content: '<i class="fa fa-lock"></i> Employees'
                    }
                }
            }, {
                url: '/employee/:id',
                config: {
                    title: 'employee',
                    templateUrl: 'app/employee/employeedetail.html',
                    settings: {}
                }
            }, {
                url: '/employees/search/:search',
                config: {
                    title: 'employees search',
                    templateUrl: 'app/employee/employees.html',
                    settings: {
            
                    }
                }
            }, {
                url: '/orders',
                config: {
                    title: 'orders',
                    templateUrl: 'app/order/orders.html',
                    settings: {
                        nav: 4,
                        content: '<i class="fa fa-lock"></i> Orders'
                    }
                }
            }, {
                url: '/order/:id',
                config: {
                    title: 'order',
                    templateUrl: 'app/order/orderdetail.html',
                    settings: {}
                }
            }, {
                url: '/orders/search/:search',
                config: {
                    title: 'orders search',
                    templateUrl: 'app/order/orders.html',
                    settings: {

                    }
                }
            }, {
                url: '/ordertransactions',
                config: {
                    title: 'order trans',
                    templateUrl: 'app/order/ordertransactions.html',
                    settings: {
                      
                    }
                }
            }, {
                url: '/ordertransactions/:id',
                config: {
                    title: 'order Details',
                    templateUrl: 'app/order/ordertransactions.html',
                    settings: {}
                }
            }, {
                url: '/ordertransactions/search/:search',
                config: {
                    title: 'order Details search',
                    templateUrl: 'app/order/ordertransactions.html',
                    settings: {

                    }
                }
            }, {
                url: '/products',
                config: {
                    title: 'products',
                    templateUrl: 'app/product/products.html',
                    settings: {
                        nav: 5,
                        content: '<i class="fa fa-lock"></i> products'
                    }
                }
            }, {
                url: '/product/:id',
                config: {
                    title: 'products',
                    templateUrl: 'app/product/products.html',
                    settings: {}
                }
            }, {
                url: '/products/search/:search',
                config: {
                    title: 'products search',
                    templateUrl: 'app/product/products.html',
                    settings: {

                    }
                }
            }, {
                url: '/workinprogress',
                config: {
                    title: 'workinprogress',
                    templateUrl: 'app/wip/wip.html',
                    settings: {
                        content: '<i class="glyphicon glyphicon-asterisk"></i> Work In Progress'
                    }
                }
            }
        ];
    }
})();