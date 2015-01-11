(function () {
    'use strict';

    var app = angular.module('app');

    // Configure Toastr
    toastr.options.timeOut = 4000;
    toastr.options.positionClass = 'toast-bottom-right';

    var KeyCodes = {
        backspace: 8,
        tab: 9,
        enter: 13,
        esc: 27,
        space: 32,
        pageup: 33,
        pagedown: 34,
        end: 35,
        home: 36,
        left: 37,
        up: 38,
        right: 39,
        down: 40,
        insert: 45,
        del: 46
    }

    // For use with the HotTowel-Angular-Breeze add-on that uses Breeze
    var remoteServiceName = 'Breeze/Employee';

    var imageSettings = {
        unKnownPersonImageSource: ''
    };
    var events = {
        controllerActivateSuccess: 'controller.activateSuccess',
        hasChangesChanged: 'datacontext.hasChangesChanged',
        entitiesChanged: 'datacontext.entitiesChanged',
        spinnerToggle: 'spinner.toggle',
        storage: {
            error: 'store.error',
            storeChanged: 'store.changed',
            wipChanged: 'wip.changed'
        }
    };

    var config = {
        appErrorPrefix: '[HT Error] ', //Configure the exceptionHandler decorator
        docTitle: 'Northwind : ',
        events: events,
        imageSettings: imageSettings,
        remoteServiceName: remoteServiceName,
        version: '2.1.0',
        KeyCodes: KeyCodes
    };

    app.value('config', config);
    
    app.config(['$logProvider', function ($logProvider) {
        // turn debugging off/on (no info or warn)
        if ($logProvider.debugEnabled) {
            $logProvider.debugEnabled(true);
        }
    }]);
    
    //#region Configure the common services via commonConfig
    app.config(['commonConfigProvider', function (cfg) {
        cfg.config.controllerActivateSuccessEvent = config.events.controllerActivateSuccess;
        cfg.config.spinnerToggleEvent = config.events.spinnerToggle;
    }]);
    //#endregion

    //#region Configure the Storage services via commonConfig
    app.config(['zStorageConfigProvider', function (cfg) {
        cfg.config = {
            // These are the properties we need to set storage
            enabled: false,
            key: 'CCAngularBreeze',
            events: events.storage,
            wipKey: 'CCAngularBreeze.wip',
            appErrorPrefix: config.appErrorPrefix,
            newGuid: breeze.core.getUuid,
            version: config.version
        };
    }]);
    //#endregion

    ////#region Configure the zDirectiveConfig services via commonConfig
    //app.config(['zDirectivesConfigProvider', function (cfg) {
    //    cfg.zValidateTemplate = '<span class="invalid"><i class="icon-warning-sign"></i>' +
    //            'inconceivable! %error% </span>';
    //}]);
    ////#endregion

})();