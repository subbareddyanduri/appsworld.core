angular.module("appsworld")
.directive("zBookmark", function () {
    return {
        restrict: "EA",
        scope: {
            entityname: '='
        },

        //template: '<a href tooltip-placement="top" uib-tooltip="{{tooltip}}" class="btn btn-primary" ng-click="bookmark()"><i class="{{pinimge}}"></i>{{tooltip}} </a>',
        template: '<a href tooltip-placement="top" uib-tooltip="{{tooltip}}" class="clr" ng-click="bookmark()"><i class="{{pinimge}}"></i></a>',
        controller: 'bookmarkctrl',
        controllerAs: 'vm'

    }
})
.controller('bookmarkctrl', function ($scope,$state, $window, $rootScope, $http, $moment, config,serviceConfig,$cookies) {
   var vm = this;
    $scope.pinimge = "fa fa-thumb-tack";
    $scope.tooltip = "Bookmark this link";
   getbyid();
   var _moduleInfo = $cookies.get('moduleInfo');
   var _currentModule;
   if (_moduleInfo)
       _currentModule = JSON.parse(_moduleInfo).name;
    function getbyid() {
        if (config.companyId!='null'&&config.companyId!=undefined&&config.companyId) {
            $http.get(serviceConfig.clientCursorNewRemoteServer + "GetPinImageStatus?userName=" + config.userName + '&companyId=' + config.companyId + '&Text=' + $scope.entityname + '&ModuleName=' + _currentModule).success(function (response) {
                if (response == false) {
                    $scope.pinimge = "fa fa-thumb-tack";
                    $scope.tooltip = "Bookmark this link";
                }
                else {
                    $scope.pinimge = "fa fa-thumb-tack fa-rotate-45";
                    $scope.tooltip = "Unbookmark this link";
                }
                return response;
            });
        }
       
    }
    
    $scope.$on('$stateChangeSuccess', function (currentState,toUrl) {     
        $scope.entityname = toUrl.data.pageTitle;
        getbyid();
    });
    $scope.pin = $scope.entitypin;
    $scope.bookmark = function () {
        var pinStatus;
        if ($scope.pinimge == "fa fa-thumb-tack") {
            $scope.pinimge = "fa fa-thumb-tack fa-rotate-45";
            $scope.tooltip = "Unbookmark this link";
            pinStatus = 1;
        }
        else {
            $scope.pinimge = "fa fa-thumb-tack";
            $scope.tooltip = "Bookmark this link";
            pinStatus = 2;
        }
        var url = $state.current.name;
        if (url === 'admin.mastersetup.mastergrid' || url === 'admin.mastersetup.accounttypeterms') {
            var _urlObj = location.href.split('/');
            url = url === 'admin.mastersetup.mastergrid' ? url + "({form:'" + _urlObj[_urlObj.length - 1] + "'})" : url + "({source:'" + _urlObj[_urlObj.length - 1] + "'})";
        }
      
        //var url = $state.current.name + "({form:"+$stateParams.form+"})";
       
        //var localUrl;
               
        $scope.bookmark123 = {
            Id: config.primaryId, CompanyId: config.companyId, UserName: config.userName, UrlContext: url, Status: pinStatus, Text: $scope.entityname, ModuleName: app_configuration.app_config.current_module
        }
        //$scope.bookmark.Status = $scope.bookStatus == true ? 2 : 1;


        var URL = serviceConfig.clientCursorNewRemoteServer + "SavePinDTO";

        $http.post(URL, $scope.bookmark123).success(function (response) {
            $rootScope.$broadcast('refreshBookMarks');

            // $scope.bookmark = response;
            //$scope.bookmark();

        }).error(function (err, status) {
            vm.isSaving = false;
        });
    
    }
})