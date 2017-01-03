(function() {
    'use strict';

    angular
        .module('ContactGridDirapp')
        .directive('zContactGrid', contactGrid);

    contactGrid.$inject = ['$window'];
    
    function contactGrid ($window) {
        
        return {
            restrict: 'E',
            scope: {
                contactgridobject: '=',
                contactActions:'=',
                contactInfo:'='
            },
            controllerAs: 'vm',
            templateUrl: "CustomDirectives/contactGridDirective/newcards.html",
            controller: function ($http, $scope, $rootScope, config, serviceConfig, contactGridFactory, commonService, $moment, $stateParams, $state) {
            
              if(typeof($scope.contactgridobject) == "string"){
              contactGridFactory.createContact().success(function (response) {
                 $scope.contactgridobject = response;
             });}else{
                 $scope.contactgridobject;
             }

                $scope.$watch(function () {
                    return $scope.contactgridobject;
                }, function (newContactObj1) {
                    if ($scope.contactgridobject) {
                            _getContactAssociationsDto();
                    }
                })

                $scope.$on("refreshContactCards", function (event, args) {
                        _getContactAssociationsDto();
                });

                function _getContactAssociationsDto() {
                    $scope.contactsSection1 = [];
                    $scope.contactsSection2 = [];
                    for (var i = 0; i <= $scope.contactgridobject.length - 1; i++) {
                        if ($scope.contactgridobject[i].Communication === null) {
                            $scope.contactgridobject[i].Communication = "]";
                        }
                        $scope.contactgridobject[i].Communications = commonService.getCommunicationjsonObject($scope.contactgridobject[i].Communication);
                        // if ((i + 1) % 2 != 0) {
                        //     $scope.contactgridobject[i].Communications = commonService.getCommunicationjsonObject($scope.contactgridobject[i].Communication);
                        
                        //     $scope.contactsSection1.push($scope.contactgridobject[i]);
                        // }
                        // else {
                        //     $scope.contactgridobject[i].Communications = commonService.getCommunicationjsonObject($scope.contactgridobject[i].Communication);
                        
                        //     $scope.contactsSection2.push($scope.contactgridobject[i])
                        // }
                    }
                }

                $scope.getContactMatters = function (id) {                  
                }

                $scope.getContactAssociations = function (id) {
                    if ($scope.contactActions.isshowassociations) {
                         contactGridFactory.getAssociations(id).success(function (response) {
                        $scope.contactAssociations = response;
                         $scope.contactAssociations= contactGridFactory.getContactAssValidation($scope.contactAssociations,$scope.contactgridobject,id);
                        return response;
                       })
                    }
                }
                $scope.getContactLeadAssociations = function (id,Leadid) {
                    if ($scope.contactActions.isshowassociations) {
                        contactGridFactory.getleadAssociations(id, Leadid).success(function (response) {
                            $scope.contactAssociations = response;
                           $scope.contactAssociations= contactGridFactory.getContactleadAssoValidations($scope.contactAssociations,$scope.contactgridobject,id);
                          
                            return response;
                        })
                    }
                }

                $scope.deleteContact = function (contact) {
                    $rootScope.$broadcast('operateContact', { data: { status: 'deleteContact', state: 'delete', contactdata: contact } });
                    $scope.contactType = $state.current.data.pageTitle;
                    //  $scope.contactType = $state.current.data.pageTitle.indexOf('Lead')!=-1?'Lead':'Vendor';  // Todo
                    //added if only workflow delete 
                    if($scope.contactActions.isshowprimarybtn==false){
                        var j=0;
                          for(var i=0;i<$scope.contactgridobject.length;i++){
                              if($scope.contactgridobject[i].Status=="Active"){
                                      j++;
                              }
                          }
                          if(j==1 && contact.Status=="Active"){
                                 return commonService.confirmationDialog('Alert!', 'Atleast one contact is in Active state so you can not delete it.', 'Ok');
                          }
                    }
                    if ($scope.contactgridobject.length == 1 && !contact.IsPrimaryContact) {
                        return commonService.confirmationDialog('Alert!', 'Atleast one contact is mandotary', 'Ok');
                    }
                    if ($scope.contactgridobject.length == 1 && !contact.IsPrimaryContact) {
                        return commonService.confirmationDialog('Alert!', 'Atleast one contact is mandotary', 'Ok');
                    }
                    if (contact.IsPrimaryContact) {
                        return commonService.confirmationDialog('Alert!', 'Primary Contact cannot be deleted.', 'Ok');
                    } 
                    else if(contact.IsReminderReceipient){
                        return commonService.confirmationDialog('Alert!', 'Reminder Recipient cannot be deleted.', 'Ok');
                    }
                    else {
                        commonService.confirmationDialog('Confirm Delete', 'Do you really want to delete this contact?', 'Ok', 'Cancel').then(function (res) {
                            if (res === 'ok') {
                                return contactGridFactory.deleteContact(contact.ContactId, contact.AccountId, $scope.contactType).then(function (ok) {
                                    angular.forEach($scope.contactgridobject, function (index,key) {
                                        if (index.ContactId === contact.ContactId) {
                                            $scope.contactgridobject.splice(key, 1);
                                            _getContactAssociationsDto();
                                        }
                                    })
                                });
                            }
                        })
                    }
                }

                $scope.editContact = function (contact) {
                    $rootScope.$broadcast('operateContact', { data: { status: 'editContact', state: 'edit', contactdata: contact } });
                }

                $scope.viewContact = function (contact) {
                    $rootScope.$broadcast('operateContact', { data: { status: 'editContact', state: 'view', contactdata: contact } });
                }

                $scope.pingAssosiation = function (obj, contactAssObj) {
                     if (!obj.IsPinned) {
                         contactGridFactory.savePingAssosiation(obj).success(function (responce) {
                             commonService.notify.success("Saved Data");
                         })
                    for (var i = 0; i <= $scope.contactgridobject.length - 1; i++) {
                        if ($scope.contactgridobject[i].ContactId === obj.ContactId) {
                            $scope.contactgridobject[i].CompanyName = obj.AccountName;
                            $scope.contactgridobject[i].Designation = obj.Designation;
                            $scope.contactgridobject[i].Communications = obj.Communications;
                            for (var j = 0; j <= $scope.contactgridobject[i].Assosiations.length - 1; j++) {
                                if ($scope.contactgridobject[i].Assosiations[j].AccountName === obj.AccountName) {
                                    $scope.contactgridobject[i].Assosiations[j].IsPinned = true;
                                } else {
                                    $scope.contactgridobject[i].Assosiations[j].IsPinned = false;
                                }
                            }

                        }

                    }
                  }
                }
            },
            link: function (scope, ele, attr) {
            }

        }
    }

})();