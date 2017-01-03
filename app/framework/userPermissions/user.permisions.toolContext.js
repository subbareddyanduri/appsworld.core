(function () {
    'use strict';
    angular.module('appsworld')
    .factory('users_permissions', users_permissions)
        // hidding permissions even permssion is selected
    .value('hidepermissions',{
        "workflow_clients":{
            Add:"companysettings.ClientCursor==true"
        },
        "workflow_cases": {
            Add: "companysettings.ClientCursor==true"
        }
    })
    users_permissions.$inject = ['serviceConfig', 'commonService', 'config', '$state', '$q', '$window', 'hidepermissions', 'companysettings'];
    function users_permissions(serviceConfig, commonService, config, state, $q, $window, hidepermissions, companysettings) {
        var icons = { Add: "add-icon tool-icons", Edit: "edit-icon tool-icons", Disable: "disabled-icon tool-icons", Delete: "delete-icon tool-icons", Refresh: "refresh-icon tool-icons", SaveLayout: "savelayout-icon tool-icons", ViewHistory: "history-icon tool-icons", Void: "void-icon tool-icons",Quotation: "quotations-icon tool-icons",State: "State-icon tool-icons",CaseState:"tool-icons State-icon",CaseCancel:"cancel-icon tool-icons",Print:"print-icon tool-icons",RevisedQuotation:"reverse-quotations-icon tool-icons",Copy:"copy-icon tool-icons",Rejected: "rejected-icon tool-icons",Approved: "ok-icon tool-icons",Recommended: "approve-icon tool-icons",OpportunityCancel: "cancel-icon tool-icons",OnHold:"datepicker-icon tool-icons",ConvertToEmployee: "convertemp-icon tool-icons"};

        var service = {
            icons: icons,
            load_permissions: load_permissions,
            permissions_obj: permissions_obj,
            load_tab_permissions: load_tab_permissions,
            load_user_permissions: load_user_permissions
        };
        return service;

        function load_permissions(permission_config) {
            var deffered = $q.defer();
            var _permissions = $window.localStorage.getItem("PER_"+permission_config.permissionKey);
            if (_permissions) {      
                deffered.resolve({data:JSON.parse(_permissions)});
                return deffered.promise;
            }
            else {
                permission_config.userName = permission_config.userName ? permission_config.userName : config.userName;
                permission_config.companyId = permission_config.companyId ? permission_config.companyId : config.companyId;
                var uri = serviceConfig.gridMetaDataRemoteServer + 'getnewuserpermissionsfortoolbar?userName=' + permission_config.userName + '&permissionKey=' + permission_config.permissionKey + '&companyId=' + permission_config.companyId;
                return commonService.getEntities(uri).then(function (res) {
                    $window.localStorage.setItem("PER_" + permission_config.permissionKey, JSON.stringify(res.data));                   
                    return res;
                });
            }
        }

        function permissions_obj(data,permissionkey) {
            var _result = [];
            for (var key in data.Metadata) {
                if ((data.Metadata[key] && data.Metadata[key] == "True") && (hidepermissions[permissionkey]?!eval(hidepermissions[permissionkey][key]):true)){
                      _result.push(key);
                }
            }
            return _result;
        }

        function load_tab_permissions(permissionKey) {
            return load_permissions({ userName: config.userName, permissionKey: permissionKey, companyId: config.companyId }).then(function (response) {
                var tabModels = {};
                for (var i = 0; i <= response.data.TabModels.length - 1; i++) {
                    tabModels[response.data.TabModels[i].ScreenName] = response.data.TabModels[i].Metadata;
                }
                return tabModels;
            });
        }

        function load_user_permissions(permissionKey) {
            permissionKey = permissionKey ? permissionKey : $state.current.data.permissionKey;
            return load_permissions({ userName: config.userName, permissionKey: permissionKey, companyId: config.companyId }).then(function (response) {
                var permissions = {};
                for (var key in response.data.Metadata) {
                    permissions[key] = response.data.Metadata[key];
                }
                for (var key in response.data.Functionality) {
                    permissions[key] = response.data.Functionality[key];
                }
                return permissions;
            });
        }
    }

})();