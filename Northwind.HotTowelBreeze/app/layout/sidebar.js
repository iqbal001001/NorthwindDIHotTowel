﻿(function () { 
    'use strict';
    
    var controllerId = 'sidebar';
    angular.module('app').controller(controllerId,
        ['$location', '$route', 'bootstrap.dialog', 'config',
            'datacontext','routes', sidebar]);

    function sidebar($location, $route,bsDialog, config, datacontext, routes) {
        var vm = this;
        var KeyCodes = config.KeyCodes;

        vm.clearStorage = clearStorage;
        vm.isCurrent = isCurrent;
        vm.routes = routes;
        vm.searchText = '';
        vm.search = search;
        vm.wip = [];
        vm.wipChangedEvent = config.events.storage.wipChanged;

        activate();

        function activate() {
            getNavRoutes();
            vm.wip = datacontext.zStorageWip.getWipSummary();
        }

        function clearStorage() {
            return bsDialog.deleteDialog('local storage')
            .then(confirmDelete,cancelDelete);

            function confirmDelete() { datacontext.zStorage.clear();}
            function cancelDelete() {}
        }
        
        function getNavRoutes() {
            vm.navRoutes = routes.filter(function(r) {
                return r.config.settings && r.config.settings.nav;
            }).sort(function(r1, r2) {
                return r1.config.settings.nav - r2.config.settings.nav;
            });
        }
        
        function isCurrent(route) {
            if (!route.config.title || !$route.current || !$route.current.title) {
                return '';
            }
            var menuName = route.config.title;
            return $route.current.title.substr(0, menuName.length) === menuName ? 'current' : '';
        }

        function search($event) {
            if ($event.keyCode === KeyCodes.esc) {
                vm.searchText = '';
                return;
            }

            if ($event.type === 'click' || $event.KeyCodes === KeyCodes.enter) {
                var route = '/employees/search/'
                $location.path(route + vm.searchText);
            }
        }
    };
})();
