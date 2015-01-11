(function () {
    'use strict';

    var serviceId = 'model';
    angular.module('app').factory(serviceId, ['model.validation', model]);

    var entityNames = {
        employee: 'Employee',
        order: 'Order',
        orderDetail: 'Order_Detail',
        product: 'Product'
    }

    function model(modelValidation) {
        var service = {
            configureMetadataStore: configureMetadataStore,
            entityNames: entityNames,
            createNullos: createNullos,
            extendMetadata: extendMetadata,
        };
        return service;

        function configureMetadataStore(metadataStore) {
            registerEmployee(metadataStore);
            registerOrder(metadataStore);
            registerOrderDetail(metadataStore);

            modelValidation.createAndRegister(entityNames)
        }

        function createNullos(manager) {
            var unchanged = breeze.EntityState.unchanged;
            var Detached = breeze.EntityState.Detached;

            createNullo('Employee', { firstName: '', lastName: '[Select a person]' });

            function createNullo(entityName, values) {
                var initialValues = values ||
                    { name: '[Select a ' + entityName + ']' };
                return manager.createEntity(entityName, initialValues, unchanged);
            }
        }

        function extendMetadata(metadataStore) {
            modelValidation.applyValidators(metadataStore);
        }

        function registerEmployee(metadataStore) {
            metadataStore.registerEntityTypeCtor('Employee', Employee);

            function Employee() {
                this.isPartial = false;
            }

            Object.defineProperty(Employee.prototype, 'fullName', {
                get: function () {
                    var fn = this.firstName;
                    var ln = this.lastName;
                    return ln ? fn + ' ' + ln : fn;
                }
            })

            // id For the zStorage and zStorageWip
            Object.defineProperty(Employee.prototype, 'id', {
                get: function () {
                    return this.employeeID;
                }
            })

            Object.defineProperty(Employee.prototype, 'manager', {
                get: function () {
                    return this.employee1 ? this.employee1.firstName : '';
                }
            })

            //// id For the zStorage and zStorageWip
            //Object.defineProperty(Order.prototype, 'id', {
            //    get: function () {
            //        return this.orderID;
            //    }
            //})

            //Object.defineProperty(Order.prototype, 'total', {
            //    get: function () {
            //        return this.;
            //    }
            //})
        }

        function registerOrder(metadataStore) {
            metadataStore.registerEntityTypeCtor('Order', Order);

            function Order() {
                this.isPartial = false;
                this.total = 0.0;
            }

            // id For the zStorage and zStorageWip
            Object.defineProperty(Order.prototype, 'id', {
                get: function () {
                    return this.orderID;
                }
            })

            Object.defineProperty(Order.prototype, 'companyName', {
                get: function () {

                    return this.customer ? this.customer.companyName : '';
                }
            })

            Object.defineProperty(Order.prototype, 'employeeName', {
                get: function () {
                    var fn = this.employee ? this.employee.firstName : '';
                    var ln = this.employee ? this.employee.lastName : '';
                    return ln ? fn + ' ' + ln : fn;
                }
            })

            //Object.defineProperty(Order.prototype, 'total', {
            //    get: function () {
            //        var t = 0.0;
            //        if (this.order_Details)
            //            this.order_Details.foreach(function (od) {
            //                t += ((od.unitPrice * od.quantity) - ((od.unitPrice * od.quantity) * od.discount / 100));
            //            });
            //        return t;
            //    }
            //})
        }
    }

    function registerOrderDetail(metadataStore) {
        metadataStore.registerEntityTypeCtor('Order_Detail', OrderDetail);

        function OrderDetail() {
            this.isPartial = false;
        }

        // id For the zStorage and zStorageWip
        Object.defineProperty(OrderDetail.prototype, 'id', {
            get: function () {
                return this.orderID + '-' + this.productID;
            }
        })

        Object.defineProperty(OrderDetail.prototype, 'productName', {
            get: function () {

                return this.product ? this.product.productName : '';
            }
        })


        Object.defineProperty(OrderDetail.prototype, 'productUnitPrice', {
            get: function () {

                return this.product ? this.product.unitPrice : 0.0;
            }
        })


        Object.defineProperty(OrderDetail.prototype, 'lineTotal', {
            get: function () {
                return (this.unitPrice * this.quantity) - ((this.unitPrice * this.quantity) * this.discount / 100);
            }
        })
    }

})();