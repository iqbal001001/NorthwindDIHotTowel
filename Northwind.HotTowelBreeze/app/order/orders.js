(function () {
    'use strict';
    var controllerId = 'orders';
    angular.module('app').
        controller(controllerId, ['$location', '$routeParams', 'common', 'datacontext', 'config', orders]);

    function orders($location, $routeParams, common, datacontext, config) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var KeyCodes = config.KeyCodes;
        var applyFilter = function () { };

        var vm = this;
        vm.title = 'Orders';
        vm.orders = [];
        vm.order = [];
        vm.refresh = refresh;
        vm.orderSearch = $routeParams.search || '';
        vm.search = search;
        vm.filteredOrders = [];
        vm.ordersFilter = ordersFilter;
        vm.orderCount = 0;
        vm.orderFilteredCount = 0;
        vm.pageChanged = pageChanged;
        vm.gotoOrder = gotoOrder;
        vm.paging = {
            currentPage: 1,
            maxPagesToShow: 5,
            pageSize: 3
        };

        Object.defineProperty(vm.paging, 'pageCount', {
            get: function () {
                return Math.floor(vm.orderFilteredCount / vm.paging.pageSize) + 1;
            }
        });

        activate();

        function activate() {
            common.activateController([getOrders()], controllerId)
                .then(function () {
                    applyFilter = common.createSearchThrottle(vm, 'orders');
                    if (vm.orderSearch) { applyFilter(true); }
                    log('Activated Orders View');
                });
        }

        function getOrderCount() {
            return datacontext.order.getCount().then(function (data) {
                return vm.orderCount = data;
            });
        }

        function gotoOrder(order) {
            if (order && order.orderID) {
                $location.path('/order/' + order.orderID);
            }
        }

        function getOrderFilteredCount() {
            vm.orderFilteredCount = datacontext.order.getFilteredCount(vm.orderSearch);
        }

        function getOrders(forceRefresh) {
            return datacontext.order.getAll(forceRefresh,
                vm.paging.currentPage, vm.paging.pageSize, vm.orderSearch)
                .then(function (data) {

                    vm.filteredOrders = data;
                    //applyFilter();
                    getOrderFilteredCount();
                    if (!vm.orderCount || forceRefresh) {
                        getOrderCount();
                    }

                    return data;
                })
        }

        function pageChanged(page) {
            if (!page) { return; }
            vm.paging.currentPage = page;
            getOrders();
        }

        function refresh() {
            getOrders(true);
        }

        function search($event) {
            if ($event.keyCode === KeyCodes.esc) {
                vm.orderSearch = '';
            }
            //    applyFilter(true);
            //} else {
            //    applyFilter();
            //}
            getOrders();
        }

        //function applyFilter() {
        //  vm.filteredEmployees = vm.employees.filter(employeesFilter);
        // }

        function ordersFilter(order) {
            var isMatch = vm.orderSearch
            ? common.textContains(order.orderID, vm.orderSearch)
           // || common.textContains(employee.fullName, vm.employeeSearch)
                : true;
            return isMatch;
        }
    }
})();
