/*
author:SubbaReddy
date:05/09/2015
Description: this is going to take user into right path
*/
/// <reference path="../common/auth/auth.js" />
/// <reference path="../common/auth/oidc-token-manager.js" />
(function () {
    'use strict';
    angular
        .module('appsworld')
        .controller('routeMediate', routeMediate);

    routeMediate.$inject = ['$http','config','$state','$rootScope','authService','$cookies'];

    function routeMediate($http, config, $state, $rootScope, authService, $cookies) {
        /* jshint validthis:true */
        var vm = this;
        var _domainInfo = {
            domain: window.location.host.split(':')[0],
            path:'/'
        }
          vm.chooseCompany = chooseCompany;          
          var obj = { ids: authService.auth_company.isMultiCompany ? authService.auth_company.companyId : [authService.auth_company.companyId], userName: config.userName };

          activate_company_selection();

          function _setCookie() {
              $cookies.put('company_details', JSON.stringify({ companyName: config.companyName, companyId: config.companyId, dateFormat: config.dateFormat, timeFormat: config.timeFormat, currency: config.currency,userImage:config.userImage,userFullName:config.userFullName }), { domain: _domainInfo.domain, path: _domainInfo.path });
          }

          function activate_company_selection() {
              authService.company_details(obj).then(function (data) {
                  if (authService.auth_company.isMultiCompany) {
                      config.userImage = data.data[0].MediumImage;
                      vm.companies = data.data;
                  }
                  else
                  {
                      if (data.data.length != 0)
                      {
                          if (data.data[0].Status !== 'Active' || data.data[0].UserStatus !== 'Active') {
                              vm.companies=data.data;
                              return;
                          }
                          config.companyId = data.data[0].Id;
                          config.companyName = data.data[0].Name;
                          config.dateFormat = data.data[0].LocalDateTimeFormat || 'dd/MM/yyyy';
                          config.timeFormat = data.data[0].TimeFormat || 'hh:mm';
                          config.currency = data.data[0].LocalCurrencyFormat || '$';
                          config.userFullName = data.data[0].FirstName;
                          config.userImage = data.data[0].MediumImage;
                      }
                      else
                      {
                          config.companyId = null;
                          config.companyName = 'AppsWorld'
                          config.dateFormat = 'dd/MM/yyyy';
                          config.timeFormat = 'hh:mm';
                          config.currency = '$';

                      }
                      _setCookie();
                      authService.auth_company.isAuthCompany = true;                      
                      config.role === 'Super User' && app_configuration.app_config.current_module!=='admin' ? window.location.replace(app_configuration.app_config.module_linking.admin) : $state.go(app_configuration.app_config.current_module + '.dashboard');
                  }
              });
          }

          function chooseCompany(company) {
              config.companyId = company.Id;
              config.companyName = company.Name;
              config.dateFormat = company.LocalDateTimeFormat || 'dd/MM/yyyy';
              config.timeFormat = company.TimeFormat || 'hh:mm';
              config.currency = company.LocalCurrencyFormat || '$';
              config.userFullName = company.FirstName;
              config.userImage = company.MediumImage;
              _setCookie();
              authService.auth_company.isAuthCompany = true;
             
              $state.go(app_configuration.app_config.current_module + '.dashboard');
          }       
    }
})();
