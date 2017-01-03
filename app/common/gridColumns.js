
(function() {
  'use strict';

  var gridColumn = angular.module('gridColumns', []);
  gridColumn.factory('gridCols', function (config) {
    return {
   
      ControlCodes: function() {
        return [
         { template: '<div class="checkbox checkboxlable"><input type="checkbox" id="{{dataItem.Id}}" ng-checked="vm.selection.indexOf(dataItem) > -1" ng-click="vm.toggleSelection(dataItem)"><label for=""></label></div>', "width": "50px" },
         { field: 'ControlCodeCategoryCode', template: '<a href="" ng-click="vm.getViewMode(dataItem.Id,dataItem.ModuleNamesUsing)">${ControlCodeCategoryCode}</a>', title: "Category", filterable: { cell: { operator: "contains" } } },
         { field: "ModuleNamesUsing", title: "ModuleNamesUsing" },
        ]
      },
      
    
      Employee: function () {
          return [
               { template: '<div class="checkbox checkboxlable"><input type="checkbox" id="{{dataItem.Id}}" ng-checked="vm.selection.indexOf(dataItem) > -1" ng-click="vm.toggleSelection(dataItem.Id,dataItem.Status,dataItem.Name)"><label for=""></label></div>', "width": "50px" },
          {
              field: 'FirstName',
              title: 'FirstName',
              width: '250px',
              template: '<a href="" ng-click="vm.getViewMode(dataItem)">${FirstName}</a>'
          }, {
              field: 'Username',
              title: 'UserName',
              width: '250px'
          }, {
              field: 'CreatedDate',
              title: 'Created Date',type: "date", format:'{0:'+config.dateFormat+'}',
              width: '200px'
          }, {
              field: 'Status',
              title: "Status",
              width: '200px',
          }]
      },
    
      Usercreation: function () {
          return [
           { template: '<div class="checkbox checkboxlable"><input type="checkbox" id="{{dataItem.Id}}" ng-checked="vm.selection.indexOf(dataItem.Id) > -1" ng-click="vm.toggleSelection(dataItem)"><label for=""></label></div>', "width": "40px" },
            {field: "FirstName", template: '<a href="" ng-click="vm.getViewMode(dataItem)">${FirstName}</a>',
            title: "Name", width: "200px", filterable: { cell: { operator: "contains" } }},
            {field: "Username",title: "Username/Email", width: "200px",filterable: {cell: {operator: "contains"}}},
            {field: "Status",title: "Status", width: "200px",filterable: {cell: {operator: "contains"}}}
          ]
      },
      Addrole: function () {
          return [
          { template: '<div class="checkbox checkboxlable" ng-disabled="dataItem.IsSystem"><input type="checkbox" id="{{dataItem.Id}}" ng-checked="vm.selection.indexOf(dataItem.Id) > -1" ng-click="vm.toggleSelection(dataItem)" ><label for=""></label></div>', "width": "20px" },
            { field: "Name", template: '<a href="" ng-click="vm.getViewMode(dataItem)" ng-disabled="dataItem.IsSystem">${Name}</a>', title: "Name", width: "150px", filterable: { cell: { operator: "contains" } } },
            {field: "ModuleName",title: 'ModuleName', width: "150px",filterable: {cell: {operator: "contains"}}}, 
            {field: "Status",title: "Status", width: "150px",filterable: {cell: {operator: "contains"}}},
            { field: "", title: 'System', template: '<a ng-show="dataItem.IsSystem"><i tooltip-placement="top" tooltip="This is System Account" class="fa fa-lock"></i></a><a ng-hide="dataItem.IsSystem"></a>', width: '50px' },
          ]
      },
      masterGrids: function(key) {
        switch (key.toLowerCase()) {
          
          case 'idtype':
              return [
             { template: '<div class="checkbox checkboxlable"><input type="checkbox" id="{{dataItem.Id}}" ng-checked="vm.selection.indexOf(dataItem) > -1" ng-click="vm.toggleSelection(dataItem.Id,dataItem.Status)"><label for=""></label></div>', "width": "30px" },

              { field: "Name", title: "Name",template: '<a href="" ng-click="vm.getViewMode(dataItem.Id)">${Name}</a>', filterable: { cell: { operator: "contains" } } },

            //{ field: "Name", title: "Name", template: '<a data-ng-click="vm.check()" ui-sref="admin.mastersetup.master({form:' + "'IdType'" + ', mode:' + "'view'" + ', id: dataItem.Id})" >${Name}</a>', width: "200px" },

            { field: "UserCreated", title: "User Created", width: "200px" },
            { field: "CreatedDate", title: "Date Of Creation",type: "date",format: '{0:'+config.dateFormat+'}', width: "200px"},
            {field: "Status",title: "Status", width: "200px"}
              ]
         //   break;
            case 'currencycode':
                return [
                     { template: '<div class="checkbox checkboxlable"><input type="checkbox" id="{{dataItem.Id}}" ng-checked="vm.selection.indexOf(dataItem) > -1" ng-click="vm.toggleSelection(dataItem.Id,dataItem.Status)"><label for=""></label></div>', "width": "30px" },
                      { field: "Code", title: "Code", template: '<a href="" ng-click="vm.getViewMode(dataItem.Id)">${Code}</a>', filterable: { cell: { operator: "contains" } } },
                    //{ field: 'Code', title: "Code", template: '<a data-ng-click="vm.check()" ui-sref="admin.master({form:' + "'CurrencyCode'" + ', mode:' + "'view'" + ', id: dataItem.Id})" >${Code}</a>', width: "100px" },
                    { field: "Name", title: "Name", width: "250px" },
                    { field: "Status", title: "Status", width: "200px" }
                ]
              //  break;
            case 'bankmaster':
                return [
                     { template: '<div class="checkbox checkboxlable"><input type="checkbox" id="{{dataItem.Id}}" ng-checked="vm.selection.indexOf(dataItem) > -1" ng-click="vm.toggleSelection(dataItem.Id,dataItem.Status)"><label for=""></label></div>', "width": "40px" },
                      { field: "Name", title: "Name", template: '<a href="" ng-click="vm.getViewMode(dataItem.Id)">${Name}</a>', filterable: { cell: { operator: "contains" } } },
                     //{ field: 'Name',title: "Name", template: '<a data-ng-click="vm.check()" ui-sref="admin.mastersetup.master({form:' + "'BankMaster'" + ', mode:' + "'view'" + ', id: dataItem.Id})" >${Name}</a>'},
                     { field: 'ShortCode', title: "ShortCode" },
                     { field: 'Status', title: "Status" }
                ]
          default:
            break;
        }
      }
    }
  })
})();
