(function () {
    'use strict';
    angular.module('appsworld')
    .directive('tabPermissions', tabPermissions);
    tabPermissions.$inject = ['framework', 'users_permissions'];
    function tabPermissions(framework, users_permissions) {

        function link(scope, ele, attr) {
            var _currentTab = scope.tabName;
            var _tabPermissions = null;


            function activate() {
                users_permissions.load_tab_permissions(scope.permissionKey).then(function (response) {
                    _tabPermissions = response[_currentTab];
                    setTabView();
                });
            }

            function setTabView() {
                function hide(per) {
                    var _hideFileds = $(ele).find('#tab_' + per);
                    for (var j = 0; j < _hideFileds.length; j++) {
                        _hideFileds[j].hidden = true;
                    }
                }
                function hidePermissions() {
                    if (!_tabPermissions.Add) {
                        hide('Add');
                    }
                    if (!_tabPermissions.Edit) {
                        hide('Edit');
                    }
                    if (!_tabPermissions.Disable) {
                        hide('Disable');
                    }
                    if (!_tabPermissions.Delete) {
                        hide('Delete');
                    }
                }
                var _fields = $(ele).find(':input');

                if (!_tabPermissions.View) {
                    $(ele)[0].innerHTML = "<h4>You don't have sufficient permissions to view this content</h4>";
                }
                else if (!_tabPermissions.Edit && !_tabPermissions.Add) {
                    for (var i = 0; i < _fields.length; i++) {
                        if (_fields[i].type == 'submit' || _fields[i].type == 'reset') {

                        } else {
                            _fields[i].disabled = true;
                        }
                    }

                    hidePermissions();
                }
                else {
                    hidePermissions();
                }
            }

            if (scope.delay) {
                setTimeout(function () {
                    activate();
                }, parseInt(scope.delay));
            } else { activate(); }
        }
        return {
            restrict: 'A',
            scope: {
                permissionKey: '=',
                delay: '=',
                tabName: '='
            },
            link: link
        }
    }

})();