(function () {
    'use strict';

    var serviceId = 'repository.product';
    angular.module('app').factory(serviceId,
        ['model', 'repository.abstract', 'zStorage', 'zStorageWip', RepositoryProduct]);

    function RepositoryProduct(model, AbstractRepository, zStorage, zStorageWip) {
        var entityName = 'Product';
        var EntityQuery = breeze.EntityQuery;
        var orderBy = 'productID';
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
            return this.manager.createEntity('Product');
        }

        function getAllLocal(includeNullo) {
            var self = this;
            var predicate;
            if (includeNullo) {
                // predicate = this._predicates.isNullo;
                //predicate = breeze.Predicate.create('productID', '==', 0)
            }
            //model.createNullos(self.manager);
            return self._getAllLocal('Products', orderBy);
        }

        function getAll(forceRemote, page, size, nameFilter) {
            //var orderBy = "productID";
            //var products = [];

            var self = this;

            var take = size || 5;
            var skip = page ? (page - 1) * size : 0

            //if (self._areItemsLoaded() && !forceRemote) {
            if (self.zStorage.areItemsLoaded('Products') && !forceRemote) {
                //products = _getAllLocal('Products', orderBy);
                //return $q.when(products);
                return self.$q.when(getByPage());
            }

            return EntityQuery.from('Products')
               // .select('productID,lastName,firstName,homePhone,extension,photo,product1')
                .orderBy(orderBy)
           // .expand("Product1.firstName")
            .toType(entityName)
            .using(self.manager).execute()
            .to$q(querySucceeded, self._queryFailed)

            function getByPage() {
                var predicate = null;
                if (nameFilter) {
                    predicate = _fullNamePredicate(nameFilter);
                }

                var products = EntityQuery.from('Products')
                    .where(predicate)
                    .take(take)
                    .skip(skip)
                    .orderBy(orderBy)
                    .using(self.manager)
                    .executeLocally();

                return products;
            }

            function querySucceeded(data) {
                //products = data.results;

                var products = self._setIsPartialTrue(data.results);
                self.zStorage.areItemsLoaded('Products', true);
                self.zStorage.save();
                self.log('Retrived [Product Partials] from remote data source',
                    products.length);
                //return products;
                return getByPage();
            }
        }

        function getById(id, forceRemote) {
            return this._getById('Product', id, forceRemote);
        }

        function getCount() {
            var self = this;
            if (self.zStorage.areItemsLoaded('Products')) {
                return self.$q.when(self._getLocalEntityCount('Products'));
            }

            return EntityQuery.from('Products')
            .using(self.manager)
            .execute()
            .to$q(self._getInlineCount);
        }

        function getFilteredCount(nameFilter) {
            var predicate = null;
            if (nameFilter) {
                predicate = _fullNamePredicate(nameFilter);
            }


            var products = EntityQuery.from('Products')
                .where(predicate)
                .using(this.manager)
                .executeLocally();

            return products.length;
        }

        function _fullNamePredicate(filterValue) {
            return Predicate
            .create('productID', '==', filterValue)
            // .or('lastName', 'contains', filterValue)
            ;
        }

    }
})();
