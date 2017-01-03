/// <reference path="../app_configuration.js" />
(function () {
    'use strict';
    var masterGridModule = angular.module('masterGrids', []);
    masterGridModule.factory('masterGridDataContext', masterGridDataContext)
    .value('mastergridParams', {
        "/payroll": {
            employeeId: 12
        },
        "/jobapplications":{
             userName:null
        }
    });
    masterGridDataContext.$inject = ['commonService', 'serviceConfig', 'config', '$state', 'gridCols', '$cookies', 'subactionsContext', 'mastergridParams', 'users_permissions','modulesettings'];
    function masterGridDataContext(commonService, serviceConfig, config, $state, gridCols, $cookies, subactionsContext, mastergridParams, users_permissions,modulesettings) {
        var service = {};
        function _modelFields(columns) {
            var _modelFields = {};
            angular.forEach(columns, function (index) {
                if (index && index.field) {
                    _modelFields[index.field] = { type: "string" };
                }
            });
            return _modelFields;
        }
        service.remove_columns=function(columns,alterablecolumns){
            return columns.filter(function(value){
                return alterablecolumns.indexOf(value.field)==-1;
            });
        }
        service.manage_columns=function(){
            var _columns= {
                "admin_companies":{
                     remove_columns: config.role == 'admin' ? ["ExpiryDate"] : ["ShortName", "RegistrationNo"],
                     hide_columns:null
                },
                "bean_entities":modulesettings.BeanCursor?({remove_columns:!modulesettings.BeanCursor.IsMultiCurrencyActivate ? ["CustCurrency","VenCurrency"] : null}):null,
                "bean_invoices":modulesettings.BeanCursor?({remove_columns:!modulesettings.BeanCursor.IsMultiCurrencyActivate ? ["DocCurrency","ExCurrency","BaseAmount"] : null}):null,
                "bean_debitnotes":modulesettings.BeanCursor?({remove_columns:!modulesettings.BeanCursor.IsMultiCurrencyActivate ? ["DocCurrency","BaseCurrency","BaseTotal"] : null}):null,
                "bean_bills": modulesettings.BeanCursor?({remove_columns:!modulesettings.BeanCursor.IsMultiCurrencyActivate ? ["DocCurrency","BaseCurrency","BaseTotal"] : null}):null,
                "bean_deposit":modulesettings.BeanCursor?({remove_columns:!modulesettings.BeanCursor.IsMultiCurrencyActivate ? ["DocCurrency","ExCurrency","BaseAmount"] : null}):null,
                "bean_withdrawal":modulesettings.BeanCursor?({remove_columns:!modulesettings.BeanCursor.IsMultiCurrencyActivate ? ["DocCurrency","ExCurrency","BaseAmount"] : null}):null,
                "bean_receipts":modulesettings.BeanCursor?({remove_columns:!modulesettings.BeanCursor.IsBankReconciliationActivate ? ["BankClearingDate"] : null}):null, 
                "bean_cashsales":modulesettings.BeanCursor?({remove_columns:!modulesettings.BeanCursor.IsBankReconciliationActivate ? ["BankClearingDate"] : null}):null
                
            }
            return _columns[$state.current.data.permissionKey];
        }
        service.load_additionalParams = function (url) {
            var params = '';
            if (mastergridParams[url || $state.current.url]) {
                for (var key in mastergridParams[url || $state.current.url]) {
                    params = params + '&' + key + '=' + mastergridParams[url || $state.current.url][key];
                }
            }
            return params;
        }
        function _kPagedGridOptions(columns, url) {
            return {
                dataSource: {
                    serverPaging: true,
                    serverFiltering: true,
                    serverSorting: true,
                    pageSize: 20,
                    schema: {
                        data: "Data",
                        total: "Total",
                        model: {
                            id: "Id",
                            fields: _modelFields(columns)
                        }
                    },
                    batch: false,
                    transport: {
                        read: {
                            url: url,
                            contentType: "application/json"
                        },
                        parameterMap: function (data, operation) {
                            var params = service.load_additionalParams();
                            if (params == '')
                                return JSON.stringify(data) + '&companyId=' + config.companyId;
                            else
                                return JSON.stringify(data) + '&companyId=' + config.companyId + params;
                        }
                    }
                },

                sortable: true,
                filterable: true,
                columnMenu: true,
                reorderable: true,
                resizable: true,
                scrollable: true,
                pageable: {
                    pageSizes: ['All', 5, 10, 20, 50, 100],
                    refresh: true,
                    buttonCount: 5
                },
                columns: columns
            }

        }
        
        service.loadGrid = function (url) {
            config.companyId = !config.companyId || config.companyId === 'null' ? 0 : config.companyId;
            return commonService.getEntities(serviceConfig.gridMetaDataRemoteServer + 'getgridmetadata?companyId=' + config.companyId + '&userName=' + config.userName + '&url=' + url);
        }

        service.saveGridLayOut = function (object) {
            object.UserName = config.userName;
            return commonService.saveEntity(serviceConfig.gridMetaDataRemoteServer + 'savegridmetadata', object);
        }

        service.getGridOptions = function (url, columsJsonString) {
            url = url.replace("?", "");
            //if ($state.current.name === "app.bean.coas") {
            //    url = url + "&$inlinecount=allpages&$orderby=AccountTypeName,Name";
            //}

            //else {
            //    url = url + "&$inlinecount=allpages&$orderby=CreatedDate desc";
            //}        
            // return commonService.setPagedMasterGridOptions(url,JSON.parse(columsJsonString));
            var columns;
            if ($state.current.name === 'admin.companies' && config.role === 'Super User') {
                columns = gridCols.Company();
            } else {
                columns = JSON.parse(columsJsonString);
            }
            return _kPagedGridOptions(columns, url);
        }

        service.disableItems = function (ids) {
            return commonService.saveEntity(serviceConfig.apiCursorsRemoteServer + 'EnableOrDisableNew', ids);
        }

        service.isEditPermissionApplied = function () {
            return users_permissions.load_permissions({ permissionKey: $state.current.data.permissionKey });
           
        }

        service.sub_action_url = function (options, dataItem, actionType, isParamsrequired) {
            var _url = subactionsContext[options[actionType].module][options[actionType].screenName][actionType.toLowerCase() + '_' + options[actionType].screenName];
            if (isParamsrequired) {
                function build_params() {
                    angular.forEach(options[actionType].ActionParams, function (index, key) {
                        _url = _url + index.key + '=';
                        index.IsTakeFromGrid ? _url = _url + dataItem[index.DataField] : '';
                        index.IsTakeFromConfig ? _url = _url + config[index.DataField] : '';
                        !index.IsTakeFromGrid && !index.IsTakeFromConfig ? _url = _url + index.Value : '';
                        _url = _url + '&';
                    });
                }
                build_params();
                return _url.substring(0, _url.length - 1);
            }
            else {
                return _url;
            }

        }

        return service;

    };
    masterGridModule.filter('gridName', function () {
        return function (input) {
            var str = input.substring(1, input.length);
            return !str ? '' : str.charAt(0).toUpperCase() + input.substr(2);
        }
    });
    masterGridModule.filter('formateDate', function () {
        return function (input) {
            return kendo.toString(kendo.parseDate(input, 'yyyy-MM-dd'), 'dd/MM/yyyy')
        }
    })
})();