(function () {
    'use strict';
    var controllerId = 'ordertransactions';
    angular.module('app').
        controller(controllerId, ['$rootScope', '$scope', '$location', '$routeParams',
            'bootstrap.dialog', 'common', 'datacontext','model', 'config', ordertransactions]);

    function ordertransactions($rootScope, $scope, $location, $routeParams, bsDialog, common, datacontext, model, config) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var KeyCodes = config.KeyCodes;
        var applyFilter = function () { };
        var wipEntityKey = undefined;
        var entityName = model.entityNames.orderDetail;

        var vm = this;
        vm.title = 'ordertransactions';
        vm.ordertransactions = [];
        vm.ordertransaction = [];
        vm.products = [];
        vm.refresh = refresh;
        vm.parentOrderID = $routeParams.id || null;
        vm.ordertransactionSearch = $routeParams.search || '';
        vm.search = search;
        vm.filteredOrdertransactions = [];
        vm.ordertransactionsFilter = ordertransactionsFilter;
        vm.ordertransactionCount = 0;
        vm.ordertransactionFilteredCount = 0;
        vm.pageChanged = pageChanged;
        vm.gotoordertransaction = gotoordertransaction;
        vm.paging = {
            currentPage: 1,
            maxPagesToShow: 5,
            pageSize: 3
        };
        vm.orderTotal = 0.0;

        vm.addtransaction = addtransaction;
        vm.cancel = cancel;
        vm.save = save;
        vm.deletetransaction = deletetransaction;
        vm.isSaving = false;

        vm.btnSelectProduct = btnSelectProduct;


        Object.defineProperty(vm.paging, 'pageCount', {
            get: function () {
                return Math.floor(vm.ordertransactionFilteredCount / vm.paging.pageSize) + 1;
            }
        });

        activate();

        function activate() {
            onEveryChange();
            common.activateController([getordertransactions(), getProducts()], controllerId)
                .then(function () {
                    getTotal();
                    applyFilter = common.createSearchThrottle(vm, 'ordertransactions');
                    if (vm.ordertransactionSearch) { applyFilter(true); }
                    log('Activated ordertransactions View');
                });
        }


        function getordertransactionCount() {
            return datacontext.orderdetail.getCount().then(function (data) {
                return vm.ordertransactionCount = data;
            });
        }

        function gotoordertransaction(ordertransaction) {
            if (orderdetail && orderdetail.ordertransactionID) {
                $location.path('/ordertransactions/' + ordertransaction.ordertransactionID);
            }
        }

        function getordertransactionFilteredCount() {
            vm.ordertransactionFilteredCount = datacontext.orderdetail.getFilteredCount(vm.ordertransactionSearch);
        }

        function getordertransactions(forceRefresh) {
            //if ($rootScope.transactions) {
            //    vm.filteredOrdertransactions = $rootScope.transactions;
            //}
            return datacontext.orderdetail.getAll(forceRefresh,
                vm.paging.currentPage, vm.paging.pageSize, vm.ordertransactionSearch, vm.parentOrderID)
                .then(function (data) {

                    vm.filteredOrdertransactions = data;
                    //applyFilter();
                    getAllordertransactions();
                    getordertransactionFilteredCount();
                    if (!vm.ordertransactionCount || forceRefresh) {
                        getordertransactionCount();
                    }

                    return data;
                })
        }

        function getAllordertransactions(forceRefresh) {
            var p = new breeze.Predicate('orderID', '==', vm.parentOrderID);
            vm.ordertransactions = datacontext.orderdetail._getAllLocal('Order_Details', 'productID', p);
        }



        function getProducts(forceRefresh) {
            vm.products = datacontext.product.getAllLocal()
            return vm.products;
        }

        function pageChanged(page) {
            if (!page) { return; }
            vm.paging.currentPage = page;
            getordertransactions();
        }

        function refresh() {
            getordertransactions(true);
        }

        function search($event) {
            if ($event.keyCode === KeyCodes.esc) {
                vm.ordertransactionSearch = '';
            }
            //    applyFilter(true);
            //} else {
            //    applyFilter();
            //}
            getordertransactions();
        }

        //function applyFilter() {
        //  vm.filteredEmployees = vm.employees.filter(employeesFilter);
        // }

        function ordertransactionsFilter(ordertransaction) {
            var isMatch = vm.ordertransactionSearch
            ? common.textContains(ordertransaction.ordertransactionID, vm.ordertransactionSearch)
           // || common.textContains(employee.fullName, vm.employeeSearch)
                : true;
            return isMatch;
        }

        function getTotal() {
            vm.total = 0.0;
            if (vm.ordertransactions && vm.ordertransactions.length > 0) {
                vm.ordertransactions.forEach(function (ot) {
                    vm.total = vm.total + ot.lineTotal;
                })

                $rootScope.$broadcast('orderTotalChange', { data: { orderID: vm.parentOrderID, total: vm.total } })
            }
        }

        function autoStoreWip(immediate) {
            common.debouncedThrottle(controllerId, storeWipEntity, 1000, immediate);
        }

        function storeWipEntity() {
            if (!vm.order) return;
            var description = vm.ordertransaction.productID || '[New Order Product]' + vm.ordertransaction.productID
            wipEntityKey = datacontext.zStorageWip.
                storeWipEntity(vm.ordertransaction, wipEntityKey, entityName, description);
        }

        function onEveryChange() {
            $scope.$on(config.events.entitiesChanged,
                function (event, data) {
                    getTotal();
                    autoStoreWip();
                });
        }

        function onHasChanges() {
            $scope.$on(config.events.hasChangesChanged,
                function (event, data) {
                    vm.hasChanges = data.hasChanges;
                });
        }

        function btnSelectProduct(ordertransaction) {
            //return bsDialog.editDialog('Product', '', vm);
            $rootScope.selectedProduct = ordertransaction.product;
            bsDialog.confirmationDialogfromPage('Product', 'app/product/products.html')
                .then(function () { ordertransaction.product = null; })
            ;

        }

        function addtransaction() {
            vm.ordertransaction = datacontext.orderdetail.create(vm.parentOrderID);
            vm.filteredOrdertransactions.push(vm.ordertransaction);
        }

        function cancel() {
            datacontext.cancel();
            removeWipEntity();
            helper.replaceLocationUrlGuidWithId(vm.ordertransaction.productID);
            if (vm.order.entityAspect.entityState.isDetached()) {
                gotoOrders();
            }
        }

        function save() {
            vm.isSaving = true;
            return datacontext.save()
            .then(function (saveResult) {
                vm.isSaving = false;
                removeWipEntity();
                helper.replaceLocationUrlGuidWithId(vm.ordertransaction.productID);
            }, function (error) {
                vm.isSaving = false;
            })
        }

        function deletetransaction(productID) {
            //return bsDialog.deleteDialog('Order transaction').
            //    then(confirmDelete);

            //function confirmDelete() {
            datacontext.markDeleted(vm.ordertransaction);
            for (var i = vm.filteredOrdertransactions.length - 1; i >= 0; i--) {
                if (vm.filteredOrdertransactions[i].productID == productID) {
                    vm.filteredOrdertransactions.splice(i, 1);
                }
            }
            //    vm.save().then(success, failed);

            //    function success() {
            //        removeWipEntity();
            //       // gotoOrders();
            //    }

            //    function failed(error) { cancel(); }
            //}

        }
    }
})();
