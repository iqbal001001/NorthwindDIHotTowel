(function () {
	'use strict';

	var serviceId = 'model.validation';
	angular.module('app').factory(serviceId, ['common', modelvalidation]);


	function modelvalidation(common) {
		var entityNames;
		var log = common.logger.getLogFn(serviceId);
		var Validator = breeze.Validator;
		var requireReferenceValidator;
		var extensionLengthValidator;
		var service = {
			applyValidators: applyValidators,
			createAndRegister: createAndRegister
		}

		return service;

		function createAndRegister(eNames) {
			entityNames = eNames;
			requireReferenceValidator = createRequireReferenceValidator();
			extensionLengthValidator = createExtensionLengthValidator();

			Validator.register(requireReferenceValidator);
			Validator.register(extensionLengthValidator);

			log('Validators created and registered', null, serviceId, false);
		}

		function applyValidators(metadataStore) {
			//applyRequireReferenceValidators(metadataStore);
			//applyEmailValidators(metadataStore);
			//applyUrlValidators(metadataStore);
			applyLengthValidators(metadataStore);
			log('Validators applied', null, serviceId);
		}

		function applyEmailValidators(metadataStore) {
			var entityType = metadataStore.getEntityType(entityNames.employee);
			entityType.getProperty('email').validators
				.push(Validator.emailAddress());
		}



		function createRequireReferenceValidator() {
			var name = 'requireReferenceEntity';
			var ctx = {
				messageTemplate: 'Missing %diaplayName%',
				isRequired: true
			};
			var val = new Validator(name, valFunction, ctx);
			return val;

			function valFunction(value) {
				return value ? value.id !== 0 : false;
			}
		}

		function createExtensionLengthValidator(context) {
			var name = 'extensionLengthEntity';
			var ctx = {
				length: context ? context.length : 5,
				messageTemplate: "%diaplayName% value %value% must be less than %length%"
			};
			var val = new Validator(name, isValidLength, ctx);
			return val;

			function isValidLength(value,context) {
				return value.length < context.length;
			}
		}

		//function createExtensionLengthValidator() {
		//	var name = 'extensionLengthEntity';
		//	var ctx = {
		//		//length: 4,//context ? context.length : 4,
		//		//messageTemplate: "%displayname% value %value% must be less than %length%",
		//		messageTemplate: "%displayName% value  must be less than 4",
		//		isRequired: true
		//	};
		//	var val = Validator(name, isValidLength, ctx);
		//	return val;


		//	function isValidLength(value) {
		//		return false;//value.length < 4;
		//	}
		//	//function isValidLength(value, context) {
		//	//	return value.length < context.length;
		//	//}
		//}

		function applyRequireReferenceValidators(metadataStore) {
			var navigations = ['title'];
			var entityType = metadataStore.getEntityType(entityNames.employee);

			navigations.forEach(function (propertyName) {
				entityType.getProperty(propertyName).validators
				.push(requireReferenceValidator);
			});
		}

		function applyLengthValidators(metadataStore) {
			var navigations = ['extension'];
			var entityType = metadataStore.getEntityType(entityNames.employee);

			navigations.forEach(function (propertyName) {
				entityType.getProperty(propertyName).validators
				.push(extensionLengthValidator);
			});
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