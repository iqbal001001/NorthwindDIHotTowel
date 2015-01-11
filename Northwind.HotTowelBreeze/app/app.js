(function () {
    'use strict';
    
    var app = angular.module('app', [
        // Angular modules 
        'ngAnimate',        // animations
        'ngRoute',          // routing
        'ngSanitize',       // sanitizes html bindings (ex: sidebar.js)

        // Custom modules 
        'common',           // common functions, logger, spinner
        'common.bootstrap', // bootstrap dialog wrapper functions

        // 3rd Party Modules
        'ui.bootstrap'  ,    // ui-bootstrap (ex: carousel, pagination, dialog)
         'breeze.angular',
         'breeze.directives',
         'ngzWip' // angular breeze local storage  and work in progress features

    ]);
    
    // Handle routing errors and success events
    //app.run(['$route','$rootScope','$q',
    //    function ($route,$rootScope,$q) {
    //    // Include $route to kick start the router.
    //       // breeze.core.extendQ($rootScope, $q);
    //        breeze.core.extendQ($rootScope, $q);
    //    }]);        

    app.run(['breeze', 'datacontext', 'routemediator',
        function (breeze, datacontext, routemediator) {
            datacontext.prime();
            routemediator.setRoutingHandlers();
    }]);
})();