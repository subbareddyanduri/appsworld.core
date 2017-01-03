/// <reference path="../app_configuration.js" />
/// <reference path="module_linkingConfig.js" />
(function () {
    'use strict';
    angular.module('appsworld')
    .controller('headerController', headerController)
    .factory('headerContext', headerContext)
    .controller('historyController', historyController)
    .controller('historyControllerInstance', historyControllerInstance)
    .directive('bookmarkList', function (headerContext) {
        return {
            restrict: "A",
            replace: true,
            template: '<ul uib-dropdown-menu class="hdropdown animated flipInX"><li ng-repeat="link in data" ng-if="data"><a ui-sref="{{link.Url}}">{{link.Text}}</a></li><li ng-if="!data"><a>No Book Marks Found</a></li></ul>',
            link: function (scope, ele, attr) {
                var superUserLinks = [
                { Name: 'Companies', Url: 'admin.companies', Text: 'Companies' },
                { Name: 'TaxCodes', Url: 'admin.taxcodes', Text: 'Tax Codes' },
                { Name: 'CurrencyCodes', Url: 'admin.currencycodes', Text: 'Currency Codes' }
                ];
                scope.data = null;
                if (config.role === 'Super User') {
                    scope.data = superUserLinks;
                } else {
                    headerContext.loadBookMarks().then(function (res) {
                        scope.data = res.data.length === 0 ? null : res.data;
                    });
                }
                scope.$on('refreshBookMarks', function () {
                    headerContext.loadBookMarks().then(function (res) {
                        scope.data = res.data.length === 0 ? null : res.data;
                    });
                });
            }
        }
    });
    headerController.$inject = ['config', 'headerContext', '$rootScope', '$cookies', 'serviceConfig', '$scope', '$http', '$cookieStore', '$state', 'commonService', 'authService'];
    headerContext.$inject = ['config', 'serviceConfig', 'commonService', '$cookies'];
    historyController.$inject = ['$scope', '$uibModal'];
    historyControllerInstance.$inject = ['config', 'commonService', 'options', '$uibModalInstance', 'serviceConfig', '$scope', '$moment'];
    function headerController(config, headerContext, $rootScope, $cookies, serviceConfig, $scope, $http, $cookieStore, $state, commonService, authService) {
        var vm = this;
        vm.companyName = config.companyName;
        vm.logout = logout;
        vm.changeModule = changeModule;
        vm.checkRole = checkRole;
        vm.userName = config.userFullName;
        vm.userEmail = config.userName;
        vm.userImage = config.userImage || 'images/profile.jpg';
        vm.chooseCompany = chooseCompany;
        vm.activeAnalytics = false;
        vm.isMultiCompany = authService.auth_company.isMultiCompany;
        vm.moduleList = [];
        var _domain = window.location.host.split(':')[0];
        $scope.$state = $state;
        activateController();

        if (config.role === "Super User") {
            _loadSuperUserLinks();
        }
        vm.load_analytics = function () {
            $rootScope.$broadcast('load_analytics');
        }
        function _loadSuperUserLinks() {
            vm.superUserLinks = [
                { Name: 'Companies', url: 'admin.companies', title: 'Companies' },
                { Name: 'TaxCodes', url: 'admin.taxcodes', title: 'Tax Codes' },
                { Name: 'CurrencyCodes', url: 'admin.currencycodes', title: 'Currency Codes' }
            ]
        }

        $scope.$on('refreshBookMarks', function () {
            _bookMarkList();
        });
        $scope.$on('refresh_userImage', function (event, response) {
            $scope.$apply(function () {
                vm.userImage = response.data.Medium;
            });
            
        });
        function _bookMarkList() {
            if (config.userName && config.companyId) {
                headerContext.loadBookMarks().then(function (res) {
                    vm.bookMarkList = res.data;
                });
            }
        }

        function activateController() {
            _getModuleList();
            _bookMarkList();
        }

        function checkRole(role) {
            return config.role === role;
        }

        function _getModuleList() {
            if (config.companyId && config.companyId != 'null') {
                headerContext.getModules().then(function (response) {
                    vm.activeAnalytics = response.data.filter(function (value) {
                        return value.Name == 'Analytics' && value.Status == 'Active';
                    }).length!=0;
                    vm.moduleList = response.data.filter(function (value) {
                        return value.IsMainCursor;
                    });
                });
            }
        }

        //notifications


        getnotificatons();
        function getnotificatons() {
            vm.notifications1 = [];
            vm.notifications2 = [];
            $http.get(serviceConfig.activityRemoteServer + "task/getthreenotifications?userName=" + config.userName).then(function (data) {

                vm.notifications = data.data;
                for (var i = 0; i <= vm.notifications.length - 1; i++) {
                    vm.particiatiesmodel = vm.notifications[i].ParticipantModel;
                    vm.ReplyModel = vm.notifications[i].ReplyModel;
                    if (vm.ReplyModel != "") {
                        if (vm.notifications[i].FromUser == config.userName) {
                            vm.notifications2.push(vm.notifications[i]);
                        }
                    }
                    angular.forEach(vm.particiatiesmodel, function (index) {
                        vm.paname = index.UserName;
                        if (vm.paname === config.userName && index.Status == 'Active') {
                            vm.notifications2.push(vm.notifications[i]);
                        }
                    })
                }
                vm.notifications1 = _.uniq(vm.notifications2, 'Id');
            })
        }

        getallnotifications();
        function getallnotifications() {
            vm.allnotications = [];
            vm.eventarray = [];
            vm.eventarray1 = [];
            if (config.companyId != undefined) {
                $http.get(serviceConfig.activityRemoteServer + "task/getallnotifications?userName=" + config.userName).then(function (data) {
                    vm.allnotes = data.data;

                    for (var i = 0; i <= vm.allnotes.length - 1; i++) {
                        vm.particiatiesmodel = vm.allnotes[i].ParticipantModel;
                        vm.ReplyModel = vm.allnotes[i].ReplyModel;
                        if (vm.ReplyModel != "") {
                            if (vm.allnotes[i].FromUser == config.userName) {
                                vm.eventarray1.push(vm.allnotes[i]);
                            }
                        }
                        angular.forEach(vm.particiatiesmodel, function (index) {
                            vm.paname = index.UserName;
                            if (vm.paname === config.userName && index.Status == 'Active') {
                                vm.eventarray1.push(vm.allnotes[i]);
                            }
                        })
                    }
                    vm.eventarray = _.uniq(vm.eventarray1, 'Id');
                    if (vm.eventarray.length === 0) {
                        vm.count = "No";
                        vm.count1 = "";
                    } else {
                        vm.count = vm.eventarray.length;
                        vm.count1 = vm.eventarray.length;
                    }
                })
            }
        }

        $scope.$on('groapdownfrefresh', function (events, args) {
            getallnotifications();
            getnotificatons();

        })

        $scope.gotoSearch = function (e, text) {
            if (e.keyCode === 13) {
                $state.go('admin.search', { searchText: text });
            }
        }
        function changeModule(selectedmodule) {
            config.selectedCursor = selectedmodule;
            $cookies.put('moduleInfo', JSON.stringify({ name: config.selectedCursor.Name, id: config.selectedCursor.Id }), { path: '/', domain: _domain });
            var _name = selectedmodule.Name.replace(/ /g, '').toLowerCase();
            switch (_name) {
                case "hrcursor":
                    window.location.replace(app_configuration.app_config.module_linking.hr);
                    break;
                case "doccursor":
                    window.location.replace(app_configuration.app_config.module_linking.doc);
                    break;
                case "admincursor":
                    window.location.replace(app_configuration.app_config.module_linking.admin);
                    break;
                case "clientcursor":
                    window.location.replace(app_configuration.app_config.module_linking.client);
                    break;
                case "knowledgecursor":
                    window.location.replace(app_configuration.app_config.module_linking.knowledge);
                    break;
                case "taxcursor":
                    window.location.replace(app_configuration.app_config.module_linking.tax);
                    break;
                case "auditcursor":
                    window.location.replace(app_configuration.app_config.module_linking.audit);
                    break;
                case "workflowcursor":
                    window.location.replace(app_configuration.app_config.module_linking.workflow);
                    break;
                case "beancursor":
                    window.location.replace(app_configuration.app_config.module_linking.bean);
                    break;
                default:
                    window.location.replace(app_configuration.app_config.module_linking.core);
            }
        }

        function logout() {
            $cookies.remove('company_details', { path: '/', domain: _domain });
            $cookies.remove('moduleInfo', { path: '/', domain: _domain });
            window.localStorage.removeItem('ModuleDetailId');
            commonService.removeLocalStorageItems('PER');
            mgr.redirectForLogout();
        }
        function chooseCompany() {
            config.companyId = null;
            config.userFullName = null;
          //  config.userImage = null;
            config.selectedCursor = null;
            config.companyName = null;
            authService.auth_company.isAuthCompany = false;
            $cookies.remove('company_details', { path: '/', domain: _domain });
            $cookies.remove('moduleInfo', { path: '/', domain: _domain });
            window.localStorage.removeItem('ModuleDetailId');
            commonService.removeLocalStorageItems('PER');
            $state.go('selectcompany');
        }
        function _clearConfig() {
            config.companyId = null;
            config.userName = null;
            config.selectedCursor = null;
            config.userRole = null;
            config.companyName = null;
        }
    }
    function headerContext(config, serviceConfig, commonService, $cookies) {

        var service = {
            getModules: getModules,
            loadBookMarks: loadBookMarks
        }

        return service;
        function getModules() {
            return commonService.getEntities(serviceConfig.adminRemoteServer + 'modulemaster?companyId=' + config.companyId);
        }

        function loadBookMarks() {

            if (config.userName && config.companyId)                           
                return commonService.getEntities(serviceConfig.clientCursorNewRemoteServer + "GetPinDetails?userName=" + config.userName + '&companyId=' + config.companyId + '&ModuleName=' + app_configuration.app_config.current_module);

        }
    }
    function historyController($scope, $uibModal) {
        $scope.open = function (size, streemName, viewModel, id) {
            var modalInstance = $uibModal.open({
                templateUrl: 'historytemplate.html',
                controller: 'historyControllerInstance',
                size: size,
                resolve: {
                    items: function () {
                        return $scope.items;
                    },
                    options: function () {
                        return { streemName: streemName, viewModel: viewModel, id: id };
                    }
                }
            });

            modalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
            }, function () {

            });
        }
    }
    function historyControllerInstance(config, commonService, options, $uibModelInstance, serviceConfig, $scope, $moment) {
        $scope.streemName = options.streemName;
        $scope.isLoading = true;
        $scope.historyModel = [];
        $scope.history_td_value = function (hkey, hvalue) {
            if (hkey === 'Communication') {
                if (hvalue) {
                    var _commstr = '';
                    angular.forEach(JSON.parse(hvalue), function (index) {
                        _commstr = _commstr + index.key + ':' + index.value + ' ';
                    });
                }
                return _commstr;
            }
            else if (hkey.toLowerCase().includes('date')) {
                return $moment(new Date(hvalue)).format('DD/MM/YYYY');
            }
            return hvalue;
        }
        var url = serviceConfig.commonRemoteServer + 'GetAllHistory?companyId=' + config.companyId + '&streamname=' + options.streemName + '&id=' + options.id + '&viewModel=' + options.viewModel;
        commonService.getEntities(url).then(function (res) {
            var model = res.data ? res.data : [];
            $scope.isLoading = false;
            var _re = [];
            if (model && model.length != 0) {
                var _singleModel = model[0][options.viewModel];
                for (var key in _singleModel) {
                    if (key !== 'Id' && typeof (_singleModel[key]) !== 'object') {
                        _re.push(key);
                    }
                }
            }
            $scope.theads = _re
            $scope.historyModel = model;
            $scope.modelName = options.viewModel;
        });
        $scope.ok = function () {
            $uibModelInstance.close('ok');
        }
    }
})();
(function () {
    'use strict';
    angular.module("appsworld").
   controller('resetpasswordController', function ($scope, $uibModal, $log) {
       $scope.open = function (size) {

           var modalInstance = $uibModal.open({
               templateUrl: 'resetpasswordcontent.html',
               controller: 'resetpasswordControllerInstance',
               size: size,
               resolve: {
                   items: function () {
                       return $scope.items;
                   }
               }
           });

           modalInstance.result.then(function (selectedItem) {
               $scope.selected = selectedItem;
           }, function () {
               $log.info('Modal dismissed at: ' + new Date());
           });
       };
   })
   .controller('resetpasswordControllerInstance',
         ['$scope', '$http', '$q', '$location', '$uibModalInstance', '$window', 'config', 'serviceConfig', 'formValidate', 'commonService', changepass]);
    function changepass($scope, $http, $q, $location, $uibModalInstance, $window, config, serviceConfig, formValidate, commonService) {
        //var logError = common.logger.getLogFn('login', 'error');
        //var logSuccess = common.logger.getLogFn('login', 'sucess');
        //  var manager = datacontact.manager;
        $scope.isValidationRequired = false;
        $scope.validationMessages = [];
        $scope.currentPasswordFun = currentPasswordFun
        $scope.newpasswordFun = newpasswordFun
        $scope.confirmPasswordFun = confirmPasswordFun

        function currentPasswordFun() {
            var string = $scope.currentPassword;
            var str = string.trim();
            $scope.currentPassword = str;
            return
        }

        function newpasswordFun() {
            var string = $scope.newPassword;
            var str1 = string.trim();
            $scope.newPassword = str1;
            return
        }

        function confirmPasswordFun() {
            var string = $scope.confirmPassword;
            var str2 = string.trim();
            $scope.confirmPassword = str2;
            return
        }




        $scope.ok = function () {
            var deferred = $q.defer();


            $scope.isValidationRequired = false;
            var errormesgs = formValidate.validate('form');
            if (errormesgs.isValidationRequired == true) {
                $scope.isValidationRequired = true;
                $scope.validationMessages = [];
                $scope.validationMessages.push('Invalid data,Please Verify.'); return;
            }
            var iscapital = /[A-Z]/,
              isDigit = /\d/,
              isSpecialCharector = /[^a-zA-Z\d]/,
              isMinLength = /.{6,}/;

            if (!isMinLength.test($scope.newPassword)) {
                $scope.isValidationRequired = true;
                $scope.validationMessages = [];
                $scope.validationMessages.push('Minlength must be 6'); return;
            }
            if (!iscapital.test($scope.newPassword)) {
                $scope.isValidationRequired = true;
                $scope.validationMessages = [];
                $scope.validationMessages.push('Atlest One Upper Case is Mandatory'); return;
            }
            if (!isDigit.test($scope.newPassword)) {
                $scope.isValidationRequired = true;
                $scope.validationMessages = [];
                $scope.validationMessages.push('Atlest One Digit is Mandatory'); return;
            }
            if (!isSpecialCharector.test($scope.newPassword)) {
                $scope.isValidationRequired = true;
                $scope.validationMessages = [];
                $scope.validationMessages.push('Atlest One Special Charector is Mandatory'); return;
            }




            if ($scope.newPassword != $scope.confirmPassword) {
                $scope.validationMessages = [];
                $scope.isValidationRequired = true;
                $scope.validationMessages.push('Passwords do not match!'); return;

            };

            if ($scope.newPassword == $scope.currentPassword) {
                $scope.validationMessages = [];
                $scope.isValidationRequired = true;
                $scope.validationMessages.push('Current & New passwords should not be same'); return;

            };
            //$scope.currentPassword = str;
            //$scope.newPassword = str1;
            //$scope.confirmPassword = str2;

            // $scope.isValidationRequired = false;
            //  http://appsworldapiclient.azurewebsites.net/breeze/Account/ChangePassword?userName=Name&currentPassword=currentrPassword&newPassword=newPassword
            $http.get(serviceConfig.accountRemoteServerapi + "/ChangePassword?userName=" + config.userName + "&currentPassword=" + $scope.currentPassword + "&newPassword=" + $scope.newPassword)
                .success(function (response) {
                    // toastr.success('Password Changed Successfully');
                    commonService.notify.success("Password Changed Successfully");
                    $uibModalInstance.close('ok');
                    deferred.resolve(response);

                })
                .error(function (err, status) {
                    $scope.validationMessages = [];
                    $scope.isValidationRequired = true;
                    // $scope.validationMessages.push(err.Message.toString());
                    $scope.validationMessages.push(err.Message);
                    // $scope.validationText = err.ModelState.error0[0];
                    deferred.reject(err);
                    return;
                })

        }
        $scope.cancel = function () {
            $uibModalInstance.close('cancel');
        }
    }
})();
