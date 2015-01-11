(function () {
    'use strict';
    var controllerId = 'products';
    angular.module('app').
        controller(controllerId, ['$scope', '$rootScope', '$location', '$routeParams',
            'common', 'datacontext', 'model', 'config', products]);

    function products($scope, $rootScope, $location, $routeParams, common, datacontext, model, config) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var KeyCodes = config.KeyCodes;
        var applyFilter = function () { };
        var wipEntityKey = undefined;
        var entityName = model.entityNames.product;

        var vm = this;
        vm.title = 'Products';
        vm.products = [];
        vm.product = [];
        vm.refresh = refresh;
        vm.parentProductID = $routeParams.id || '';
        vm.Productsearch = $routeParams.search || '';
        vm.search = search;
        vm.filteredProducts = [];
        vm.productsFilter = productsFilter;
        vm.productCount = 0;
        vm.productFilteredCount = 0;
        vm.pageChanged = pageChanged;
        vm.gotoProduct = gotoProduct;
        vm.paging = {
            currentPage: 1,
            maxPagesToShow: 5,
            pageSize: 10
        };


        //vm.addProduct = addProduct;
        vm.cancel = cancel;
        vm.save = save;
        vm.deleteProduct = deleteProduct;
        vm.isSaving = false;
        vm.hasChanges = false;

        Object.defineProperty(vm.paging, 'pageCount', {
            get: function () {
                return Math.floor(vm.productFilteredCount / vm.paging.pageSize) + 1;
            }
        });

        activate();

        function activate() {
            onDestroy();
            onHasChanges();
            common.activateController([getProducts()], controllerId)
                .then(function () {
                    applyFilter = common.createSearchThrottle(vm, 'products');
                    if ($rootScope.selectedProduct && vm.parentProductID === undefined) {
                        vm.product = $rootScope.selectedProduct;
                    }
                    if (vm.parentProductID) {    gotoProduct(vm.parentProductID);}
                    if (vm.Productsearch) { applyFilter(true); }
                    log('Activated Products View');
                });
        }

        function getProductCount() {
            return datacontext.product.getCount().then(function (data) {
                return vm.productCount = data;
            });
        }

        function gotoProduct(val) {
            // vm.product = product;

            if (val === 'new') {
                vm.product = datacontext.product.create();
                return vm.product;
            }

            return datacontext.product.getEntityByIdOrFromWip(val)
            //return datacontext.employee.getById(val)
            .then(function (data) {
                wipEntityKey = data.Key;
                vm.product = data.entity || data;
                $rootScope.selectedProduct = vm.product;
            }, function (error) {
                logError('Unable to get product ' + val.productID);
                // gotoEmployees();
            });

        }

        function getProductFilteredCount() {
            vm.productFilteredCount = datacontext.product.getFilteredCount(vm.Productsearch);
        }

        function getProducts(forceRefresh) {
            return datacontext.product.getAll(forceRefresh,
                vm.paging.currentPage, vm.paging.pageSize, vm.Productsearch)
                .then(function (data) {

                    vm.filteredProducts = data;
                    //applyFilter();
                    getProductFilteredCount();
                    if (!vm.productCount || forceRefresh) {
                        getProductCount();
                    }

                    return data;
                })
        }

        function pageChanged(page) {
            if (!page) { return; }
            vm.paging.currentPage = page;
            getProducts();
        }

        function refresh() {
            getProducts(true);
        }

        function search($event) {
            if ($event.keyCode === KeyCodes.esc) {
                vm.Productsearch = '';
            }
            //    applyFilter(true);
            //} else {
            //    applyFilter();
            //}
            getProducts();
        }

        //function applyFilter() {
        //  vm.filteredEmployees = vm.employees.filter(employeesFilter);
        // }

        function productsFilter(product) {
            var isMatch = vm.Productsearch
            ? common.textContains(product.productID, vm.Productsearch)
           // || common.textContains(employee.fullName, vm.employeeSearch)
                : true;
            return isMatch;
        }

        Object.defineProperty(vm, 'canSave', {
            get: canSave
        });

        function canSave() { return vm.hasChanges && !vm.isSaving; }

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

        function removeWipEntity() {
            datacontext.zStorageWip.removeWipEntity(wipEntityKey);
        }

        function autoStoreWip(immediate) {
            common.debouncedThrottle(controllerId, storeWipEntity, 1000, immediate);
        }

        function storeWipEntity() {
            if (!vm.product) return;
            var description = vm.product.productName || '[New Product]' + vm.product.productID
            wipEntityKey = datacontext.zStorageWip.
                storeWipEntity(vm.product, wipEntityKey, entityName, description);
        }

        function save() {
            vm.isSaving = true;
            return datacontext.save()
            .then(function (saveResult) {
                vm.isSaving = false;
                removeWipEntity();
                helper.replaceLocationUrlGuidWithId(vm.product.productID);
            }, function (error) {
                vm.isSaving = false;
            })
        }

        function cancel() {
            datacontext.cancel();
            removeWipEntity();
            helper.replaceLocationUrlGuidWithId(vm.product.productID);
            if (vm.employee.entityAspect.entityState.isDetached()) {
                // gotoEmployees();
            }
        }

        function deleteProduct() {
            return bsDialog.deleteDialog('Product').
                then(confirmDelete);

            function confirmDelete() {
                datacontext.markDeleted(vm.product);
                vm.save().then(success, failed);

                function success() {
                    removeWipEntity();
                    // gotoEmployees();
                }

                function failed(error) { cancel(); }
            }

        }
    }
})();