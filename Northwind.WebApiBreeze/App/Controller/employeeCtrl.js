(function () {

    angular.module('angularapp').controller('employeeCtrl',
    ['$q', '$scope', 'logger', 'dataservice', 'fileReader', controller]);

    function controller($q, $scope, logger, dataservice, fileReader) {

        $scope.IsNewRecord = 1;
        // The controller's API to which the view binds
        $scope.getEmployee = getEmployee;
        $scope.items = [];
        $scope.employee = [];
        $scope.errorValidationSubToken = null;
        $scope.newEmployee = newEmployee;
        $scope.deleteEmployee = deleteEmployee;
        $scope.saveChangesToServer = saveChangesToServer;
        $scope.rejectChanges = rejectChanges;
      

        
        dataservice.initValidation();
        dataservice.addPropertyChangeHandler(propertyChanged);
        getEmployees();
        

        /* Implementation */
        function saveChangesToServer() {
            return dataservice.saveChangesToServer()
        }

        function rejectChanges() {
            $scope.employee.entityAspect.rejectChanges();
        }

        function newEmployee() {
            $scope.employee = dataservice.newEmployee();
            $scope.items.push($scope.employee);
        }

        function deleteEmployee() {
            $scope.employee.entityAspect.setDeleted();
            $scope.items.splice($scope.items.indexOf($scope.employee), 1);
            //newEmployee();
        }

        function getEmployees() {

            getTodosImpl()

            function getTodosImpl() {
                dataservice.getEmployee()
                    .then(querySucceeded);
            }

            function querySucceeded(data) {
                $scope.items = data.results;
                logger.info("Fetched Emoloyee ");// +
            }
        };

        function getEmployee(emp) {
            if ($scope.errorValidationSubToken)
                $scope.employee.entityAspect.validationErrorsChanged.unsubscribe($scope.errorValidationSubToken);

            $scope.errorValidationSubToken =
                emp.entityAspect.validationErrorsChanged.subscribe(function (args) {
                    var message = '';
                    if (args.added) {
                        for (var i = 0; i < args.added.length; i++) {
                            if (i > 0) message += ",";
                            message = message + args.added[i].errorMessage;
                        }
                    }
                    if (message) logger.error(message, "Validation Errors");
                });
            $scope.employee = emp;
            $scope.IsNewRecord = 0;
        }

        function getNewEmployee() {
            $scope.employee = [];
            $scope.IsNewRecord = 1;
        }

        function propertyChanged(value) {
            //save();
            $scope.isChanged = value;
        }

        function removeItem(item) {
            // remove the item from the list of presented items
            // N.B.: not a delete; it may still exist in cache and the db
            $scope.items = $scope.items.filter(function (i) {
                return i !== item;
            });
        }





        //http://plnkr.co/edit/y5n16v?p=preview
        //http://odetocode.com/blogs/scott/archive/2013/07/03/building-a-filereader-service-for-angularjs-the-service.aspx



        $scope.getFile = function () {
            $scope.progress = 0;
            fileReader.readAsDataUrl($scope.file, $scope)
                          .then(function (result) {
                              //$scope.imageSrc = result; //.replace(/^data:image\/(png|jpg|bmp);base64,/, "");
                              $scope.employee.Photo = result.replace(/^data:image\/(png|jpg|bmp);base64,/, "")
                          });
        };

        $scope.$on("fileProgress", function (e, progress) {
            $scope.progress = progress.loaded / progress.total;
        });



    }

})();