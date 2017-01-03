(function () {
    'use strict';

    var app = angular.module('addressbook');
    //User Details
    var addressObject;
    var addressTotalObject;
    var addrConfig = {
        addressObject: addressObject,
        addressTotalObject: addressTotalObject
    }
    app.value('addrConfig', addrConfig);

})();
