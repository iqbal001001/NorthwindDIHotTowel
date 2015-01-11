var Employee = function () {
    this.isChange = false;
}

Object.defineProperty(Employee.prototype, 'FullName', {
    get: function () {
        var ln = this.LastName ? this.LastName : '';
        var fn = this.FirstName ? this.FirstName : '';

        return ln ? fn + ' ' + ln : fn;
    }
});

Object.defineProperty(Employee.prototype, 'Manager', {
    get: function () {
        if (this.Employee1) {
            var ln = this.Employee1.LastName ? this.Employee1.LastName : '';
            var fn = this.Employee1.FirstName ? this.Employee1.FirstName : '';

            return ln ? fn + ' ' + ln : fn;
        }
        return '';
    }
});


Object.defineProperty(Employee.prototype, 'isChanged', {
    get: function () {
        return !this.entityAspect.entityState.isUnchanged();
        //return !this.entityAspect.entityState.isModified();
    }//,
  //  set: function (value) {
    //        this.isChange= value;
    //}

});

Object.defineProperty(Employee.prototype, 'isNew', {
    get: function () {
        return this.entityAspect.entityState.isAdded();
        //return !this.entityAspect.entityState.isModified();
    }//,
    //  set: function (value) {
    //        this.isChange= value;
    //}

});
