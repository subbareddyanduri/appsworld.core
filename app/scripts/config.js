/**
 * AppsWorld 
 * version 1.8
 *
 */

function configState($stateProvider, $urlRouterProvider, $compileProvider) {

    // Optimize load start with remove binding information inside the DOM element
    $compileProvider.debugInfoEnabled(true);

    // Set default state
    $urlRouterProvider.otherwise("/core/dashboard");
    $urlRouterProvider.when('/','/core/landing_page');
    $stateProvider
        .state('core', {
            url: "/core",
            templateUrl: "views/core.html",
            data: {
                pageTitle: 'AppsWorld'
            }
        })
        .state("core.scheduling", {
            url: '/scheduling',
            templateUrl: 'poc/scheduler/scheduler.html',           
        })
        .state("core.poc", {
            url: '/POC',
            templateUrl: 'framework/poc.html',
        })
         .state("core.autoform", {
             url: '/autoform',
             templateUrl: 'autoform/formauto.html',
         })
        .state('core.campaign', {
            url: '/campaign?Id',
            templateUrl:'masterform/masterform.html',
            data: {
                file: 'campaign',
                jsonpath: 'campaign',
                title:'Campaign'
            }
        })
       .state("core.landing",{
        url:'/landing_page',
        templateUrl:'landing_page.html'
        })
        .state('selectcompany', {
            url: '/selectcompany',
            templateUrl: 'companyselection/routemediator.html',
            data: {
                pageTitle:'AppsWorld'
            }
        })
        .state('core.cam', {
            templateUrl: 'masterform/masterform.html',
            url: '/cam?Id',
            data: {
                file: 'campaign',
                jsonpath: 'campaign'
            }
        })
        .state('core.dashboard', {
            url: '/dashboard',
            templateUrl: 'views/dashboard.html',
            data: {
                pageTitle:'AppsWorld'
            }
        })       
        // Landing page
        .state('landing', {
            url: "/landing_page",
            templateUrl: "views/landing_page.html",
            data: {
                pageTitle: 'Landing page',
                specialClass: 'landing-page'
            }
        })

        // Dashboard - Main page
        

        // Analytics
        .state('analytics', {
            url: "/analytics",
            templateUrl: "views/analytics.html",
            data: {
                pageTitle: 'Analytics'
            }
        })

      .state('checkdirectives', {
          url: 'checking',
          templateUrl:'views/check.html'
      })
      .state('core.sheduler', {
          url: '/sheduler',
          templateUrl: 'sheduler/sheduler.html',
          data: {
              pageTitle:'Sheduler'
          }
      })
      .state('core.zsheduler', {
             url: '/zsheduler',
             templateUrl: 'zsheduler/zsheduler.html',
             data: {
                 pageTitle: 'Sheduler'
             },
             controller: function ($scope) {
                 $scope.options = {
                     type: 'week',
                     startDate: new Date(),
                     tasks:null
                 }
             }
         })
    .state('core.zgrids', {
        url: '/zgrids',
        templateUrl: 'CustomDirectives/zGrids/grid_demo.html',
        data: {
            pageTitle: 'Sheduler'
        }
    })
        
       .state('core.reports', {
           url: '/reports',
           templateUrl: 'Reports/reports.html',
           data: {
               pageTitle: 'Reports'
           }
       })

	 .state('core.scheduler', {
	 	url: '/scheduler',
	 	templateUrl: 'scheduler.html',
	 	data: {
	 		pageTitle: 'scheduler'
	 	}
	 })
    

	 .state('core.logging', {
	 	url: '/logging',
	 	templateUrl: 'logging.html',
	 	data: {
	 		pageTitle: 'logging'
	 	}
	 })
      .state('core.userProfile', {
         url: '/userProfile',
         templateUrl: 'userProfile/editProfile.html',
         data: {
             pageTitle: 'Edit Profile',
             isPermissionBarRequired: false
         }
     })
}

angular
    .module('appsworld')
    .config(configState)
    .run(function ($rootScope, $state, editableOptions, authService) {
        $rootScope.$state = $state;
        editableOptions.theme = 'bs3';
        authService.fill_authentication_details();
        authService.company_modules();
        authService.check_module_info();

        $rootScope.$on('$stateChangeStart', function () {
            //if (authService.is_session_expired()) { authService.re_direct_for_token(); };
        });

        $rootScope.$on('$stateChangeSuccess', function () {            
            if (!authService.auth_company.isAuthCompany&&$state.current.name!=='selectcompany') {
                $state.go('selectcompany');                
            }
        });        
    });