(function () {
	'use strict';

	var serviceId = 'repository.abstract';
	angular.module('app').factory(serviceId, ['common', 'config', AbstractRepository]);

	function AbstractRepository(common,config) {
		var EntityQuery = breeze.EntityQuery;
		var logError = common.logger.getLogFn(this.serviceId,'error');
		var _predicates = {
		    isNotNullo: breeze.Predicate.create('id', '!=', 0),
		    isNullo: breeze.Predicate.create('id', '==', 0)
		};

		function Ctor(){
			this.isLoaded = false;
		}

		Ctor.extend = function(repoCtor) {
			repoCtor.prototype = new Ctor();
			repoCtor.prototype.constructor = repoCtor;
		};

		//Ctor.prototype._areItemsLoaded = _areItemsLoaded;
		Ctor.prototype._getAllLocal = _getAllLocal;
		Ctor.prototype._getById = _getById;
		Ctor.prototype.getEntityByIdOrFromWip = getEntityByIdOrFromWip;
		Ctor.prototype._getInlineCount = _getInlineCount;
		Ctor.prototype._getLocalEntityCount = _getLocalEntityCount;
		Ctor.prototype._queryFailed = _queryFailed;
		Ctor.prototype._setIsPartialTrue = _setIsPartialTrue;
		// Convenience functions for the Repos
		Ctor.prototype.log = common.logger.getLogFn(this.serviceId);
		Ctor.prototype.$q = common.$q;
		Ctor.prototype._predicates = _predicates;
		
		return Ctor;


		//function _areItemsLoaded(Key, value) {
		//	if (value === undefined) {
		//		return storeMeta.isLoaded[Key]; //get
		//	}
		//	return storeMeta.isLoaded[Key] = value; //set
		//}

		//function _areItemsLoaded(value) {
		//	if (value === undefined) {
		//		return this.isLoaded; //get
		//	}
		//	return this.isLoaded = value; //set
	    //}

		function getEntityByIdOrFromWip(val) {
		    var wipEntityKey = val;
		    if (common.isNumber(val)) {
		        val = parseInt(val);
		        wipEntityKey = this.zStorageWip.findWipKeyByEntityId(this.entityName, val);
		        if (!wipEntityKey) {
		            return this._getById(this.entityName, val);
		        }
		    }

		    var importedEntity = this.zStorageWip.loadWipEntity(wipEntityKey);
		    if (importedEntity) {
		        importedEntity.entityAspect.validateEntity();
		        return $.when({ entity: importedEntity, Key: wipEntityKey });
		    }

		    return self.$q.reject({ error: 'Couldn\'t find the entity for Wip Key ' + wipEntityKey });
		}

		function _getAllLocal(resource, ordering,predicate) {
			return EntityQuery.from(resource)
            .orderBy(ordering)
			.where(predicate)
            .using(this.manager)
            .executeLocally();
		}

		function _getById(entityName, id, forceRemote) {
			var self = this;
			var manager = self.manager;
			// check cache first
			if (!forceRemote) {
				var entity = manager.getEntityByKey(entityName, id);
				if (entity && !entity.isPartial) {
					self.log('Retrived [' + entityName + '] id' + entity.id + ' from cache.', entity, true)
					if (entity.entityAspect.entityState.isDeleted()) {
						entity = null;
					}
					return self.$q.when(entity);
				}
			}

			// Hit the server
			return manager.fetchEntityByKey(entityName, id)
			.to$q(querySucceeded, self._queryFailed);

			function querySucceeded(data) {
				entity = data.entity;
				if (!entity) {
					self.log('Could not find [' + entityName + '] id: ' + id, null,true);
					return null;
				}
				entity.isPartial = false;
				self.log('Retrived [' + entityName + '] id ' + entity.id
					+ ' from remote data source', entity, true);
				self.zStorage.save();
				return entity;
			}

		}

		function _getInlineCount(data) {
			// return data.inlineCount;
			return data.results.length;
		}

		function _getLocalEntityCount(resource) {
			var entities = EntityQuery.from(resource)
            .using(this.manager)
            .executeLocally();

			return entities.length;
		}

		function _queryFailed(error) {
			var msg = config.appErrorPrefix + 'Error retreiving data.' + error.message;
			logError(msg, error);
			throw error;
		}

		function _setIsPartialTrue(entities) {
			for (var i = entities.length; i--;) {
				entities[i].isPartial = true;
			}
			return entities;
		}
		

	}

})();