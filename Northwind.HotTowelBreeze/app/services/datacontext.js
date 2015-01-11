(function () {
    'use strict';

    var serviceId = 'datacontext';
    angular.module('app').factory(serviceId,
        ['$rootScope','common', 'config', 'entityManagerFactory', 'model',
            'repositories', 'zStorage', 'zStorageWip', datacontext]);

    function datacontext($rootScope, common, config, emFactory, model,
        repositories, zStorage, zStorageWip) {
        var EntityQuery = breeze.EntityQuery;
        var getLogFn = common.logger.getLogFn;
        var entityNames = model.entityNames;
        var events = config.events;
        var log = getLogFn(serviceId);
        var logError = getLogFn(serviceId, 'error');
        var logSuccess = getLogFn(serviceId, 'success');
        var manager = emFactory.newManager();
        var $q = common.$q;
        var primePromise;
        var repoNames = ['lookup', 'employee','customer','order','orderdetail','product'];

        var storeMeta = {
            isLoaded: {
                employees: false
            }
        }


        var service = {
            zStorage: zStorage,
            zStorageWip: zStorageWip,
            prime: prime,
            cancel: cancel,
            save: save,
            markDeleted: markDeleted
        };

        init();

        return service;

        function init() {
            zStorage.init(manager);
            zStorageWip.init(manager);
            repositories.init(manager);
            defineLazyLoadedRepos();
            setupEventForHasChangesChanged();
            setupEventForEntitiesChanged();

            listenForStorageEvents();
        }

        function cancel() {
            if (manager.hasChanges) {
                manager.rejectChanges();
                logSuccess('cancelled Changes', null, true);
            }

        }

        function defineLazyLoadedRepos() {
            repoNames.forEach(function (name) {
                Object.defineProperty(service, name, {
                    configurable: true,
                    get: function () {
                        var repo = repositories.getRepo(name);
                        Object.defineProperty(service, name, {
                            value: repo,
                            configurable: false,
                            enumeable: true
                        });
                        return repo;
                    }
                });
            });
        }

        function listenForStorageEvents(){
            $rootScope.$on(config.events.storage.storeChanged, function (event, data) {
                log('Update local storage', data, true);
            });
            $rootScope.$on(config.events.storage.wipChanged, function (event, data) {
                log('Update WIP', data, true);
            });
            $rootScope.$on(config.events.storage.error, function (event, data) {
                log('Error with local storage' + data.activity, data, true);
            });
        }

        function markDeleted(entity) {
            return entity.entityAspect.setDeleted();
        }

        function prime() {
            if (primePromise) return primePromise;

            var storageEnabledAndHasData = zStorage.load(manager);

            //primePromise = $q.all([getEmployeesPartials(true)])

            primePromise = storageEnabledAndHasData ?
                $q.when('Loading entities and metadata from local storage') :
                $q.all([service.employee.getAll(), service.customer.getAll(), service.product.getAll()])
            .then(extendMetadata);
           

            return primePromise.then(success);

            function success() {
                service.lookup.setLookups();
                zStorage.save();
                log('Prime the data');
            }
        }

        function extendMetadata() {
            var metadataStore = manager.metadataStore;
            model.extendMetadata(metadataStore);
        }

        function save() {
            return manager.saveChanges().
            to$q(saveSucceeded, saveFailed);

            function saveSucceeded(result) {
                zStorage.save();
                logSuccess('Saved data', result, true);
            }

            function saveFailed(error) {
                var msg = config.appErrorPrefix + 'save failed' +
                    breeze.saveErrorMessageService.getErrorMessage(error);
                error.msg = msg;
                logError(msg, error);
                throw error;
            }
        }

        function setupEventForHasChangesChanged() {
            manager.hasChangesChanged.subscribe(function (eventArgs) {
                var data = { hasChanges: eventArgs.hasChanges };
                common.$broadcast(events.hasChangesChanged, data);
            });
        }

        function interceptPropertyChange(changeArgs) {
            var changeProp = changeArgs.args.propertyName;
            if (changeProp === 'isPartial') {
                delete changeArgs.entity.entityAspect.originalValues[changeProp];
            }
        }

        function setupEventForEntitiesChanged() {
            manager.entityChanged.subscribe(function (changeArgs) {
                if (changeArgs.entityAction === breeze.EntityAction.PropertyChange) {
                    interceptPropertyChange(changeArgs);
                    common.$broadcast(events.entitiesChanged, changeArgs);
                }
            });
        }

    }
})();