(function () {
    'use strict';

    angular
        .module('employeeprofile')
        .controller('employeeprofileController', employeeprofileController);

    employeeprofileController.$inject = ['employeeprofileFactory', 'config', 'serviceConfig', '$rootScope', 'formValidate', '$state', '$stateParams', 'commonService', '$scope'];

    function employeeprofileController(employeeprofileFactory, config, serviceConfig, $rootScope, formValidate, $state, $stateParams, commonService, $scope) {
        /* jshint validthis:true */
        var vm = this;
        $scope.format = config.dateFormat;
        vm.isView = $stateParams.IsView === 'true' ? true : false;
        vm.isEdit = $stateParams.Id == 'new' ? false : true;
        vm.adId = $stateParams.Id;     
        vm.imgUrl = "images/userprofile.png";
      // document.getElementById('img').innerHTML = '<img src="' + vm.imgUrl + '" alt="sa" />';
        vm.tabs = employeeprofileFactory.prev_tabs();
        vm._prevTab = employeeprofileFactory.prev_tabs();
        vm.tabClickHandler = tabClickHandler;
        vm.saveEmployeeDetails = saveEmployeeDetails;
        vm.saveEmployment = saveEmployment;
        vm.userNames = userNames;
        vm.addServiceGroup = addServiceGroup;
        vm.deleteServiceGroup = deleteServiceGroup;
        vm.saveServiceGroups = saveServiceGroups;
        vm.removeEntityId = removeEntityId;
        vm.cancel = cancel;
        vm.errormsg=errormsg;
        vm.levelChange=levelChange;
        vm.loadDepartmentLevels=loadDepartmentLevels;
        vm.loadLevels=loadLevels;
        vm.effectiveFrom=effectiveFrom;
        vm.validationText1=validationText1;
        vm.duplicateService=duplicateService;
         $scope.currency=config.currency;
        activate();
        function activate() {
            _getByIds();
        }
         vm.isDisable=$stateParams.Id === 'new' ? true : false;
         $scope.dateformate = config.dateFormat;
         $scope.dobOpen = [];
        $scope.openedstart = [];
        $scope.openedend = [];
        $scope.open = function (index) {
            $scope.dobOpen[index] = true;
        }
        $scope.open1 = function (index) {
            $scope.openedstart[index] = true;
        };
        $scope.open2 = function (index) {
            $scope.openedend[index] = true;
        };
         vm.addDepartmentDatails=function()
        { 
             vm.employment.push(employeeprofileFactory.getEmploymentGroupObj());
        } 
        //delete row
        vm.deleteEmployement=function(employment,idx)
        {
            if(employment.Id==='00000000-0000-0000-0000-000000000000'){
            vm.employment.splice(idx,1);
            }
            else{
           employment.RecordStatus= 'Deleted';
            }
        }
         function loadDepartmentLevels(index,id){
               //vm.employment[index].ChargeOutRate='';
         return employeeprofileFactory.loadDesignations(id,vm.departmentLookups);
         }
        function loadLevels(index,deptid,id,code){
              if(!code){ vm.employment[index].ChargeOutRate='';}
           var designations=employeeprofileFactory.loadDesignations(deptid,vm.departmentLookups);
           return employeeprofileFactory.loadLevels(id,designations);          
         }
        function levelChange(index,code,id,deptid){
            if(!code){vm.employment[index].ChargeOutRate='';}
             var designations=employeeprofileFactory.loadDesignations(deptid,vm.departmentLookups);
            var level=employeeprofileFactory.loadLevels(id,designations);
             vm.employment[index].ChargeOutRate=employeeprofileFactory.chargeOutRange(level,code);
        }
        //getby id call
        function _getByIds() {
            //usename and nationality dropdown data
            var eid=$stateParams.Id == 'new' ? null : $stateParams.Id;
            employeeprofileFactory.getlookups(eid).success(function (response) {
                vm.UserNames = response.UserNames;
                vm.Gender = response.Genders.Lookups;
                vm.Nationality = response.Nationality.Lookups;
                vm.company = response.CompanyNames;
                vm.currency = response.Currencies;
                vm.departmentLookups=response.Departments;
            })
            employeeprofileFactory.getEmployment().success(function (response) {
                //vm.employement=data;
                vm.departments = response.Departments;
                vm.designation = response.Designations;                         
                vm.levels = response.LevelRatesLookUp;
                employeeprofileFactory.getServiceGroup().success(function (response) {
                    vm.servicegroup = response;
                })
            })
            employeeprofileFactory.createEmployeeDetails(vm.adId).then(function (response) {
                document.getElementById('img').innerHTML = '<img src="' + vm.imgUrl + '" alt="sa" />';
                vm.employeeprofileobj = response.data;              
                //tabClickHandler('employeeDetalis');
                vm.employeestartdate = vm.employeeprofileobj.EmploymentStartDate;
                if (vm.employeestartdate) {
                    vm.employeestartdate = angular.copy(new Date(vm.employeestartdate));
                }
                $rootScope.$broadcast('setCommunication');
                vm.imgUrl = vm.employeeprofileobj.Small;
                if (vm.employeeprofileobj.Small) {
                   document.getElementById('img').innerHTML = '<img src="' + vm.imgUrl + '" alt="sa" />';
                }
                vm.AddrObj = { EmployeeName: vm.employeeprofileobj.EmployeeName, Username: vm.employeeprofileobj.Username, PhotoId: vm.employeeprofileobj.PhotoId, Status: false, Small: vm.employeeprofileobj.Small, Addresses: vm.employeeprofileobj.Addresses, Communication: vm.employeeprofileobj.Communication, Phone: vm.employeeprofileobj.Phone, Website: vm.employeeprofileobj.Website }
                return response.data;
            });
        }
   
       //onchange username functionality
        vm.userNames = {
            select: userNames
        }
        function userNames(e) {
                var selectedItem = this.dataItem(e.item.index());
                vm.employeeprofileobj.userId = selectedItem.Id;
                vm.imgUrl = selectedItem.Small;
                vm.employeeprofileobj.Small = selectedItem.Small;
               // vm.mediaRepoId = selectedItem.Id;
                vm.employeeprofileobj.PhotoId = selectedItem.PhotoId;
                document.getElementById('img').innerHTML = '<img src="' + vm.imgUrl + '" alt="sa" />';
                //alert(vm.employeeprofileobj.userId)
                }
        function _getPreTab() {
            var _preTab = null;
            for (var key in vm._prevTab) {
                if (vm._prevTab[key]) {
                    _preTab = key;
                }
            }
            return _preTab;
        }
        function removeEntityId(e) {
            vm.employeeprofileobj.userId = null;
          //  alert(vm.employeeprofileobj.userId)
        }
        function tabClickHandler(tabName) {
            var oldTab = _getPreTab();
            switch (tabName) {
                case 'employeeDetalis':
                    
                    break;
                case 'employment':
                   vm.adId = vm.adId == "new" ? vm.employeeprofileobj.Id : vm.adId;
                    employeeprofileFactory.createEmployment(vm.adId).then(function (response) {
                        vm.employment = response.data;
                       //  vm.levels= employeeprofileFactory.deplevel();
                         
                       // vm.employment.Department = response.data ? response.data : []
                        if (vm.isEdit) {                           
                            angular.forEach(vm.employment, function (index, key) {
                                vm.employment[key].EffectiveFrom = vm.employment[key].EffectiveFrom ? new Date(vm.employment[key].EffectiveFrom) : null;
                                vm.employment[key].EndDate = vm.employment[key].EndDate ? new Date(vm.employment[key].EndDate) : null;
                              //  vm.employment.Department[key].CompanyId = vm.employment.Department[key].CompanyId ? vm.employment.Department[key].CompanyId.toString() : vm.employment.Department[key].CompanyId;
                                 vm.employment[key].LevelRank = vm.employment[key].LevelRank ? vm.employment[key].LevelRank.toString() : '';
                            });
                            if(!vm.imgUrl){vm.imgUrl="images/userprofile.png";}
                            vm.employeeprofileobj.Small = vm.employeeprofileobj.Small == null ? vm.imgUrl : vm.employeeprofileobj.Small
                            document.getElementById('img').innerHTML = '<img src="' + vm.employeeprofileobj.Small + '" alt="sa" />';
                        }
                         angular.forEach(vm.employment, function (index, key) {
                        vm.employment[key].EffectiveFrom = vm.employment[key].EffectiveFrom ? new Date(vm.employment[key].EffectiveFrom) : null;
                         vm.employment[key].EndDate = vm.employment[key].EndDate ? new Date(vm.employment[key].EndDate) : null;
                    });
                         
                        vm.departmentOptions = employeeprofileFactory.departmentGridOptions(vm.company, vm.departments, vm.designation, vm.levels, vm.currency, vm.isView);
                       // vm.levels= employeeprofileFactory.levels();
                        
                    })
                    break;
                case 'serviceGroups':
                    vm.adId = vm.adId == "new" ? vm.employeeprofileobj.Id : vm.adId;
                    employeeprofileFactory.createServiceGroup(vm.adId).then(function (response) {
                        vm.serviceGroupObj = response.data;
                        //vm.servicegroup = response.data;
                        //vm.servicegroups.ServiceGroups = response.data.ServiceGroups ? response.data.ServiceGroups : [];
                        //angular.forEach(vm.servicegroups.ServiceGroups, function (index, key) {
                        //    vm.servicegroups.ServiceGroups[key].ServiceGroupId = vm.servicegroups.ServiceGroups[key].ServiceGroupId ? vm.servicegroups.ServiceGroups[key].ServiceGroupId.toString() : vm.servicegroups.ServiceGroups[key].ServiceGroupId;
                        //});
                        //vm.servicegroupOptions = employeeprofileFactory.serviceGroupGridOptions(vm.servicegroup, vm.isView);
                    })
                    break;
            }
        }
        $scope.$on('Department_DepartmentId_changed', function (event, args) {
            var _index = vm.employment.Department.indexOf(args.data.dataItem);
            if (_index == -1) {
                return;
            }
            if (args.data.value.length != 0) {
                vm.employment.Department[_index].DepartmentId = args.data.value[0].Id;
                vm.employment.Department[_index].DepartmentName = args.data.value[0].Name;
            }
        });
        $scope.$on('Department_DepartmentDesignationId_changed', function (event, args) {
            var _index = vm.employment.Department.indexOf(args.data.dataItem);
            if (_index == -1) {
                return;
            }
            if (args.data.value.length != 0) {
                vm.employment.Department[_index].DepartmentDesignationId = args.data.value[0].Id;
                vm.employment.Department[_index].DesignationName = args.data.value[0].Name;
            }
        
        });
        $scope.$on('Department_CompanyId_changed', function (event, args) {
           var _index = vm.employment.Department.indexOf(args.data.dataItem);
            if (_index == -1) {
                return;
            }
            if(args.data.dataItem.CompanyId){
                var company=vm.company.filter(function(val){
                   return val.Id==args.data.dataItem.CompanyId;
                });
               vm.employment.Department[_index].CompanyName=company[0].Name;
            }
        });
        //save function for employee details tab
        function saveEmployeeDetails() {
            //  $rootScope.$broadcast('checkAddrBook');
            vm.validationMessages = [];
            var typeMissing = [];
            vm.isValidationRequired = false;
            var validateResult = formValidate.validate('EmployeeDetailsForm');
            if (validateResult.isValidationRequired || $rootScope.isCommunicationValidationRequired || $rootScope.isPostValRequired) {
                vm.validationMessages.push({ validationText: 'Invalid data, Please Verify !' })
                vm.isValidationRequired = true;
                window.scrollTo(0, 0);
            }
            else {
                if (vm.isFileUploaded) {
                    vm.employeeprofileobj.PhotoId = vm.mediaRepoId;
                } else { vm.employeeprofileobj.PhotoId = vm.employeeprofileobj.PhotoId; }
                if (vm.isEdit) {
                    vm.employeeprofileobj.ModifiedDate = new Date();
                    vm.employeeprofileobj.ModifiedBy = config.Username;
                }
                 for (var i = 0; i < vm.UserNames.length; i++) {
                vm.employeeprofileobj.UserName = document.getElementById("userName").value;
                var count = 0;
                if (vm.employeeprofileobj.UserName == vm.UserNames[i].Code) {
                    count = 1;
                   vm.LookUp = false;
                    //vm.isValidationRequired = false;
                   // vm.tabs.employment = true;
                    break;
                }
            }
            if (count == 0) {
                vm.tabs.employeeDetalis = true;
                vm.LookUp = true;
                return;
            }
            if (!vm.isEdit) {
              vm.employeeprofileobj.UserCreated = config.userName;
              vm.employeeprofileobj.CreatedDate = new Date();
             }
            else{
                vm.employeeprofileobj.ModifiedDate = new Date();
                vm.employeeprofileobj.ModifiedBy = config.userName;
            }
                //vm.employeeprofileobj.Status = "Active";
                employeeprofileFactory.saveEmployeeDetails(vm.employeeprofileobj).success(function (response) {
                      if(vm.isEdit){
                        $state.go("admin.wfconfigurations.employeeprofiles");
                       }else{
                    vm.tabs.employment = true;
                     vm.isDisable= false;
                    tabClickHandler('employment');
                       }
                }).error(function (data) {
                    vm.validationMessages.push({ validationText: data.Message });
                    vm.isValidationRequired = true;
                    window.scrollTo(0, 0);
                });
            }
        } 
        function validationText1(msg) {
          vm.isValidationRequired1 = true;
            vm.validationText1 = msg;
        }
function effectiveFrom(effectiveFrom){
    if(effectiveFrom){
 for(var i = 0; i <= vm.employment.length - 1; i++){
    if(vm.employment[i+1] && vm.employment[i+1]!='Deleted') {
                  if(vm.employment[i+1].EffectiveFrom){
                      var temp = new Date(vm.employment[i+1].EffectiveFrom);
                     // if(!vm.employment[i].EndDate){
                           vm.employment[i].EndDate=new Date(temp.setDate(temp.getDate()-1));
                         //  }
                  }
                  if(vm.employment[i].EffectiveFrom>=vm.employment[i+1].EffectiveFrom){
   vm.isValidationRequired1 = true;
   return validationText1( "Effective From is repeating please check");
                  }
                  else{
                      vm.isValidationRequired1 = false;
                  }
    }
            }
             }
  }
        //save function for employment tab
        function saveEmployment() {
           // vm.validationMessages1 = [];
            //  if (formValidate.validate('EmploymentForm').isValidationRequired === true) {
            //     validationText1("Invalid data, Please Verify !");
            //     return;
            // }
            for (var i = 0; i <= vm.employment.length - 1; i++) {
                vm.employment[i].EmployeeId = vm.employeeprofileobj.Id;
                if (!vm.isEdit) {
                   // vm.employment.Department[i].Id = commonService.guid();
                }
            }
             for(var i = 0; i <= vm.employment.length - 1; i++){
                  if(!vm.employment[i].EffectiveFrom && vm.employment[i].RecordStatus!='Deleted'){
                          vm.isValidationRequired1 = true;
                          return validationText1( 'EffectiveFrom  is requried')
                  }
                  else{
                       vm.isValidationRequired1 = false;
                  }
            }
            for (var i = 0; i <= vm.employment.length-1; i++) {
                if (!vm.employment[i].CompanyId || !vm.employment[i].DepartmentId || vm.employment[i].DepartmentId==="00000000-0000-0000-0000-000000000000" || !vm.employment[i].DepartmentDesignationId || vm.employment[i].DepartmentDesignationId==='00000000-0000-0000-0000-000000000000' && vm.employment[i].RecordStatus!='Deleted') {
                  vm.isValidationRequired1 = true;
                    return validationText1('Designation Details is requried')
                    
                }
              else{                  
                    vm.isValidationRequired1 = false;
                    }
                     }
//                      for(var i = 0; i <= vm.employment.Department.length - 1; i++){
//                   if(vm.employment.Department[i].EffectiveFrom>=vm.employment.Department[i+1].EffectiveFrom){
//  vm.validationMessages1.push({ validationText1: 'Effective should not be same and greater' })
//                     vm.isValidationRequired1 = true;
//                     return;
// //return errormsg("Effective should not be same and greater");
//                   }
//             }
for(var i = 0; i <= vm.employment.length - 1; i++){
    if(vm.employment[i+1] && vm.employment[i+1]!='Deleted') {
                  if(vm.employment[i+1].EffectiveFrom){
                      var temp = new Date(vm.employment[i+1].EffectiveFrom);
                      if(!vm.employment[i].EndDate){
                           vm.employment[i].EndDate=new Date(temp.setDate(temp.getDate()-1));}
                  }
                  if(vm.employment[i].EffectiveFrom>=vm.employment[i+1].EffectiveFrom){
   vm.isValidationRequired1 = true;
   return validationText1( "Effective From is repeating please check");
                  }
                  else{
                      vm.isValidationRequired1 = false;
                  }
    }
            }
            
                      if(employeeprofileFactory.check_endDate(vm.employment)){
                          vm.isValidationRequired1 = true;
                          return validationText1('End Date is not properly please fill');
           }else{ vm.isValidationRequired1 = false;

           }
        
                    employeeprofileFactory.saveEmployment(vm.employment).then(function (response) {
                       if(vm.isEdit){
                        $state.go("admin.wfconfigurations.employeeprofiles");
                       }else{
                           
                        vm.tabs.serviceGroups = true;
                        tabClickHandler('serviceGroups');
                       }
                    })      
           
        }     
        function addServiceGroup() {
            vm.serviceGroupObj.ServiceGroups = vm.serviceGroupObj.ServiceGroups ? vm.serviceGroupObj.ServiceGroups : [];
            vm.serviceGroupObj.ServiceGroups.push(employeeprofileFactory.getserviceGroupObj());
            for (var i = 0; i <= vm.serviceGroupObj.ServiceGroups.length - 1; i++) {
                if (vm.serviceGroupObj.ServiceGroups[i].IsDefault === '') { vm.serviceGroupObj.ServiceGroups[i].IsDefault = 0 }
               // if (vm.serviceGroupObj.ServiceGroups[i].ServiceGroupId === '') { vm.serviceGroupObj.ServiceGroups[i].ServiceGroupId = 0 }
            }
        }
        function deleteServiceGroup(servicegroup, index) {
             if(servicegroup.Id==='00000000-0000-0000-0000-000000000000'){
           vm.serviceGroupObj.ServiceGroups.splice(index,1);
            }
            else{
                 if(!servicegroup.ServiceGroupId){
                    servicegroup.ServiceGroupId=0;
                }
                  vm.errorCal = false;
           servicegroup.RecordStatus= 'Deleted';
            }
            //servicegroup.RecordStatus = "Deleted";
        }
          function errormsg(msg) {
            vm.errorCal = true;
            vm.dataerror = msg;
        }
        function duplicateService(){
             if(employeeprofileFactory.check_servicegroups(vm.serviceGroupObj.ServiceGroups)){
               vm.serviceLookUp=true;
               //errormsg("ServiceGroupes should not be Duplicate");
               return
           }else{vm.serviceLookUp=false;}
        }
        //save function for service groups tab
        function saveServiceGroups() {
            vm.validationMessages1=[];
            vm.isValidationRequired1 = false;
            vm.serviceGroupObj.EmployeeId = vm.employeeprofileobj.Id;
            for (var i = 0; i <= vm.serviceGroupObj.ServiceGroups.length - 1; i++) {
                vm.serviceGroupObj.ServiceGroups[i].EmployeeId = vm.employeeprofileobj.Id;
                //vm.serviceGroupObj.ServiceGroups[i].Id = vm.serviceGroupObj.ServiceGroups[i].RecordStatus == null||vm.serviceGroupObj.ServiceGroups[i].RecordStatus== "Deleted" ? vm.serviceGroupObj.ServiceGroups[i].Id : commonService.guid();
            }
          //  vm.serviceGroupObj.ServiceGroups.indexOf(i)
            vm.duplicateObj=vm.serviceGroupObj.ServiceGroups.length;
            if(vm.serviceGroupObj.ServiceGroups){
             for(var i = vm.serviceGroupObj.ServiceGroups.length-1; i >= 0 ; i--){
    if( vm.serviceGroupObj.ServiceGroups[i].Id==='00000000-0000-0000-0000-000000000000' && !vm.serviceGroupObj.ServiceGroups[i].ServiceGroupId && !vm.serviceGroupObj.ServiceGroups[i].IsDefault && vm.serviceGroupObj.ServiceGroups[i].RecordStatus==='Added'){
           vm.serviceGroupObj.ServiceGroups.splice(i,1);
            }
//             if(vm.serviceGroupObj.ServiceGroups[i].Id!='00000000-0000-0000-0000-000000000000'&& !vm.serviceGroupObj.ServiceGroups[i].ServiceGroupId && !vm.serviceGroupObj.ServiceGroups[i].IsDefault){
//  vm.serviceGroupObj.ServiceGroups[i].RecordStatus='Deleted';
//             }
         }
         }
            var serviceGroup=vm.serviceGroupObj.ServiceGroups;
           if(employeeprofileFactory.check_servicegroups(vm.serviceGroupObj.ServiceGroups)){
               vm.serviceLookUp=true;
               //errormsg("ServiceGroupes should not be Duplicate");
               return
           }else{vm.serviceLookUp=false;}
            if(vm.serviceGroupObj.ServiceGroups){
             for(var i = vm.serviceGroupObj.ServiceGroups.length-1; i >= 0 ; i--){
    if( vm.serviceGroupObj.ServiceGroups[i].Id!='00000000-0000-0000-0000-000000000000' && !vm.serviceGroupObj.ServiceGroups[i].ServiceGroupId && vm.serviceGroupObj.ServiceGroups[i].IsDefault===false){
           vm.serviceGroupObj.ServiceGroups[i].ServiceGroupId=0;
           vm.serviceGroupObj.ServiceGroups[i].RecordStatus='Deleted';
            vm.errorCal = false;
            }
             }
            }
            for (var i = 0; i <= vm.serviceGroupObj.ServiceGroups.length-1;i++){
//                    if(vm.serviceGroupObj.ServiceGroups[i].Id!='00000000-0000-0000-0000-000000000000'&& !vm.serviceGroupObj.ServiceGroups[i].ServiceGroupId && vm.serviceGroupObj.ServiceGroups[i].IsDefault===false){
//   vm.serviceGroupObj.ServiceGroups[i].RecordStatus='Deleted';
//             }

                if(vm.serviceGroupObj.ServiceGroups[i].RecordStatus!='Deleted'){
            if(vm.serviceGroupObj.ServiceGroups[i].IsDefault===true && !vm.serviceGroupObj.ServiceGroups[i].ServiceGroupId){
 return errormsg("Please select ServiceGroup");
            }
            else{
                   vm.errorCal = false;
            }
            }
         }
         
         
         employeeprofileFactory.saveServiceGroup(vm.serviceGroupObj).then(function (response) {
         commonService.notify.success("Saved data  Successfully");
                   // var params = $rootScope.prevUrlParam;
                  // $state.go($rootScope.prevUrl, params);
                  $state.go("admin.wfconfigurations.employeeprofiles");
            })                            
        }
        //fileupload
       $('#invalid').addClass('hide');
      vm.isValid=false;
      vm.photoUplodOptions= {
            async: {
                saveUrl: serviceConfig.checkRemoteServer + "/breeze/azurestorage/uploadlogo",
                removeUrl: serviceConfig.checkRemoteServer + "/breeze/azurestorage/deletelogo",
                autoUpload: true
            },
             localization: {
             select: 'upload photo'
             },
            select: onFileSelect,
            success: onSuccess
        }
     // $('.k-upload-button span').text('Upload photo');
        function onSuccess(e) {
            $('#invalid').removeClass('show');
            $('#invalid').addClass('hide');
           vm.isFileUploaded = true;
            vm.imgUrl = e.response.Small;
            vm.employeeprofileobj.Small = e.response.Small
            vm.mediaRepoId = e.response.Id;
            vm.employeeprofileobj.PhotoId = vm.mediaRepoId;
            document.getElementById('img').innerHTML = '<img src="' + vm.imgUrl + '" alt="sa" />';
        }
        function onFileSelect(e) {
            $.each(e.files, function (index, value) {
                var extension = value.extension.toUpperCase();
                if (extension != ".JPG" && extension != ".PNG" && extension != ".JPG") {
                    vm.isUnsuportedFile = true;
                      vm.isValid=true;
                    $('#invalid').addClass('show');
                    vm.isValid=true;
                    e.preventDefault();
                }
            });
          }
        //cancel
        function cancel() {
            var params = $rootScope.prevUrlParam;
            $state.go($rootScope.prevUrl);
            //$state.go($rootScope.prevUrl);
        }
    }
})();
