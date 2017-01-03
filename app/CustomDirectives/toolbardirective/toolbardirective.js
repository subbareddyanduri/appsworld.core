angular.module('toolbardirective', [])
  .directive('buttonDirective', function ($compile, $http, $state, config, serviceConfig) {
      return {
          restrict: 'A',
          //replace: true,
          link: function (scope, element) {
              // alert($state.current.name)
              
              var _toolBar = {
                  url: $state.current.name.includes('mastergrid') || $state.current.name.includes('accounttypeterms') ? $state.current.name + '_' + window.localStorage.getItem('ModuleDetailId') : $state.current.name,
                  companyId: config.companyId,
                  userName: config.userName,
                  moduleDetailId: window.localStorage.getItem('ModuleDetailId')
              }
              var _toolBarSettings = (function () {

                  function _screenPermissions() {
                      var _url;
                      if (_toolBar.moduleDetailId)
                          _url = serviceConfig.gridMetaDataRemoteServer + 'GetUserPermissionsForToolBar?username=' + _toolBar.userName + '&moduleDetailId=' + _toolBar.moduleDetailId + '&companyId=' + _toolBar.companyId;
                      else
                         _url= serviceConfig.gridMetaDataRemoteServer + 'GetUserPermissionsForToolBarWithURL?username=' + _toolBar.userName + '&url=' + _toolBar.url + '&companyId=' + _toolBar.companyId
                    return  $http.get(_url);
                  }                       
                 
                  function _createToolBar1(permissions) {                     
                      var el = angular.element('<ul class="list-unstyled list-inline text-right edit-tools-wrapper hidden-xs" id="permissionBar" />');                     
                      angular.forEach(permissions, function (index, key) {                          
                          if (index.PermissionName === 'View' && index.IsApplicable) {
                              el.append('<li class="pull-right"><a href="" id="refresh_' + index.Id + '" tooltip-placement="top" uib-tooltip="Refresh" ng-click="vm.refresh()"><i class="refresh-icon tool-icons"></i></a></li>');
                              el.append('<li class="pull-right"><a id="filters_' + index.Id + '"  href="" tooltip-placement="top" uib-tooltip="Clear Filters" ng-click="vm.clearFilters()"><i class="filter-icon tool-icons"></i></a></li>');
                              el.append('<li class="pull-right"><a id="saveLayOut_' + index.Id + '" href=""  tooltip-placement="top" uib-tooltip="Save Layout" ng-click="vm.saveLayOut()"><i class="savelayout-icon tool-icons"></i></a></li>');
                              el.append('<li class="pull-right"><a id="history_' + index.Id + '" href=""  tooltip-placement="top" uib-tooltip="View history" ng-click="vm.viewHistory()"><i class="history-icon tool-icons"></i></a></li>');                            
                          }
                          else 
                          {
                              if (index.IsApplicable) {
                              el.append('<li><a href="" id="' + index.Id + '" tooltip-placement="top" uib-tooltip="' + index.PermissionName + '" ng-click="vm.' + index.PermissionName + '()"><i class="' + index.FontAwesomeClass + '"></i></a></li>');                             
                              }
                          }
                      });
                   
                      return el;
                  }

                  function _createSuperUserToolBar() {
                      //var el = angular.element('<div style="padding:2px;"/>');
                      var el = angular.element('<ul class="list-unstyled list-inline text-right edit-tools-wrapper" id="permissionBar"/>');

                      el.append('<li><a  id="Add" href="" tooltip-placement="top" uib-tooltip="Add" ng-click="vm.Add()"><i class="add-icon tool-icons">Add</i></a></li>');
                      el.append('<li><a id="Edit" href="" tooltip-placement="top" uib-tooltip="Edit" ng-click="vm.Edit()"><i class="edit-icon tool-icons"></i></a></li>');
                      el.append('<li><a id="Disable" href="" tooltip-placement="top" uib-tooltip="Disable" ng-click="vm.Disable()"><i class="disabled-icon tool-icons"></i></a></li>');
                      el.append('<li><a id="history" href="" tooltip-placement="top" uib-tooltip="View history" ng-click="vm.viewHistory()"><i class="history-icon tool-icons"></i></a></li>');
                      el.append('<li><a id="filters" href="" tooltip-placement="top" uib-tooltip="Clear Filters" ng-click="vm.clearFilters()"><i class="filter-icon tool-icons"></i></a></li>');
                      el.append('<li><a href="" id="refresh" tooltip-placement="top" uib-tooltip="Refresh" ng-click="vm.refresh()"><i class="refresh-icon tool-icons"></i></a></li>');                  
                      return el;
                  }
                  return {
                      screenPermissions: _screenPermissions,
                      createToolBar: _createToolBar1,
                      createSuperUserToolBar: _createSuperUserToolBar
                  }
              })();

              function _loadPermissions() {
                  var _permissions = window.localStorage.getItem("PER:" + _toolBar.url);
                  if (_permissions === null) {
                      if (config.role === 'admin' && $state.current.data.isPermissionBarRequired) {
                          var _per = _toolBarSettings.screenPermissions();
                          _per.then(function (res) {
                              var elm = _toolBarSettings.createToolBar(res.data);
                              if (res.data.length != 0)
                                  window.localStorage.setItem("PER:" + _toolBar.url, JSON.stringify(res.data));
                              $compile(elm)(scope);
                              element.append(elm);
                          })
                          _per.error(function () {
                              var _el = angular.element('<div  style="padding:2px;"/>');
                              //_el.append('<a id="bookMark" z-bookmark entityname="$state.current.data.pageTitle"></a>');
                              $compile(_el)(scope);
                              element.append(_el);
                          });
                      } else {
                          var elm1 = $compile(_toolBarSettings.createSuperUserToolBar())(scope);
                          element.append(elm1);
                      }
                  }
                  else {
                      var elm = _toolBarSettings.createToolBar(JSON.parse(_permissions));
                      $compile(elm)(scope);
                      element.append(elm);
                  }
              }

              _loadPermissions();

              scope.$on('$stateChangeSuccess', function (event, state) {
                  
                  _toolBar.url = state.name.includes('mastergrid') || state.name.includes('accounttypeterms') ? state.name + '_' + window.localStorage.getItem('ModuleDetailId') : state.name;
                  _toolBar.moduleDetailId = window.localStorage.getItem('ModuleDetailId');
                  $("ul[id=permissionBar]").each(function (index) {
                      $(this).remove();
                  });
                  _loadPermissions();
              });
                
          }
      }

  })
 .directive('mobileButtonDirective', function ($compile, $http, $state, config, serviceConfig) {
     return {
         restrict: 'A',
         //replace: true,
         link: function (scope, element) {
             // alert($state.current.name)

             var _toolBar = {
                 url: $state.current.name.includes('mastergrid') || $state.current.name.includes('accounttypeterms') ? $state.current.name + '_' + window.localStorage.getItem('ModuleDetailId') : $state.current.name,
                 companyId: config.companyId,
                 userName: config.userName,
                 moduleDetailId: window.localStorage.getItem('ModuleDetailId')
             }
             var _toolBarSettings = (function () {

                 function _screenPermissions() {
                     var _url;
                     if (_toolBar.moduleDetailId)
                         _url = serviceConfig.gridMetaDataRemoteServer + 'GetUserPermissionsForToolBar?username=' + _toolBar.userName + '&moduleDetailId=' + _toolBar.moduleDetailId + '&companyId=' + _toolBar.companyId;
                     else
                         _url = serviceConfig.gridMetaDataRemoteServer + 'GetUserPermissionsForToolBarWithURL?username=' + _toolBar.userName + '&url=' + _toolBar.url + '&companyId=' + _toolBar.companyId
                     return $http.get(_url);
                 }                
                 function _createToolBar1(permissions) {                   
                     var mel = angular.element('<ul class="list-unstyled list-inline text-right edit-tools-wrapper visible-xs" id="permissionBarM"/>');
                     angular.forEach(permissions, function (index, key) {
                         if (index.PermissionName === 'View' && index.IsApplicable) {                          
                             mel.append('<li class="pull-left ml-15"><a href="" id="refresh_' + index.Id + '"  ng-click="vm.refresh()"><i class="refresh-icon tool-icons mbm-3"></i> <span>Refresh</span></a></li>');
                             mel.append('<li class="pull-left ml-15"><a id="filters_' + index.Id + '"  ng-click="vm.clearFilters()"><i class="filter-icon tool-icons mbm-3"></i> <span>Clear Filters<span></a></li>');
                             mel.append('<li class="pull-left ml-15"><a id="saveLayOut_' + index.Id + '" ng-click="vm.saveLayOut()"><i class="savelayout-icon tool-icons mbm-3"></i> <span>Save Layout</span></a></li>');
                             mel.append('<li class="pull-left ml-15"><a id="history_' + index.Id + '"  ng-click="vm.viewHistory()"><i class="history-icon tool-icons mbm-3"></i> <span>View history</span></a></li>');
                         }
                         else {
                             if (index.IsApplicable) {                                
                                 mel.append('<li class="pull-left ml-15"><a href="" id="' + index.Id + '" ng-click="vm.' + index.PermissionName + '()"><i class="' + index.FontAwesomeClass + ' mbm-3"></i> <span>' + index.PermissionName + '</span></a></li>');
                             }
                         }
                     });
                    
                     return mel;
                 }

                 function _createSuperUserToolBar() {
                     //var el = angular.element('<div style="padding:2px;"/>');
                     var el = angular.element('<ul class="list-unstyled list-inline text-right edit-tools-wrapper" id="permissionBar"/>');

                     el.append('<li><a  id="Add" href="" tooltip-placement="top" uib-tooltip="Add" ng-click="vm.Add()"><i class="add-icon tool-icons">Add</i></a></li>');
                     el.append('<li><a id="Edit" href="" tooltip-placement="top" uib-tooltip="Edit" ng-click="vm.Edit()"><i class="edit-icon tool-icons"></i></a></li>');
                     el.append('<li><a id="Disable" href="" tooltip-placement="top" uib-tooltip="Disable" ng-click="vm.Disable()"><i class="disabled-icon tool-icons"></i></a></li>');
                     el.append('<li><a id="history" href="" tooltip-placement="top" uib-tooltip="View history" ng-click="vm.viewHistory()"><i class="history-icon tool-icons"></i></a></li>');
                     el.append('<li><a id="filters" href="" tooltip-placement="top" uib-tooltip="Clear Filters" ng-click="vm.clearFilters()"><i class="filter-icon tool-icons"></i></a></li>');
                     el.append('<li><a href="" id="refresh" tooltip-placement="top" uib-tooltip="Refresh" ng-click="vm.refresh()"><i class="refresh-icon tool-icons"></i></a></li>');
                     return el;
                 }
                 return {
                     screenPermissions: _screenPermissions,
                     createToolBar: _createToolBar1,
                     createSuperUserToolBar: _createSuperUserToolBar
                 }
             })();

             function _loadPermissions() {
                 var _permissions = window.localStorage.getItem("PER:" + _toolBar.url);
                 if (_permissions === null) {
                     if (config.role === 'admin' && $state.current.data.isPermissionBarRequired) {
                         var _per = _toolBarSettings.screenPermissions();
                         _per.then(function (res) {
                             var elm = _toolBarSettings.createToolBar(res.data);
                             if (res.data.length != 0)
                                 window.localStorage.setItem("PER:" + _toolBar.url, JSON.stringify(res.data));
                             $compile(elm)(scope);
                             element.append(elm);
                         })
                         _per.error(function () {
                             var _el = angular.element('<div  style="padding:2px;"/>');
                             //_el.append('<a id="bookMark" z-bookmark entityname="$state.current.data.pageTitle"></a>');
                             $compile(_el)(scope);
                             element.append(_el);
                         });
                     } else {
                         var elm1 = $compile(_toolBarSettings.createSuperUserToolBar())(scope);
                         element.append(elm1);
                     }
                 }
                 else {
                     var elm = _toolBarSettings.createToolBar(JSON.parse(_permissions));
                     $compile(elm)(scope);
                     element.append(elm);
                 }
             }

             _loadPermissions();

             scope.$on('$stateChangeSuccess', function (event, state) {

                 _toolBar.url = state.name.includes('mastergrid') || state.name.includes('accounttypeterms') ? state.name + '_' + window.localStorage.getItem('ModuleDetailId') : state.name;
                 _toolBar.moduleDetailId = window.localStorage.getItem('ModuleDetailId');
                 $("ul[id=permissionBarM]").each(function (index) {
                     $(this).remove();
                 });
                 _loadPermissions();
             });

         }
     }

 })
