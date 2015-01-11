(function () {
    'use strict';

    var serviceId = 'uploadManager';
    angular.module('app').factory(serviceId, ['$rootScope', upload]);

    function upload($rootScope) {
        var _files = [];

        var service = {
            add: add,
            clear: clear,
            files: files,
            upload: upload,
            setProgress: setProgress
        };
        return service;

        function add(file) {
            _files.push(file);
            $rootScope.$broadcast('fileAdded', file.files[0].name);
        }
        function clear() {
            _files = [];
        }
        function files() {
            var fileNames = [];
            $.each(_files, function (index, file) {
                fileNames.push(file.files[0].name);
            });
            return fileNames;
        }
        function upload() {
            $.each(_files, function (index, file) {
                file.submit();
            });
            this.clear();
        }
        function setProgress(percentage) {
            $rootScope.$broadcast('uploadProgress', percentage);
        }

    }
})();