(function () {
    'use strict';
    var controllerId = 'employees';
    angular.module('app').
        controller(controllerId, ['$location', '$routeParams', 'common', 'datacontext', 'config', employees]);

    function employees($location, $routeParams, common, datacontext, config) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var KeyCodes = config.KeyCodes;
        var applyFilter = function () { };

        var vm = this;
        vm.title = 'Employees';
        vm.employees = [];
        vm.employee = [];
        vm.refresh = refresh;
        vm.employeeSearch = $routeParams.search || '';
        vm.search = search;
        vm.filteredEmployees = [];
        vm.employeesFilter = employeesFilter;
        vm.employeeCount = 0;
        vm.employeeFilteredCount = 0;
        vm.pageChanged = pageChanged;
        vm.gotoEmployee = gotoEmployee;
        vm.paging = {
            currentPage: 1,
            maxPagesToShow: 5,
            pageSize: 2
        };
        
        Object.defineProperty(vm.paging, 'pageCount', {
            get: function () {
                return Math.floor(vm.employeeFilteredCount / vm.paging.pageSize) + 1;
            }
        });

        activate();

        function activate() {
            common.activateController([getEmployees()], controllerId)
                .then(function () {
                    applyFilter = common.createSearchThrottle(vm, 'employees');
                    if (vm.employeeSearch) { applyFilter(true); }
                    log('Activated Employees View');
                });
        }

        function getEmployeeCount() {
            return datacontext.employee.getCount().then(function (data) {
                return vm.employeeCount = data;
            });
        }

        function gotoEmployee(employee) {
            if (employee && employee.employeeID) {
                $location.path('/employee/' + employee.employeeID);
            }
        }

        function getEmployeeFilteredCount() {
            vm.employeeFilteredCount = datacontext.employee.getFilteredCount(vm.employeeSearch);
        }

        function getEmployees(forceRefresh) {
            return datacontext.employee.getAll(forceRefresh,
                vm.paging.currentPage,vm.paging.pageSize,vm.employeeSearch)
                .then(function (data) {
                    //vm.employees = vm.filteredEmployees = data;
                    vm.filteredEmployees = data;
                    //applyFilter();
                    getEmployeeFilteredCount();
                    if (!vm.employeeCount || forceRefresh) {
                        getEmployeeCount();
                    }
                  
                    return data;
                })
        }

        function pageChanged(page) {
            if (!page) { return; }
            vm.paging.currentPage = page;
            getEmployees();
        }

        function refresh() {
            getEmployees(true);
        }

        function search($event) {
            if ($event.keyCode === KeyCodes.esc) {
                vm.employeeSearch = '';}
            //    applyFilter(true);
            //} else {
            //    applyFilter();
            //}
            getEmployees();
        }

        //function applyFilter() {
        //  vm.filteredEmployees = vm.employees.filter(employeesFilter);
        // }

        function employeesFilter(employee) {
            var isMatch = vm.employeeSearch
            ? common.textContains(employee.fullName, vm.employeeSearch)
           // || common.textContains(employee.fullName, vm.employeeSearch)
                : true;
            return isMatch;
        }
    }
})();
