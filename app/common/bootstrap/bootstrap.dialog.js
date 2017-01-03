(function () {
    'use strict';
    var bootstrapModule = angular.module('common.bootstrap', ['ui.bootstrap']);
    bootstrapModule.factory('bootstrap.dialog', ['$uibModal', '$templateCache', 'config', modalDialog]);
    function modalDialog($modal, $templateCache, config) {
        var service = {
            deleteDialog: deleteDialog,
            //deleteDialog1: deleteDialog1,
            confirmationDialog: confirmationDialog,
            primaryContact: primaryContact,
            servicedeleteDialog: servicedeleteDialog,
            servicedeleteDialog1: servicedeleteDialog1,
            confirmationDialogedi: confirmationDialogedi
        };

        $templateCache.put('modalDialogedit.tpl.html',
			'<div style="min-width:800px;" view-mode="true">' +
            '<div class="color-line"></div>'+
			'    <div class="modal-header" >' +
			'        <h4 class="row col-md-12">{{title}}</h4>' +
			'    </div>' +
      '<div class="tem-height">'+
             '<textarea kendo-editor ng-model="msgtext"></textarea>' +
			'    </div>' +
			'    <div class="modal-footer">' +
			//'        <button class="btn btn-ok" data-ng-click="ok()">{{okText}}<i class="ok-icon"></i></button>' +
			'        <button class="btn btn-cancel" ng-if="cancelText" data-ng-click="cancel()">{{cancelText}}<i class="cancel-icon"></i></button>' +
			'    </div>' +
			'</div>');


        $templateCache.put('modalDialog.tpl.html',
           '<div >' +
           '<div class="color-line"></div>'+
           '    <div class="modal-header" >' +
           '        <h4 class="ml-15">{{title}} {{FName}}</h4>' +
           '    </div>' +

           '<div class="col-md-12" id="validationDiv" ng-show="isValidationRequired">' +
           '<div class="alert alert-danger alert-dismissable">' +
               '<p ng-repeat="vms in validationMessages">' +
                   '<i class="fa fa-exclamation-circle"></i>{{vms}}' +
               '</p>' +
               //'<span style="padding-right:80px"></span>' +
           '</div>' +
       '</div>' +

           '    <br/>' +
          '        <p class="ml-15">{{message}}</p>' +
          '    </div>' +
           '    <div class="modal-footer">' +
           '        <button class="btn btn-ok" data-ng-click="ok()">{{okText}}<i class="ok-icon"></i></button>' +
           '        <button class="btn btn-cancel" ng-if="cancelText" data-ng-click="cancel()">{{cancelText}}<i class="cancel-icon"></i></button>' +
           '    </div>' +
           '</div>');
        $templateCache.put('isPrimaryContact.tpl.html',
        '<div>' +
        '    <div class="modal-header">' +
        '        <h4 class="row col-md-12">{{title}} - {{field1}}</h4>' +
        '    </div>' +
        '    <div class="modal-body">' +
        '    <br/>' +
        '        <p> {{message}} - {{field1}} ?</p>' +
        '    </div>' +
        '    <div class="modal-footer">' +
        '        <button class="btn btn-cancel" data-ng-click="cancel()">{{cancelText}}<i class="cancel-icon"></i></button>' +
        '        <button class="btn btn-ok" data-ng-click="ok()">{{okText}}<i class="ok-icon"></i></button>' +
        '    </div>' +
        '</div>');
        return service;

        function deleteDialog(itemName, Status) {

            var title = 'Confirm ' + Status
            itemName = itemName || 'item';
            var msg = 'Are you sure, do you want ' + Status + ' The ' + itemName + '?';
            return confirmationDialog(title, msg, 'ok', 'cancel');
        }
        function servicedeleteDialog(itemName, state, id) {
            var modalOptions = {
                //templateUrl: 'modalDialog1.tpl.html',
                templateUrl: 'modalDialog.tpl.html',
                controller: serviceDisableModalInstance,
                keyboard: true,
                resolve: {
                    options: function () {
                        return {
                            title: itemName,
                            message: state,
                            val: id,
                            //isLead:islead,
                            okText: "OK",
                            cancelText: "CANCEL"
                        };
                    }
                }
            };
            return $modal.open(modalOptions).result;
        }
        function servicedeleteDialog1(itemName, state, id) {
            var modalOptions = {
                templateUrl: 'modalDialog.tpl.html',
                controller: serviceDisableModalInstance1,
                keyboard: true,
                resolve: {
                    options: function () {
                        return {
                            title: itemName,
                            message: state,

                            val: id,
                            okText: "OK",
                            cancelText: "CANCEL"
                        };
                    }
                }
            };
            return $modal.open(modalOptions).result;
        }

        function confirmationDialog(title, msg, okText, cancelText, Name) {

            var modalOptions = {
                templateUrl: 'modalDialog.tpl.html',
                controller: ModalInstance,
                keyboard: true,
                resolve: {
                    options: function () {
                        return {
                            title: title,
                            message: msg,
                            okText: okText,
                            cancelText: cancelText,
                            FName: Name,
                        };
                    }
                }
            };
            return $modal.open(modalOptions).result;
        }

        function confirmationDialogedi(title, msg, okText, cancelText, isview,tempId) {
            var modalOptions = {
                templateUrl: 'modalDialogedit.tpl.html',
                controller: ModalInstanceedit,
                keyboard: true,
                resolve: {
                    options: function () {
                        return {
                            title: title,
                            message: msg,
                            okText: okText,
                            cancelText: cancelText,
                            isview: isview,
                            tempId: tempId,
                        };
                    }
                }
            };
            return $modal.open(modalOptions).result;
        }
        function primaryContact(field1, title, msg, okText, cancelText) {
            var modalOptions = {
                templateUrl: 'isPrimaryContact.tpl.html',
                controller: ModalInstanceisPrimaryContact,
                keyboard: true,
                resolve: {
                    options: function () {
                        return {
                            field1: field1,
                            title: title,
                            message: msg,
                            okText: okText,
                            cancelText: cancelText,
                        };
                    }
                }
            };
            return $modal.open(modalOptions).result;
        }
    }

    //used in service screen Key Terms & Conditions,Standard Terms & Conditions,Quotation Template
    var ModalInstanceedit = ['$scope', '$uibModalInstance', 'options', '$rootScope','serviceFactory',
    function ($scope, $modalInstance, options, $rootScope, serviceFactory) {
        $scope.title = options.title || 'Title';
        $scope.msgtext = options.message || '';
        $scope.okText = options.okText || 'OK';
        $scope.isView = options.isview === "view" ? true : false;
        $scope.cancelText = options.cancelText;
        $scope.tempId = options.tempId;
        //serviceFactory.getTemplatedata($scope.tempId).then(function (response) {
        //    $scope.msgtext = response.data;
          
        //});
        $scope.$on("kendoWidgetCreated", function (event, widget) {
            if ($scope.isView) {
                widget.body.contentEditable = false;
            }
        });
        $scope.ok = function () {
            $rootScope.mesgmodel = $scope.msgtext;
            $modalInstance.close('ok');
        };
        $scope.cancel = function () { $modalInstance.close('cancel'); };
    }];

    var ModalInstance = ['$scope', '$uibModalInstance', 'options', '$rootScope',
    function ($scope, $modalInstance, options, $rootScope) {
        $scope.title = options.title || 'Title';
        $scope.message = options.message || '';
        $scope.FName = options.FName || '';
        $scope.okText = options.okText || 'OK';
        $scope.cancelText = options.cancelText;

        $scope.ok = function () {
            //$rootScope.mesgmodel = $scope.msgtext;
            $modalInstance.close('ok');
        };
        $scope.cancel = function () { $modalInstance.close('cancel'); };
    }];
    var serviceDisableModalInstance = ['$scope', '$rootScope', '$uibModalInstance', 'options', 'serviceGroupFactory', 'leadAccountDataContext',
       function ($scope, $rootScope, $modalInstance, options, serviceGroupFactory, leadAccountDataContext) {
           if (options.title === "lead") {
               $scope.statemesg = "Delete";
               $scope.screenname = "Lead"
           } else {
               $scope.screenname = "Service Group";
               if (options.message == "Active") {
                   $scope.statemesg = "Inactive"
               } else {
                   $scope.statemesg = "Active"
               }
           }

           $scope.title = " Confirm " + $scope.statemesg || 'Title';
           $scope.message = 'Are you sure, do you want to ' + $scope.statemesg + ' The ' + $scope.screenname;
           $scope.status = options.message;

           $scope.okText = options.okText || 'OK';
           $scope.cancelText = options.cancelText;
           $scope.isValidationRequired = false;
           $scope.validationMessages = [];
           $scope.value = options.val;

           $scope.ok = function () {
               if ($scope.screenname === "Lead") {
                   leadAccountDataContext.LeadDeleteData($scope.value).success(function (response) {
                       $rootScope.$broadcast('closemodel', { data: { status: 'saveContact' } });
                       $modalInstance.close('ok');
                   }).error(function (error) {
                       $scope.isValidationRequired = true;
                       $scope.validationMessages.push(error)
                       return
                   })

               } else {
                   serviceGroupFactory.enableData($scope.value, $scope.status).then(function (response) {
                       if (response.data == "Update Successfull") {
                           $rootScope.$broadcast('closemodel', { data: { status: 'saveContact' } });
                           $modalInstance.close('ok');
                           return
                       }
                       else {
                           $scope.isValidationRequired = true;
                           $scope.validationMessages.push(response.data)
                           return;
                       }
                   });
               }

           };
           $scope.cancel = function () {

               $rootScope.$broadcast('closemodel', { data: { status: 'saveContact' } });
               $modalInstance.close('cancel');
           };
       }];


    var serviceDisableModalInstance1 = ['$scope', '$rootScope', '$uibModalInstance', 'options', 'serviceFactory',
      function ($scope, $rootScope, $modalInstance, options, serviceFactory) {
          //$scope.title = "Confirm Service Group "  || 'Title';
          if (options.status) {

          }
          if (options.message == "Active") {
              $scope.statemesg = "Inactive"
          } else {
              $scope.statemesg = "Active"
          }
          $scope.title = " Confirm " + $scope.statemesg || 'Title';
          $scope.message = 'Are you sure, do you want to ' + $scope.statemesg + ' The Service';
          $scope.status = options.message;
          $scope.okText = options.okText || 'OK';
          $scope.cancelText = options.cancelText;
          $scope.isValidationRequired = false;
          $scope.validationMessages = [];
          $scope.value = options.val;

          $scope.ok = function () {

              serviceFactory.enableData1($scope.value, $scope.status).then(function (response) {

                  // alert(response.data);
                  if (response.data == "Update Successfull") {
                      $rootScope.$broadcast('closemodel', { data: { status: 'saveContact' } });
                      $modalInstance.close('ok');
                      return
                  }
                  else {
                      $scope.isValidationRequired = true;
                      $scope.validationMessages.push(response.data)
                      //  alert(response.data);
                      return;
                  }
              });
          };
          $scope.cancel = function () {
              $rootScope.$broadcast('closemodel', { data: { status: 'saveContact' } });
              $modalInstance.close('cancel');
          };
      }];
    var ModalInstanceisPrimaryContact = ['$scope', '$uibModalInstance', 'options',
		function ($scope, $modalInstance, options) {
		    $scope.field1 = options.field1 || 'Title';
		    $scope.title = options.title || 'Title';
		    $scope.message = options.message || '';
		    $scope.okText = options.okText || 'OK';
		    $scope.cancelText = options.cancelText || 'Cancel';
		    $scope.ok = function () { $modalInstance.close('Yes'); };
		    $scope.cancel = function () { $modalInstance.close('No'); };
		}];
})();
