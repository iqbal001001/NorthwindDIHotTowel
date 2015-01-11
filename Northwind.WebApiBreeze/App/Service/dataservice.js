(function () {

    angular.module('angularapp').factory('dataservice',
    ['breeze', 'logger', dataservice]);

    function dataservice(breeze, logger) {

        var serviceName = 'Breeze/Employee'; // route to the Web Api controller

        var manager = new breeze.EntityManager(serviceName);
        var entityChangeToken = null;
        //manager.enableSaveQueuing(true);

        var service = {
            addPropertyChangeHandler: addPropertyChangeHandler,
            getEmployee: getEmployee,
            saveChangesToServer: saveChangesToServer,
            saveChanges: saveChanges,
            newEmployee: newEmployee,
            restoreChanges: restoreChanges,
            initValidation: initValidation
        };
        return service;

        /*** implementation details ***/
        function addPropertyChangeHandler(handler) {
            if (entityChangeToken) return;

            // call handler when an entity property of any entity changes
            entityChangeToken = manager.entityChanged.subscribe(function (changeArgs) {
                var action = changeArgs.entityAction;
                if (action === breeze.EntityAction.EntityStateChange) {
                    var exportData = manager.exportEntities(manager.getChanges());
                    window.localStorage.setItem('stuff', exportData);
                }

                if (action === breeze.EntityAction.EntityStateChange ||
                    //action === breeze.EntityAction.PropertyChange ||
                    action === breeze.EntityAction.MergeOnSave) {
                    var employee = changeArgs.entity;
                    if (employee) {// && employee.isChanged) {
                        var isUnChanged = employee.entityAspect.entityState.isUnchanged();
                        // handler(!isUnChanged);
                        employee.isChanged = !isUnChanged;
                    }
                }
            });
        }

        function restoreChanges() {
            var importData = window.localStorage.getItem('stuff');
            if (importData) {
                manager.importEntities(importData);//, { mergeStrategy: breeze.MergeStrategy.OverwriteChanges }
                return true;
            }
            return false;
        }

        function getEmployee() {
            addEntityExtension();
            entityChangeToken = null;

           // manager.fetchMetadata()
             //   .then(function () { initValidation(); restoreChanges() })

           //if (restoreChanges()) { }
            var query = breeze.EntityQuery
                .from("Employees").expand("Employee1");
            //.select("FirstName,LastName,Employee1.LastName")
            //.orderBy("CreatedAt")

            var promise = manager.executeQuery(query).catch(queryFailed);
            return promise;

            function queryFailed(error) {
                //logger.error(error.message, "Query failed");
                throw error; // so downstream promise users know it failed
            }
        }

        function addEntityExtension() {
            var store = manager.metadataStore;
            store.registerEntityTypeCtor('Employee', Employee);
        }

        function newEmployee() {
            var emp = manager.createEntity("Employee", { FirstName: "first name", LastName: "last name" });//, { EmployeeID: breeze.core.getUuid() }
            return emp;
        }

        function saveChangesToServer() {
            return manager.saveChanges()
            .then(saveSucceeded)
            .catch(saveFailed)
            ;

            function saveSucceeded(saveResult) {
                var l = saveResult.entities.length;
                window.localStorage.clear();
                logger.log(saveResult);
            }

            function saveFailed(error) {
                if (error.entityErrors) {
                    showValidationErrors(error.entityErrors);
                }
                else {
                    logger.error(error.message, "Error saving data");
                }
            }

            saveError = function (error) {
                if (error.entityErrors) {
                    showValidationErrors(error.entityErrors);
                }
                else {
                    logger.error(error.message, "Error saving data");
                }
            }

            function showValidationErrors(errors) {
                var errorMessage = "";
                errors.map(function (e) {
                    if (errorMessage.length > 0) errorMessage += " , ";
                    errorMessage += e.errorMessage;
                });
                logger.error(errorMessage, "Validation Errors");

            }
        }

        function saveChanges() {
            return manager.saveChanges()
            //.then(saveSucceeded)
            //.catch(saveFailed)
            ;

            function saveSucceeded(saveResult) {
                logger.success("# of Todos saved = " + saveResult.entities.length);
                logger.log(saveResult);
            }

            function saveFailed(error) {
                var reason = error.message;
                var detail = error.detail;

                if (error.entityErrors) {
                    reason = handleSaveValidationError(error);
                } else if (detail && detail.ExceptionType &&
                    detail.ExceptionType.indexOf('OptimisticConcurrencyException') !== -1) {
                    // Concurrency error 
                    reason =
                        "Another user, perhaps the server, " +
                        "may have deleted one or all of the todos." +
                        " You may have to restart the app.";
                } else {
                    reason = "Failed to save changes: " + reason +
                        " You may have to restart the app.";
                }

                logger.error(error, reason);
                // DEMO ONLY: discard all pending changes
                // Let them see the error for a second before rejecting changes
                $timeout(function () {
                    manager.rejectChanges();
                }, 1000);
                throw error; // so downstream promise users know it failed
            }

        }

        function initValidation() {
            manager.fetchMetadata()
             .then(function () {
                 var store = manager.metadataStore;
                 var userType = store.getEntityType("Employee");
                 userType.getProperty("HomePhone").validators.push(breeze.Validator.phone());

                 var extensionLengthValidator = new breeze.Validator(
                     "extentionLenghtValidator",
                     isValidExtension,
                     { messageTemplate: '%displayNames% %value% must be less than 4 digit - client' }
                     )
                 //userType.getProperty("Extension").validators.push(extensionLengthValidator);
                 userType.getProperty("Extension").validators.push(lengthValidatorFactory({ length: 5 }));

                 //breeze.Validator.register(extensionLengthValidator);
                 breeze.Validator.registerFactory(lengthValidatorFactory, "lengthValidator");
                 restoreChanges();
             });
        }

        function isValidExtension(value, context) {
            return value.length < 5;
        }

        function isValidLength(value, context) {
            return value.length < context.length;
        }

        function lengthValidatorFactory(context) {
            return new breeze.Validator(
                "lengthValidator",
                isValidLength,
                {
                    length: context.length,
                    messageTemplate: "%displayname% value %value% must be less than %length% - client factory"
                }
                )
        }
    }

})();