(function () {
    'use strict';

    var serviceId = 'repository.lookup';
    angular.module('app').factory(serviceId,
        ['model', 'repository.abstract' , RepositoryLookup]);

    function RepositoryLookup(model, AbstractRepository) {
        var entityName = 'lookups';
        var entityNames = model.entityNames;
        var entityQuery = breeze.EntityQuery;

        function Ctor(mgr) {
            this.serviceId = serviceId;
            this.entityName = entityName;
            this.manager = mgr;
            //Exposed data access functions
            this.getAll = getAll;
            this.setLookups = setLookups;
        }

        AbstractRepository.extend(Ctor);

        return Ctor;

        function getAll() {
            var self = this;
            return EntityQuery.from('')
            .using(self.manager).execute()
            .to$q(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                model.createNullos(self.manager);
                self.zStorage.save();
                self.log('', data, true);
                return true;
            }
        }

        function setLookups() {
            this.lookupCacheData = {
                //employees: this._getAllLocal(entityNames.employees,'employeeID');
                  // rooms: this._getAllLocal(entityNames.room,'name')
            };
        }

    }

})()