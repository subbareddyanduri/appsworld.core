(function () {
	'use strict';
	angular.module('appsworld')
	.controller('bladesController',bladesController)
	bladesController.$inject=['$rootScope','bladesContext','companysettings','$scope'];
	function bladesController($rootScope, bladesContext, companysettings,$scope) {
		var vm=this;
		vm.load_blade_template=load_blade_template;
		activate();
		$scope.$on('load_analytics', function () {
			request_blades();
		});
		function activate(){
			//request_blades();
		}
		
		function request_blades() {
		    if (companysettings["Analytics"]) {
		        bladesContext.load_blades().then(function (response) {
		            vm.bladesTypes = response.data.Blades;
		            vm.blades = bladesContext.set_blades(response.data.Blades);
		        });
		    }
		}

		function load_blade_template(bladename){
		  return bladename;
		}
	}
})();