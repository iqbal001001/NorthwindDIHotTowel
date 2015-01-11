(function () {
    'use strict';

    var controllerId = 'ordertransaction';
    angular.module('app').
        controller(controllerId,
        ['$routeParams', '$location', '$scope', '$rootScope', '$window',
            'bootstrap.dialog', 'common', 'config', 'datacontext',
            'helper', 'model', 'fileReader', ordertransaction]);

    function ordertransaction($routeParams, $location, $scope, $rootScope, $window,
        bsDialog, common, config, datacontext, helper, model, fileReader) {
        var vm = this;
        var entityName = model.entityNames.order;
        var logError = common.logger.getLogFn(controllerId, 'error');
        var wipEntityKey = undefined;

        vm.activate = activate;
        vm.orderIdParameter = $routeParams.id;
        vm.orders = [];
        vm.employees = {};
        vm.customers = {};
        vm.cancel = cancel;
        vm.goBack = goBack;
        vm.save = save;
        vm.deleteOrder = deleteOrder;
        vm.gotoordertransaction = gotoordertransaction
        vm.isSaving = false;
        vm.hasChanges = false;
        vm.openedOrderDate = false;
        vm.btnOrderDate = btnOrderDate;
        vm.openedRequiredDate = false;
        vm.btnRequiredDate = btnRequiredDate;
        vm.openedShippedDate = false;
        vm.btnShippedDate = btnShippedDate;




        Object.defineProperty(vm, 'canSave', {
            get: canSave
        });

        function canSave() { return vm.hasChanges && !vm.isSaving; }

        function btnEditNotes() {
            return bsDialog.editDialog('Order', 'editNotes.html', vm);
        }

        function deleteOrder() {
            return bsDialog.deleteDialog('Order').
                then(confirmDelete);

            function confirmDelete() {
                datacontext.markDeleted(vm.order);
                vm.save().then(success, failed);

                function success() {
                    removeWipEntity();
                    gotoOrders();
                }

                function failed(error) { cancel(); }
            }

        }

        activate();

        function activate() {
            onDestroy();
            onHasChanges();
            initLookups();
            common.activateController([getRequestedOrder(), getEmployees(), getCustomers()], controllerId)
             .then(onEveryChange);
            //log('Activated ordertransaction View');
            //});
        }

        function autoStoreWip(immediate) {
            common.debouncedThrottle(controllerId, storeWipEntity, 1000, immediate);
        }

        function gotoordertransaction() {
            if (vm.order && vm.order.orderID) {
                $location.path('/ordertransactions/' + vm.order.orderID);
            }
        }

        function getRequestedOrder() {
            var val = $routeParams.id;
            if (val === 'new') {
                vm.order = datacontext.order.create();
                return vm.order;
            }

            return datacontext.order.getEntityByIdOrFromWip(val)
            //return datacontext.order.getById(val)
            .then(function (data) {
                wipEntityKey = data.Key;
                vm.order = data.entity || data;
            }, function (error) {
                logError('Unable to get order ' + val);
                gotoOrders();
            });
        }

        function getEmployees(forceRefresh) {
            vm.employees = datacontext.employee.getAllLocal()
            return vm.employees;
        }

        function getCustomers(forceRefresh) {
            vm.customers = datacontext.customer.getAllLocal()
            return vm.customers;
        }

        function cancel() {
            datacontext.cancel();
            removeWipEntity();
            helper.replaceLocationUrlGuidWithId(vm.order.orderID);
            if (vm.order.entityAspect.entityState.isDetached()) {
                gotoOrders();
            }
        }

        function gotoOrders() {
            $location.path('/orders');
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
            vm.orders = datacontext.order.getAllLocal(true);
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
                helper.replaceLocationUrlGuidWithId(vm.order.orderID);
            }, function (error) {
                vm.isSaving = false;
            })
        }

        function storeWipEntity() {
            if (!vm.order) return;
            var description = vm.order.fullName || '[New Order]' + vm.order.orderID
            wipEntityKey = datacontext.zStorageWip.
                storeWipEntity(vm.order, wipEntityKey, entityName, description);
        }

        function btnOrderDate($event) {
            $event.preventDefault();
            $event.stopPropagation();
            vm.openedOrderDate = true;
        };

        function btnRequiredDate($event) {
            $event.preventDefault();
            $event.stopPropagation();
            vm.openedRequiredDate = true;
        };

        function btnShippedDate($event) {
            $event.preventDefault();
            $event.stopPropagation();
            vm.openedShippedDate = true;
        };


    }
})();