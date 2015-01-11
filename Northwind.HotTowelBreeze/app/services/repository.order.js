(function () {
	'use strict';

	var serviceId = 'repository.order';
	angular.module('app').factory(serviceId,
        ['model', 'repository.abstract', 'zStorage', 'zStorageWip', RepositoryOrder]);

	function RepositoryOrder(model, AbstractRepository, zStorage, zStorageWip) {
		var entityName = 'Order';
		var EntityQuery = breeze.EntityQuery;
		var orderBy = 'orderID,orderDate';
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

		function create() {
			return this.manager.createEntity('Order');
		}

		function getAllLocal(includeNullo) {
			var self = this;
			var predicate;
			if (includeNullo) {
				// predicate = this._predicates.isNullo;
				//predicate = breeze.Predicate.create('employeeID', '==', 0)
			}
			//model.createNullos(self.manager);
			return self._getAllLocal('Orders', orderBy);
		}

		function getAll(forceRemote, page, size, orderFilter) {

			var self = this;

			var take = size || 5;
			var skip = page ? (page - 1) * size : 0

			//if (self._areItemsLoaded() && !forceRemote) {
			if (self.zStorage.areItemsLoaded('Orders') && !forceRemote) {
				//employees = _getAllLocal('Employees', orderBy);
				//return $q.when(employees);
				return self.$q.when(getByPage());
			}

			return EntityQuery.from('Orders')
                .select('orderID,orderDate,requiredDate,shippedDate')
                .orderBy(orderBy)
           .expand("order_Details")
            .toType(entityName)
            .using(self.manager).execute()
            .to$q(querySucceeded, self._queryFailed)

			function getByPage() {
				var predicate = null;
				if (orderFilter) {
					predicate = _orderIDPredicate(orderFilter);
				}

				var orders = EntityQuery.from('Orders')
                    //.where(predicate)
                    .take(take)
                    .skip(skip)
                    .orderBy(orderBy)
                    .using(self.manager)
                    .executeLocally();

				return orders;
			}

			function querySucceeded(data) {
				//employees = data.results;

				var orders = self._setIsPartialTrue(data.results);
				self.zStorage.areItemsLoaded('Orders', true);
				self.zStorage.save();
				self.log('Retrived [Order Partials] from remote data source',
                    orders.length);
				//return employees;
				return getByPage();
			}
		}

		function getById(id, forceRemote) {
			return this._getById('Order', id, forceRemote);
		}

		function getCount() {
			var self = this;
			if (self.zStorage.areItemsLoaded('Orders')) {
				return self.$q.when(self._getLocalEntityCount('Orders'));
			}

			return EntityQuery.from('Orders')
            .using(self.manager)
            .execute()
            .to$q(self._getInlineCount);
		}

		function getFilteredCount(orderFilter) {
			var predicate = null;
			if (orderFilter) {
				predicate = _orderIDPredicate(orderFilter);
			}


			var orders = EntityQuery.from('Orders')
				.where(predicate)
                .using(this.manager)
                .executeLocally();

			return orders.length;
		}


		function _orderIDPredicate(filterValue) {
			return Predicate
            .create('orderID', '==', filterValue)
			//.or('lastName', 'contains', filterValue)
			;
		}

	}
})();
