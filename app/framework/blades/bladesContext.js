(function () {
	'use strict';
	angular.module('appsworld')
	.factory('bladesContext',bladesContext)
	bladesContext.$inject=['commonService','serviceConfig','config','$stateParams','$state'];
	function bladesContext(commonService,serviceConfig,config,$stateParams,$state){
		var service={
			load_blades:load_blades,
			set_blades:set_blades
		};
		return service;

		function load_blades(){
			var _config={
				permissionKey:$state.current.data.permissionKey,
				id:$stateParams.Id||$stateParams.id||null,
				module:app_configuration.app_config.current_module
			}
			var url = serviceConfig.bladesRemoteServer + 'GetBladeDetails?permissionkey=' + _config.permissionKey + "&companyId=" + config.companyId + "&moduleName=" + _config.module + "&id=" + _config.id;
			return commonService.getEntities(url);
		}

		function set_blades(data){
			var _blades={};
			for(var i=0;i<=data.length-1;i++){
				_blades[data[i].BladeTypeName]=data[i].Data;
			}
			return _blades;
		}
	}
})();