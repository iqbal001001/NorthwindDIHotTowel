(function () {
    'use strict';

    var serviceId = 'datacontext2';
    angular.module('app').factory(serviceId,
        ['common', 'entityManagerFactory', 'config', 'model', datacontext2]);

    function datacontext2(common, emFactory, config, model) {
        var EntityQuery = breeze.EntityQuery;
        var getLogFn = common.logger.getLogFn;
        var entityNames = model.entityNames;
        var log = getLogFn(serviceId);
        var logError = getLogFn(serviceId, 'error');
        var logSucess = getLogFn(serviceId, 'success');
        var manager = emFactory.newManager();
        var $q = common.$q;
        var primePromise;

        var storeMeta = {
            isLoaded: {
                employees: false
            }
        }


        var service = {
            getPeople: getPeople,
            getFilteredCount: getFilteredCount,
            getEmployeeCount: getEmployeeCount,
            getMessageCount: getMessageCount,
            getEmployeesPartials: getEmployeesPartials,
            prime: prime
        };

        return service;

        function getMessageCount() { return $q.when(72); }

        function getPeople() {
            var people = [
                { firstName: 'John', lastName: 'Papa', age: 25, location: 'Florida' },
                { firstName: 'Ward', lastName: 'Bell', age: 31, location: 'California' },
                { firstName: 'Colleen', lastName: 'Jones', age: 21, location: 'New York' },
                { firstName: 'Madelyn', lastName: 'Green', age: 18, location: 'North Dakota' },
                { firstName: 'Ella', lastName: 'Jobs', age: 18, location: 'South Dakota' },
                { firstName: 'Landon', lastName: 'Gates', age: 11, location: 'South Carolina' },
                { firstName: 'Haley', lastName: 'Guthrie', age: 35, location: 'Wyoming' }
            ];
            return $q.when(people);
        }

        function getEmployeesPartials(forceRemote, page, size, nameFilter) {
            var orderBy = "employeeID";
            var employees = [];

            var take = size || 5;
            var skip = page ? (page - 1) * size : 0

            if (_areEmployeesLoaded() && !forceRemote) {
                //employees = _getAllLocal('Employees', orderBy);
                //return $q.when(employees);
                return $q.when(getByPage());
            }

            return EntityQuery.from('Employees')
                .orderBy(orderBy)
            .toType(entityNames.employee)
            .using(manager).execute()
            .to$q(querySucceeded, _queryFailed)

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
                    .using(manager)
                    .executeLocally();

                return employees;
            }

            function querySucceeded(data) {
                //employees = data.results;
                _areEmployeesLoaded(true);
                log('Retrived [Employee Partials] from remote data source', data.results.length);
                //return employees;
                return getByPage();
            }
        }

        function getEmployeeCount() {
            if (_areEmployeesLoaded()) {
                return $q.when(_getLocalEntityCount('Employees'));
            }

            return EntityQuery.from('Employees')
            .using(manager)
            .execute()
            .to$q(_getInlineCount);
        }

        function _getInlineCount(data) {
            // return data.inlineCount;
            return data.results.length;
        }

        function _getLocalEntityCount(resource) {
            var entities = EntityQuery.from(resource)
            .using(manager)
            .executeLocally();

            return entities.length;
        }

        function getFilteredCount(nameFilter) {
            var predicate = null;
            if (nameFilter) {
                predicate = _fullNamePredicate(nameFilter);
            }


            var employees = EntityQuery.from('Employees')
                .where(predicate)
                .using(manager)
                .executeLocally();

            return employees.length;
        }

        function _fullNamePredicate(filterValue) {
            return breeze.Predicate
            .create('firstName', 'contains', filterValue)
            .or('lastName', 'contains', filterValue);
        }

        function prime() {
            if (primePromise) return primePromise;

            //primePromise = $q.all([getEmployeesPartials(true)])
            primePromise = $q.all([])
            //.then(extendMetadata)
            .then(success);
            return primePromise;
        }

        function success() {
            setLookups();
            log('Prime the data');
        }

        function setLookups() {
            service.lookupCacheData = {
                //   rooms: _getAllLocal(entityNames.room,'name')
            };
        }

        function _getAllLocal(resource, ordering) {
            return EntityQuery.from(resource)
            .orderBy(ordering)
            .using(manager)
            .executeLocally();
        }

        function getLookups() {

        }

        function _queryFailed(error) {
            var msg = config.appErrorPrefix + 'Error retreiving data.' + error.message;
            logError(msg, error);
            throw error;
        }

        function _areEmployeesLoaded(value) {
            return _areItemsLoaded('Employees', value);
        }

        function _areItemsLoaded(Key, value) {
            if (value === undefined) {
                return storeMeta.isLoaded[Key]; //get
            }
            return storeMeta.isLoaded[Key] = value; //set
        }
    }
})();