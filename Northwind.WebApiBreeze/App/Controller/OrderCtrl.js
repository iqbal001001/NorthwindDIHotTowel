(function () {

    angular.module('angularapp').controller('employeeCtrl',
   ['$q', '$scope',  'dataservice', controller]);

    function controller($q, $scope, dataservice) {

        $scope.IsNewRecord = 1;
       
        $scope.addItem = addItem;
        $scope.getEmployee = getEmployee;
        $scope.items = [];
        $scope.employee = [];
        $scope.newEmployee = newEmployee;
        $scope.deleteEmployee = deleteEmployee;
        $scope.saveChangesToServer = saveChangesToServer;
        $scope.rejectChanges = rejectChanges;
        getOrders();

        function getOrders() {

        }

        function getOrder(Order) {

        }

        function saveChangeToServer() {

        }

        function rejectChanges() {

        }

        function newOrder() {

        }

        function deleteOrder() {

        }


    }
})();