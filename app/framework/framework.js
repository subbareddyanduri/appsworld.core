(function () {
    'use strict';
    angular.module('appsworld')
    .value('modulesettings', {
    })
    .value('companysettings', {
    })
    .factory('framework', framework)
    framework.$inject = ['config', 'modulesettings', 'companysettings', 'commonService', 'serviceConfig'];
    function framework(config, modulesettings, companysettings, commonService, serviceConfig) {
        var remoteServer = serviceConfig.adminRemoteServer;
        var service = {
            company_settings: company_settings,
            module_settings: module_settings,
            module_details: module_details,
            module_links: module_links
        };
        return service;

        function module_settings() {
            return
        }
        function company_settings() {
            return commonService.getEntities(remoteServer + 'getcompanysetting?companyId=' + config.companyId).then(function (response) {
                // settings which modules are activated
                for (var key in response.data.Metadata) {
                    companysettings[key] = response.data.Metadata[key] == "True" ? true : false;
                }
                for (var key in response.data) {
                    if (typeof (response.data[key]) != 'object') {
                        companysettings[key] = response.data[key];
                    }
                }
                for (var key in response.data.CompanyFeatures) {
                    companysettings[key] = response.data.CompanyFeatures[key]=="True"?true:false;
                } 
                // settings which settings are activated for each module
                for (var i = 0; i <= response.data.SettiongsModel.length - 1; i++) {
                    modulesettings[response.data.SettiongsModel[i].CursorName] = response.data.SettiongsModel[i].Metadata;
                    for (var key in modulesettings[response.data.SettiongsModel[i].CursorName]) {
                        modulesettings[response.data.SettiongsModel[i].CursorName][key] = modulesettings[response.data.SettiongsModel[i].CursorName][key] == "True" ? true : false;
                    }

                }
            });
        }

        function module_details(modulename) {
            var _companyid = config.companyId ? config.companyId : 0;
            return commonService.getEntities(serviceConfig.adminRemoteServer + 'GetModuleMasterAndDetails?companyid=' + _companyid + '&moduleName=' + modulename);
        }

        function _filterArray(object) {
            var obj = [];
            var categories = [];
            $.each(object.ModuleDetails, function (index, value) {
                if ($.inArray(value.GroupName, obj) === -1) {
                    obj.push(value.GroupName);
                }
            });
            for (var i = 0; i <= obj.length - 1; i++) {
                categories.push({ GroupName: obj[i], List: [], MasterUrl: null, CssSprite: null });
                for (var j = 0; j <= object.ModuleDetails.length - 1; j++) {
                    if (obj[i] === object.ModuleDetails[j].GroupName) {
                        categories[i].MasterUrl = !categories[i].MasterUrl ? object.ModuleDetails[j].MasterUrl : categories[i].MasterUrl;
                        categories[i].CssSprite = !categories[i].CssSprite ? object.ModuleDetails[j].CssSprite : categories[i].CssSprite;
                        categories[i].List.push(object.ModuleDetails[j]);
                    }
                }
            }

            return categories;
        }

        function create_group(object, list) {
            //console.log(modulesettings);
            var _obj = { GroupName: object.GroupName, MasterUrl: object.MasterUrl, CssSprite: object.CssSprite, Url: object.Url, List: [] };

            _obj.List = list.filter(function (value) {
                return value.GroupName == object.GroupName;
            });
            var _ele = '<li ng-class="{active:$state.includes(' + _obj.MasterUrl + ')}"><a ui-sref="' + _obj.MasterUrl + '" data-toggle="collapse" data-target="#' + _obj.GroupName + '"><i class="' + _obj.CssSprite + '"></i><span class="nav-label">' + _obj.GroupName + '</span><span class="fa arrow"></span> </a><ul class="nav nav-second-level" id="' + _obj.GroupName + '">';
            for (var i = 0; i < _obj.List.length; i++) {
                // removing "" for master set up TODO
                _obj.List[i].Url = _obj.List[i].Url.replace(/"/g, "'");
                
                if (!_obj.List[i].ParentId) {
                    _ele = _ele + '<li ui-sref-active="active" ng-click="setModuleDetailId(' + _obj.List[i].Id + ')"><a ui-sref="' + _obj.List[i].Url + '">' + _obj.List[i].Heading + '</a></li>';
                }
            }
            return _ele + '</ul></li>';
        }

        function create_links(object) {
            var _ele = '';
            object.Url = object.Url.replace(/"/g, "'");
            if (!object.ParentId) {
                _ele = _ele + '<li ui-sref-active="active" ng-click="setModuleDetailId(' + object.Id + ')"><a ui-sref="' + object.Url + '"><i class="' + object.FontAwesome + '"></i><span>' + object.Heading + '</span></a></li>';
            }
            return _ele;
        }

        function module_links(moduleObj) {
            var _details = angular.copy(moduleObj.ModuleDetails);
            config.moduleActionsObj =_filterArray(angular.copy(moduleObj));  // this is for hr leave application
            var _navele = '<div id="navigation"> <ul side-navigation class="nav sidemenu-wrapper" id="side-menu">';
            var _groups = [];
            for (var i = 0; i < _details.length; i++) {
                if (_details[i].GroupName && _groups.indexOf(_details[i].GroupName) == -1 &&(_details[i].IsGroupSubscribe||config.role!='admin') ) {
                    _groups.push(_details[i].GroupName)
                    _navele = _navele + create_group(_details[i], _details);
                }
                else if (!_details[i].GroupName) {
                    _navele = _navele + create_links(_details[i]);
                }

            }
            return _navele + '</ul></div>';
        }
    }
})();