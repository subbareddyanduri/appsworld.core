/**
 * AppsWorld
 * 
 *
 */
(function () {
    angular.module('appsworld', [
        'ui.router',                // Angular flexible routing
        'ngSanitize',               // Angular-sanitize
        'ui.bootstrap',             // AngularJS native directives for Bootstrap
        'angular-flot',             // Flot chart
        'angles',                   // Chart.js
        'angular-peity',            // Peity (small) charts
        'cgNotify',                 // Angular notify
        'angles',                   // Angular ChartJS
        'ngAnimate',                // Angular animations
        'ui.map',                   // Ui Map for Google maps
        'ui.calendar',              // UI Calendar
        'summernote',               // Summernote plugin
        'ngGrid',                   // Angular ng Grid
        'ui.tree',                  // Angular ui Tree
        'bm.bsTour',                // Angular bootstrap tour
        'datatables',               // Angular datatables plugin
        'xeditable',                // Angular-xeditable
        'ui.select',                // AngularJS ui-select
        'ui.sortable',              // AngularJS ui-sortable
        'ui.footable',              // FooTable
        'angular-chartist',         // Chartist
        'gridshore.c3js.chart',     // C3 charts
        'datatables.buttons',       // Datatables Buttons
        'angular-ladda',            // Ladda - loading buttons
        'ui.codemirror',             // Ui Codemirror 
        'kendo.directives',
        'addressbook',
        'masterGrids',
        'ZValidations',
        'ngCookies',
        'angucomplete-alt',
        'common.bootstrap',
        'angular-momentjs',
        'gridColumns',
        'reports',
        'autoform',
        'employeeprofile',
        'autoform',
    ])

      .run(['$rootScope', '$state', function ($rootScope, $state) {        
          $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
              $rootScope.prevUrlParam = $state.params;
              $rootScope.prevUrl = $state.current.name;
          });
      }])
})();

