(function () {
	'use strict';
	angular.module('appsworld')
    .directive('userPermissionsTool', userPermisiionTool)
	userPermisiionTool.$inject = ['$window', '$state', 'commonService', 'serviceConfig', '$templateCache', '$http', 'users_permissions', 'config', '$rootScope'];
	function userPermisiionTool($window, $state, commonService, serviceConfig, $templateCache, $http, users_permissions, config, $rootScope) {

		function link(scope,ele,attr) {
		    scope.permission_icons = users_permissions.icons;
		    scope.checkView = checkView;
		    scope.permissionClick = permissionClick;
		    var permission_config = permissionConfig();

			loadPermissions();

			function permissionConfig() {
				return { permissionKey: $state.current.data.permissionKey, userName: config.userName, companyId: config.companyId };
			}

			function loadPermissions() {
			    users_permissions.load_permissions(permission_config).then(function (data) {
			        scope.permissions =users_permissions.permissions_obj(data.data,permission_config.permissionKey);
			    });
			}

		    function permissionClick(permissionName) {
			    $rootScope.$broadcast('actionHandler', permissionName);
		    }

		    function checkView(isSaveLayout) {
		        if (isSaveLayout == true && config.role != 'admin') { return false; }
			    if (scope.permissions)
			        return scope.permissions.indexOf("View")>-1;
			    else
			        return false;
			}

			function refresh() {
			    permission_config = permissionConfig();
			    loadPermissions();
			}

			scope.$on('refresh_user_permissions', function () {
			    refresh();
			});

			scope.$on('$stateChangeSuccess', function () {
			    refresh();
			});
		}
		return {
			restrict: 'E',
			templateUrl: 'views/common/user_permissions_tool.html',
			scope: {},
            link:link
		}
	}
})();