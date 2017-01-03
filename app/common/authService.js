(function () {
    'use strict';

    angular
        .module('appsworld')
        .factory('authService', authService);

    authService.$inject = ['$http','$window', 'config', '$state', '$cookies', '$cookieStore', 'serviceConfig','$rootScope'];

    function authService($http, $window, config, $state, $cookies, $cookieStore, serviceConfig, $rootScope) {
        var authManager = mgr;
        var authData = authManager.profile;
        var companyModules = [];
        var service = {};
        if (!authData.email || !authData.role) {
            console.log('Note: this is to inform you that the  claim(s) are  not inserted. any of these "companyId","role"');
            return;
        }
        var _authentication = {           
            userName: authData.email,
            role: authData.role.indexOf('Super User')!=-1 ? 'Super User' : authData.role,            
        }
        var _companyinfo = {
            isMultiCompany: typeof (authData.companyId) === 'object' ? true : false,           
            companyId: authData.companyId,
            isAuthCompany:false
        }
        service.auth_company = _companyinfo;
        service.user_info = _authentication;
        service.fill_authentication_details = function () {
            var _companydata = $cookies.get('company_details');
            config.userName = _authentication.userName;
            config.role = _authentication.role;
            if (_companydata) {
                _companydata = JSON.parse(_companydata);
                config.companyId = _companydata.companyId;
                config.companyName = _companydata.companyName;
                config.dateFormat = _companydata.dateFormat;
                config.timeFormat = _companydata.timeFormat;
                config.currency = _companydata.currency;
                config.userImage = _companydata.userImage;
                config.userFullName = _companydata.userFullName;
                _companyinfo.isAuthCompany = true;
            } else {
                $state.go('selectcompany');
            }
        };
        service.company_details = function (obj) {
            //var url="http://192.168.0.100:90/AWAdminDev/api/common/GetCompanyDetails";
            return $http.post(serviceConfig.adminRemoteServer + 'GetCompanyDetails', obj);
        };
        service.check_module_info = function () {
            var _moduleInfo = $cookies.get('moduleInfo');
            if (_moduleInfo) {
                _moduleInfo = JSON.parse(_moduleInfo);
                if (_moduleInfo.name.toLowerCase().indexOf(app_configuration.app_config.current_module)==-1) {
                    $cookies.remove('moduleInfo')
                }
            }
        };

        service.company_modules = function () {
            if (config.companyId) {
                $http.get(serviceConfig.adminRemoteServer + 'modulemaster?companyId=' + config.companyId).then(function (response) {
                    companyModules = response.data;
                    $rootScope.$broadcast('company_modules_loaded');
                    config.Modules = {};
                    if (companyModules.length !== 0) {
                        for (var i = 0; i <= companyModules.length - 1; i++) {
                            if (companyModules[i].Status === 'Active')
                                config.Modules['is' + companyModules[i].Name.split(' ')[0]] = true;
                            else
                                config.Modules['is' + companyModules[i].Name.split(' ')[0]] = false;
                        }
                    }
                });
            }
           
        };
        service.get_company_modules = function () {
            return companyModules;
        };
        service.current_module = function (name) {
            if (companyModules.length != 0) {
                var module = companyModules.filter(function (value) {
                    return value.Name == name + ' Cursor';
                });
                return module[0];
            }
            else {
                setTimeout(function () { service.current_module();}, 1)
            }            
        }
        service.is_session_expired = function () {
            return authManager.expired;
        };
        service.re_direct_for_token = function () {
            authManager.redirectForToken();
        }
        return service;
    }
 })();