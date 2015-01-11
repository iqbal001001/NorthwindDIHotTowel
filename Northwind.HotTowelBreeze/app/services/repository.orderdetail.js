(function () {
    'use strict';

    var serviceId = 'repository.orderdetail';
    angular.module('app').factory(serviceId,
        ['model', 'repository.abstract', 'zStorage', 'zStorageWip', Repositoryorderdetail]);

    function Repositoryorderdetail(model, AbstractRepository, zStorage, zStorageWip) {
        var entityName = 'Order_Detail';
        var EntityQuery = breeze.EntityQuery;
        var orderBy = 'orderID,productID';
        var Predicate = breeze.Predicate;
        var FilterQueryOp = breeze.FilterQueryOp;

        function Ctor(mgr) {
            this.serviceId = serviceId;
            this.entityName = entityName;
            this.manager = mgr;
            //Exposed data access functions
            this.zStorage = zStorage;
            this.zStorageWip = zStorageWip;
            this.create = create;
            this.getAll = getAll;
            this.getAllLocal = getAllLocal;
            this.getCount = getCount;
            this.getFilteredCount = getFilteredCount;
            this.getById = getById;
        }

        AbstractRepository.extend(Ctor);

        return Ctor;

        function create(oid) {
            return this.manager.createEntity('Order_Detail', { orderID: oid});
        }

        function getAllLocal(includeNullo) {
            var self = this;
            var predicate;
            if (includeNullo) {
                // predicate = this._predicates.isNullo;
                //predicate = breeze.Predicate.create('employeeID', '==', 0)
            }
            //model.createNullos(self.manager);
            return self._getAllLocal('Order_Details', orderBy);
        }

        function getAll(forceRemote, page, size, orderDetailFilter, orderID) {

            var self = this;
            var predicate = null;
            var take = size || 5;
            var skip = page ? (page - 1) * size : 0

            if (orderID) {
               predicate = new breeze.Predicate("orderID", "==", orderID);
            }

            //if (self._areItemsLoaded() && !forceRemote) {
            if (self.zStorage.areItemsLoaded('OrderDetails') && !forceRemote) {
                //employees = _getAllLocal('Employees', orderBy);
                //return $q.when(employees);
                return self.$q.when(getByPage());
            }

            return EntityQuery.from('OrderDetails')
                //.select('orderDetailID,orderDate,requiredDate,shippedDate')
                .orderBy(orderBy)
            .expand("product")
                .where(predicate)
            .toType(entityName)
            .using(self.manager).execute()
            .to$q(querySucceeded, self._queryFailed)

            function getByPage() {
                var predicate = null;
                if (orderDetailFilter) {
                    predicate = _orderDetailIDPredicate(orderDetailFilter);
                }

                var orderDetails = EntityQuery.from('Order_Details')
                    //.where(predicate)
                    .take(take)
                    .skip(skip)
                    .orderBy(orderBy)
                    .using(self.manager)
                    .executeLocally();

                return orderDetails;
            }

            function querySucceeded(data) {
                //employees = data.results;

                var orderDetails = self._setIsPartialTrue(data.results);
                self.zStorage.areItemsLoaded('OrderDetails', true);
                self.zStorage.save();
                self.log('Retrived [OrderDetail Partials] from remote data source',
                    orderDetails.length);
                //return employees;
                return getByPage();
            }
        }

        function getById(id, forceRemote) {
            return this._getById('OrderDetail', id, forceRemote);
        }

        function getCount() {
            var self = this;
            if (self.zStorage.areItemsLoaded('OrderDetails')) {
                return self.$q.when(self._getLocalEntityCount('Order_Details'));
            }

            return EntityQuery.from('OrderDetails')
            .using(self.manager)
            .execute()
            .to$q(self._getInlineCount);
        }

        function getFilteredCount(orderDetailFilter) {
            var predicate = null;
            if (orderDetailFilter) {
                predicate = _orderDetailIDPredicate(orderDetailFilter);
            }


            var orderDetails = EntityQuery.from('Order_Details')
				.where(predicate)
                .using(this.manager)
                .executeLocally();

            return orderDetails.length;
        }


        function _orderDetailIDPredicate(filterValue) {
            return Predicate
            .create('orderID', '==', filterValue)
            //.or('lastName', 'contains', filterValue)
            ;
        }

    }
})();