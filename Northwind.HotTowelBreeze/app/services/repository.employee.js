(function () {
    'use strict';

    var serviceId = 'repository.employee';
    angular.module('app').factory(serviceId,
        ['model', 'repository.abstract', 'zStorage', 'zStorageWip', RepositoryEmployee]);

    function RepositoryEmployee(model, AbstractRepository, zStorage, zStorageWip) {
        var entityName = 'Employee';
        var EntityQuery = breeze.EntityQuery;
        var orderBy = 'firstName,lastName';
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
            return this.manager.createEntity('Employee');
        }

        function getAllLocal(includeNullo) {
            var self = this;
            var predicate;
            if (includeNullo) {
                // predicate = this._predicates.isNullo;
                //predicate = breeze.Predicate.create('employeeID', '==', 0)
            }
            //model.createNullos(self.manager);
            return self._getAllLocal('Employees', orderBy);
        }

        function getAll(forceRemote, page, size, nameFilter) {
            //var orderBy = "employeeID";
            //var employees = [];

            var self = this;

            var take = size || 5;
            var skip = page ? (page - 1) * size : 0

            //if (self._areItemsLoaded() && !forceRemote) {
            if (self.zStorage.areItemsLoaded('Employees') && !forceRemote) {
                //employees = _getAllLocal('Employees', orderBy);
                //return $q.when(employees);
                return self.$q.when(getByPage());
            }

            return EntityQuery.from('Employees')
                .select('employeeID,lastName,firstName,homePhone,extension,photo,employee1')
                .orderBy(orderBy)
               // .expand("Employee1.firstName")
                .toType(entityName)
                .using(self.manager).execute()
                .to$q(querySucceeded, self._queryFailed)

            function getByPage() {
                var predicate = null;
                if (nameFilter) {
                    predicate = _fullNamePredicate(nameFilter);
                }

                var employees = EntityQuery.from('Employees')
                    .where(predicate)
                    .take(take)
                    .skip(skip)
                    .orderBy(orderBy)
                    .using(self.manager)
                    .executeLocally();

                return employees;
            }

            function querySucceeded(data) {
                //employees = data.results;

                var employees = self._setIsPartialTrue(data.results);
                self.zStorage.areItemsLoaded('Employees', true);
                self.zStorage.save();
                self.log('Retrived [Employee Partials] from remote data source',
                    employees.length);
                //return employees;
                return getByPage();
            }
        }

        function getById(id, forceRemote) {
            return this._getById('Employee', id, forceRemote);
        }

        function getCount() {
            var self = this;
            if (self.zStorage.areItemsLoaded('Employees')) {
                return self.$q.when(self._getLocalEntityCount('Employees'));
            }

            return EntityQuery.from('Employees')
            .using(self.manager)
            .execute()
            .to$q(self._getInlineCount);
        }

        function getFilteredCount(nameFilter) {
            var predicate = null;
            if (nameFilter) {
                predicate = _fullNamePredicate(nameFilter);
            }


            var employees = EntityQuery.from('Employees')
                .where(predicate)
                .using(this.manager)
                .executeLocally();

            return employees.length;
        }

        function _fullNamePredicate(filterValue) {
            return Predicate
            .create('firstName', 'contains', filterValue)
            .or('lastName', 'contains', filterValue);
        }

    }
})();
