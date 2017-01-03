angular.module("appsworld")
.directive('zLoader', ['$http', function ($http) {
    return {
        restrict: 'A',
        //template: '<div class="loading-spiner-holder" data-loading>'+
        //                '<div class="loading-spiner">'+
        //                    '<div class="loading-container text-center">'+
        //                        '<div class="spinner">'+
        //                          '<div class="dot1"></div>'+
        //                          '<div class="dot2"></div>'+
        //                        '</div>'+
        //                    '</div>'+
        //                '</div>'+
        //            '</div>',
        template: '<div class="loading-spiner-holder"><div class="splash-tle"><div class="spinner spinner1"> <div class="rect1"></div> <div class="rect2"></div> <div class="rect3"></div> <div class="rect4"></div> <div class="rect5"></div> </div> </div> </div>',

        link: function (scope, elm, attrs) {
            scope.isLoading = function () {
                return $http.pendingRequests.length > 0;
            };

            scope.$watch(scope.isLoading, function (v) {
                if (v) {
                    elm.show();
                } else {
                    elm.hide();
                }
            });
        }
    };

}])
.directive('updateTitle', ['$rootScope', '$timeout',
  function ($rootScope, $timeout) {
      return {
          link: function (scope, element) {

              var listener = function (event, toState,params) {

                  var title = 'AppsWorld';
                  if (toState.data && toState.data.pageTitle) {
                      //if (params.screen)
                      //{
                      //    if (toState.name === 'app.invoicing' && params.screen === 'invoice') {
                      //        title = 'Invoice';
                      //    }
                      //    else if (toState.name === 'app.invoicing' && params.screen !== 'invoice') {
                      //        title = 'Credit Note';
                      //    }
                      //}
                      //else 
                          title = toState.data.pageTitle
                      
                  };

                  $timeout(function () {
                      element.text(title);
                  }, 0, false);
              };

              $rootScope.$on('$stateChangeSuccess', listener);
          }
      };
  }
])
