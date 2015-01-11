(function () {
    'use strict';
    var controllerId = 'dashboard';
    angular.module('app').controller(controllerId, ['common', 'datacontext', dashboard]);

    function dashboard(common, datacontext) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        var vm = this;
        vm.news = {
            title: 'Hot Towel Angular',
            description: 'Hot Towel Angular is a SPA template for Angular developers.'
        };
        vm.messageCount = 0;
        vm.employeeCount = 0;
        vm.people = [];
        vm.title = 'Dashboard';

        activate();

        function activate() {
            var promises = [getEmployeeCount()];
            common.activateController(promises, controllerId)
                .then(function () { log('Activated Dashboard View'); });
        }

     
        function getEmployeeCount() {
            return datacontext.employee.getCount().then(function (data) {
                return vm.employeeCount = data;
            });
        }

     


    }
})();