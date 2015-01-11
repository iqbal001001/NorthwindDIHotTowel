(function () {
    'use strict';
    
    var serviceId = 'helper';
    angular.module('app').factory(serviceId,['$location', 'common', helper]);

    function helper($location,common){
        var service = {
            replaceLocationUrlGuidWithId : replaceLocationUrlGuidWithId 
        };
    
        
        return service;

        function replaceLocationUrlGuidWithId(id) {
            var currentPath = $location.path(); 
            var slashPos = currentPath.lastIndexOf('/',currentPath.length -2);
            var currentParameter = currentPath.substring(slashPos - 1);
            if(common.isNumber(currentParameter)) {return;}

            var newPath = currentPath.substring(0,slashPos + 1) + id;
        }
    }
})();
