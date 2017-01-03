(function () {
    'use strict';

    var app = angular.module('appsworld');
 
    //User Details
    var userName;
    var userRole;
    var companyId;
    var primaryId = -1;
    var companyName;
    var selectedCursor;
    var likeDislike;
    var dateFormat;
    var timeFormat;
    var currency;
    var moduleActionsObj;
    var userImage;
    var userFullName;
    // var defaultEmail;
  
    var config = {
        userName: userName,
        userRole: userRole,
        companyId: companyId,
        primaryId: primaryId,
        companyName: companyName,
        likeDislike: likeDislike,
        selectedCursor: selectedCursor,
        dateFormat: dateFormat,
        timeFormat: timeFormat,
        currency: currency,
        moduleActionsObj: moduleActionsObj,//used in hr cursor Leave Report screen
        userImage: userImage,
        userFullName: userFullName
       
       
    }
    
    app.value('config', config);
    app.run(['$rootScope', '$state', function ($rootScope, $state) {
        $rootScope.$on('$stateChangeSuccess', function (data, toUrl, fromUrl) {
            $rootScope.prevUrlParam = $state.params;
            $rootScope.prevUrl = $state.current.name;
        })
    }])

})();

