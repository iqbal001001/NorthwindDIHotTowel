(function () {
    'use strict';

    var serviceId = 'repository.customer';
    angular.module('app').factory(serviceId,
        ['model', 'repository.abstract', 'zStorage', 'zStorageWip', RepositoryCustomer]);

    function RepositoryCustomer(model, AbstractRepository, zStorage, zStorageWip) {
        var entityName = 'Customer';
        var EntityQuery = breeze.EntityQuery;
        var orderBy = 'customerID,companyName';
        var Predicate = breeze.Predicate;

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

        function create() {
            return this.manager.createEntity('Customer');
        }

        function getAllLocal(includeNullo) {
            var self = this;
            var predicate;
            if (includeNullo) {
                // predicate = this._predicates.isNullo;
                //predicate = breeze.Predicate.create('customerID', '==', 0)
            }
            //model.createNullos(self.manager);
            return self._getAllLocal('Customers', orderBy);
        }

        function getAll(forceRemote, page, size, companyFilter) {
            //var orderBy = "customerID";
            //var customers = [];

            var self = this;

            var take = size || 5;
            var skip = page ? (page - 1) * size : 0

            //if (self._areItemsLoaded() && !forceRemote) {
            if (self.zStorage.areItemsLoaded('Customers') && !forceRemote) {
                //customers = _getAllLocal('Customers', orderBy);
                //return $q.when(customers);
                return self.$q.when(getByPage());
            }

            return EntityQuery.from('Customers')
                .select('customerID,companyName')
                .orderBy(orderBy)
           // .expand("Customer1.firstName")
            .toType(entityName)
            .using(self.manager).execute()
            .to$q(querySucceeded, self._queryFailed)

            function getByPage() {
                var predicate = null;
                if (companyFilter) {
                    predicate = _companyNamePredicate(companyFilter);
                }

                var customers = EntityQuery.from('Customers')
                    .where(predicate)
                    .take(take)
                    .skip(skip)
                    .orderBy(orderBy)
                    .using(self.manager)
                    .executeLocally();

                return customers;
            }

            function querySucceeded(data) {
                //customers = data.results;

                var customers = self._setIsPartialTrue(data.results);
                self.zStorage.areItemsLoaded('Customers', true);
                self.zStorage.save();
                self.log('Retrived [Customer Partials] from remote data source',
                    customers.length);
                //return customers;
                return getByPage();
            }
        }

        function getById(id, forceRemote) {
            return this._getById('Customer', id, forceRemote);
        }

        function getCount() {
            var self = this;
            if (self.zStorage.areItemsLoaded('Customers')) {
                return self.$q.when(self._getLocalEntityCount('Customers'));
            }

            return EntityQuery.from('Customers')
            .using(self.manager)
            .execute()
            .to$q(self._getInlineCount);
        }

        function getFilteredCount(companyFilter) {
            var predicate = null;
            if (companyFilter) {
                predicate = _companyNamePredicate(companyFilter);
            }


            var customers = EntityQuery.from('Customers')
                .where(predicate)
                .using(this.manager)
                .executeLocally();

            return customers.length;
        }

        function _companyNamePredicate(filterValue) {
            return Predicate
            .create('companyName', 'contains', filterValue)
            //.or('lastName', 'contains', filterValue);
        }

    }
})();
