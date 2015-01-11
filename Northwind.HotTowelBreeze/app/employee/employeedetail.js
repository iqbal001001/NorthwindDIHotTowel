(function () {
    'use strict';

    var controllerId = 'employeedetail';
    angular.module('app').
        controller(controllerId,
        ['$routeParams', '$location', '$scope', '$rootScope', '$window',
            'bootstrap.dialog', 'common', 'config', 'datacontext',
            'helper', 'model','fileReader', employeedetail]);

    function employeedetail($routeParams, $location, $scope, $rootScope, $window,
        bsDialog, common, config, datacontext, helper, model, fileReader) {
        var vm = this;
        var entityName = model.entityNames.employee;
        var logError = common.logger.getLogFn(controllerId, 'error');
        var wipEntityKey = undefined;

        vm.activate = activate;
        vm.employeeIdParameter = $routeParams.id;
        vm.employees = [];
        vm.cancel = cancel;
        vm.goBack = goBack;
        vm.save = save;
        vm.deleteEmployee = deleteEmployee;
        vm.isSaving = false;
        vm.hasChanges = false;
        vm.openedBirthDate = false;
        vm.btnBirthDate = btnBirthDate;
        vm.openedHireDate = false;
        vm.btnHireDate = btnHireDate;
        vm.getFile = getFile;
        vm.progress = 0;
        vm.btnEditNotes = btnEditNotes;



        Object.defineProperty(vm, 'canSave', {
            get: canSave
        });

        function canSave() { return vm.hasChanges && !vm.isSaving; }

        function btnEditNotes() {
            return bsDialog.editDialog('Employee', 'editNotes.html',vm);
        }

        function deleteEmployee() {
            return bsDialog.deleteDialog('Employee').
                then(confirmDelete);

            function confirmDelete() {
                datacontext.markDeleted(vm.employee);
                vm.save().then(success, failed);

                function success() {
                    removeWipEntity();
                    gotoEmployees();
                }

                function failed(error) { cancel(); }
            }

        }

        activate();

        function activate() {
            onDestroy();
            onHasChanges();
            initLookups();
            common.activateController([getRequestedEmployee()], controllerId)
             .then(onEveryChange);
                 //log('Activated Employeedetail View');
             //});
        }

        function autoStoreWip(immediate) {
            common.debouncedThrottle(controllerId, storeWipEntity, 1000, immediate);
        }

        function getRequestedEmployee() {
            var val = $routeParams.id;
            if (val === 'new') {
                vm.employee = datacontext.employee.create();
                return vm.employee;
            }

            return datacontext.employee.getEntityByIdOrFromWip(val)
            //return datacontext.employee.getById(val)
            .then(function (data) {
                wipEntityKey = data.Key;
                vm.employee = data.entity || data;
            }, function (error) {
                logError('Unable to get employee ' + val);
                gotoEmployees();
            });
        }



        function cancel() {
            datacontext.cancel();
            removeWipEntity();
            helper.replaceLocationUrlGuidWithId(vm.employee.employeeID);
            if (vm.employee.entityAspect.entityState.isDetached()) {
                gotoEmployees();
            }
        }

        function gotoEmployees() {
            $location.path('/employees');
        }

        function onDestroy() {
            $scope.$on('$destroy', function () {
                autoStoreWip(true);
                datacontext.cancel();
            });
        }

        function onEveryChange() {
            $scope.$on(config.events.entitiesChanged,
                function (event, data) {
                    autoStoreWip();
                });
        }

        function onHasChanges() {
            $scope.$on(config.events.hasChangesChanged,
                function (event, data) {
                    vm.hasChanges = data.hasChanges;
                });
        }

        function goBack() { $window.history.back(); }

        function initLookups() {
            // var lookups = datacontext.lookup.lookupCachedData;
            vm.employees = datacontext.employee.getAllLocal(true);
        }

        function removeWipEntity() {
            datacontext.zStorageWip.removeWipEntity(wipEntityKey);
        }

        function save() {
            vm.isSaving = true;
            return datacontext.save()
            .then(function (saveResult) {
                vm.isSaving = false;
                removeWipEntity();
                helper.replaceLocationUrlGuidWithId(vm.employee.employeeID);
            }, function (error) {
                vm.isSaving = false;
            })
        }

        function storeWipEntity() {
            if (!vm.employee) return;
            var description = vm.employee.fullName || '[New Employee]' + vm.employee.employeeID
            wipEntityKey = datacontext.zStorageWip.
                storeWipEntity(vm.employee, wipEntityKey, entityName, description);
        }

        function btnBirthDate($event) {
            $event.preventDefault();
            $event.stopPropagation();
            vm.openedBirthDate = true;
        };

        function btnHireDate($event) {
            $event.preventDefault();
            $event.stopPropagation();
            vm.openedHireDate = true;
        };


        function getFile() {
            $scope.progress = 0;
            fileReader.readAsDataUrl($scope.file, $scope)
                          .then(function (result) {
                              //$scope.imageSrc = result; //.replace(/^data:image\/(png|jpg|bmp);base64,/, "");
                              vm.employee.photo = result.replace(/^data:image\/(png|jpg|bmp);base64,/, "");
                              //$apply();
                          });
        };

        $scope.$on("fileProgress", function (e, progress) {
            vm.progress = (progress.loaded / progress.total) * 100;
        });

    }
})();
