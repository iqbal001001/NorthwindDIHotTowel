(function () {
    'use strict';
    var controllerId = 'wip';
    angular.module('app').
        controller(controllerId,
        ['$location', '$scope',
            'bootstrap.dialog', 'common', 'config', 'datacontext', wip]);

    function wip($location, $scope,
        bsDialog, common, config, dataContext) {
        var vm = this;
        var cancellingWip = false;

        vm.title = 'Work In Progress';
        vm.cancelAllWip = cancelAllWip;
        vm.cancelWip = cancelWip;
        vm.predicate = '';
        vm.reverse = false;
        vm.setSort = setSort;
        vm.gotoWip = gotoWip;
        vm.wip = [];



        activate();


        function activate() {
            common.activateController([getWipSummary()], controllerId)

            $scope.$on(config.events.storage.wipChanged, function (event, data) {
                vm.wip = data;
            });
        }

        function cancelAllWip() {
            return bsDialog.deleteDialog('Work in Progress')
            .then(confirmDelete);
        }

        function confirmDelete() {
            dataContext.zStorageWip.clearAllWip();
        }

        function cancelWip(wipData) {
            cancellingWip = true;
            var key = wipData.key;
            return bsDialog.deleteDialog('Work in Progress')
            .then(confirmDeleteCancelWip);
            cancellingWip = false;
            function confirmDeleteCancelWip() {
                dataContext.zStorageWip.removeWipEntity(key);
            }
        }




        function getWipSummary() {
            vm.wip = dataContext.zStorageWip.getWipSummary();
        }

        function gotoWip(wipData) {
            if (!cancellingWip)
            $location.path('/' + wipData.routeState + '/' + wipData.key);
        }

        function setSort(prop) {
            vm.predicate = prop;
            vm.reverse = !vm.reverse;
        }
    }
})();