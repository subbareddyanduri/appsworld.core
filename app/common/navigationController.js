(function () {
    'use strict';
    angular.module('appsworld')
    .controller('navigationController', navigationController)
    .factory('navigationContext',navigationContext);
    navigationContext.$inject=[];
    navigationController.$inject = ['config', 'commonService', '$scope', 'navigationContext', '$cookies', 'serviceConfig','$state'];
    function navigationController(config, commonService, $scope, navigationContext, $cookies, serviceConfig,$state) {
        var vm=this;
        vm.selectedModuleName = null;
        vm.checkRole = checkRole;
        vm.setModuleDetailId = setModuleDetailId;
        activateController();
        $scope.$state = $state;
        vm.dashboard = dashboard;

        function dashboard(path) {
            $state.go('client.dashboard.iframesource', { reportPath: path});
        }
        function activateController(){
            loadModuleDetails();
        }
        function checkRole(role) {
            return config.role === role;
        }

        vm.getClass = getClass;
        function getClass(url) {
            return $state.includes(url);
        }
        function loadModuleDetails() {
            var _info = $cookies.get('moduleInfo');
            if (_info) {
                var _moduleInfo = JSON.parse(_info);
                commonService.getEntities(serviceConfig.adminRemoteServer + 'modulemaster?companyId=' + config.companyId).then(function (res) {
                    var _selectedModule = res.data.filter(function (value, index, array) {
                        return parseInt(value.Id) === parseInt(_moduleInfo.id) && value.Name === _moduleInfo.name;
                    });
                    _getModuleDetails(_selectedModule[0]);
                });
            }
            else
            {
                if (config.companyId && app_configuration.app_config.current_module) {
                    var _domain = window.location.host.split(':')[0];
                    commonService.getEntities(serviceConfig.clientCursorRemoteServer + 'GetModuleMasterAndDetails?companyid=' + config.companyId + '&moduleName=' + app_configuration.app_config.current_module).then(function (res) {
                        if (res.data) {
                            $cookies.put('moduleInfo', JSON.stringify({ name: res.data.Name, id: res.data.Id }), { path: '/', domain: _domain });
                            _getModuleDetails(res.data);
                        }
                        
                    })
                }
        
            }
            
                
            
        }

        //$scope.$on('module_changed',function(event,args){
        //    _getModuleDetails(args);
        //});
        function setModuleDetailId(id) {
            window.localStorage.setItem('ModuleDetailId', id);
        }
        function _getModuleDetails(module) {
            if (module) {
                vm.selectedModuleName = module.Name;
                vm.moduleActions1 = module.ModuleDetails;
                vm.moduleActions = navigationContext.moduleLinks(module);
                config.moduleActionsObj = vm.moduleActions;
            }
        }
    }
    
    function navigationContext(){
        var service={
            moduleLinks:moduleLinks
        }
        return service;
        function _filterArray(object) {
            var obj = [];
            var categories = [];
            $.each(object.ModuleDetails, function (index, value) {
                if ($.inArray(value.GroupName, obj) === -1)
                {                    
                        obj.push(value.GroupName);                                        
                }
            });
            for (var i = 0; i <= obj.length - 1; i++)
            {
                categories.push({ GroupName: obj[i], List: [],MasterUrl:null,CssSprite:null });
                for(var j=0;j<=object.ModuleDetails.length-1;j++)
                {
                    if(obj[i]===object.ModuleDetails[j].GroupName)
                    {
                        categories[i].MasterUrl = !categories[i].MasterUrl ? object.ModuleDetails[j].MasterUrl : categories[i].MasterUrl;
                        categories[i].CssSprite = !categories[i].CssSprite ? object.ModuleDetails[j].CssSprite : categories[i].CssSprite;
                        categories[i].List.push(object.ModuleDetails[j]);
                    }
                }
            }
           
            return categories;
        }
        function moduleLinks(moduleObj){
            return _filterArray(moduleObj);
        }
    }
})();