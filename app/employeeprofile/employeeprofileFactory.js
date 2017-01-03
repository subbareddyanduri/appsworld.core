(function () {
    'use strict';

    angular
        .module('employeeprofile', [])
        .factory('employeeprofileFactory', employeeprofileFactory);

    employeeprofileFactory.$inject = ['serviceConfig', 'commonService', 'config'];

    function employeeprofileFactory(serviceConfig, commonService, config) {
        var service = {
            getlookups: getlookups,
            createEmployeeDetails: createEmployeeDetails,
            getEmployment: getEmployment,
            createEmployment: createEmployment,
            saveEmployeeDetails: saveEmployeeDetails,
            saveEmployment: saveEmployment,
            getServiceGroup: getServiceGroup,
            createServiceGroup: createServiceGroup,
            saveServiceGroup: saveServiceGroup,
            prev_tabs: prevtabs,
            departmentGridOptions: departmentGridOptions,
            serviceGroupGridOptions: serviceGroupGridOptions,
            getserviceGroupObj: getserviceGroupObj,
            getEmploymentGroupObj:getEmploymentGroupObj,
            check_servicegroups:check_servicegroups,
            loadDesignations:loadDesignations,
            loadLevels:loadLevels,
            chargeOutRange:chargeOutRange,
            check_endDate:check_endDate

           // deplevel: deplevel,
        };
        return service;

        function loadDesignations(id,obj){
             var emps=obj.filter(function(value){
               return id==value.Id;
            });
            if(emps&&emps.length!=0)
            return emps[0].Designations?emps[0].Designations:[];
            else
            return [];
        }
        function loadLevels(id,designtions){
             var levels=designtions.filter(function(value){
               return id==value.Id;
            });
            if(levels&&levels.length!=0)
            return levels[0].LevelRatesLookUp?levels[0].LevelRatesLookUp:[];
            else
            return [];
        }
        function chargeOutRange(level,code){
             for(var i=0;i<=level.length-1;i++){
                   if(code===level[i].Code){
                        return level[i].Name;
                   }
            }
        }
        //lookup call
        function getlookups(Id) {
            var url = serviceConfig.newAdminEmpRemoteServer + "lookupcall?companyId=" + config.companyId + '&employeeId=' + Id;
            return commonService.getEntities(url);
        }
        function check_servicegroups(object){
          var names=[];
          var isDuplicated=false;
          if(object){
                for(var i=0;i<=object.length-1;i++){
                    if(object[i].ServiceGroupId && object[i].RecordStatus!='Deleted'){
                    names.push(object[i].ServiceGroupId);
                    }
                }
                names.filter(function(value,index,array){
                    if(array.indexOf(value)!=index)
                    {isDuplicated=true;}
                });
          }
         return isDuplicated;
        }
         function check_endDate(object){
              var EndDate=[];
          var isDuplicated=false;
          if(object){
                for(var i=0;i<=object.length-1;i++){
                    if(object[i].EndDate===''){
object[i].EndDate=null;
                    }
                    if(!object[i].EndDate){
                    EndDate.push(object[i].EndDate);
                    }
                }
                EndDate.filter(function(value,index,array){
                    if(array.indexOf(value)!=index)
                    {isDuplicated=true;}
                });
          }
         return isDuplicated;
         }
        //create call for employee details
        function createEmployeeDetails(Id) {
            Id = Id == "new" ? commonService.guid() : Id;
            var url = serviceConfig.newAdminEmpRemoteServer + "CreateEmployee?companyId=" + config.companyId + "&employeeId=" + Id;
            return commonService.getEntities(url);
        }
        //lookup call for departments,designations,levels
        function getEmployment() {
            var url = serviceConfig.newAdminEmpRemoteServer + "lookupdepartmentLevels?companyId=" + config.companyId;
            return commonService.getEntities(url);
        }
        //create call for  employment
        function createEmployment(Id) {
            if (Id == 'new') {
                Id = commonService.guid();
                var guid = commonService.guid();
            }
            var url = serviceConfig.newAdminEmpRemoteServer + "createemployment?employeeId=" + Id;
            return commonService.getEntities(url);
        }
        // save call for employee details
        function saveEmployeeDetails(obj) {
            var url = serviceConfig.newAdminEmpRemoteServer + 'SaveEmployee';
            return commonService.saveEntity(url, obj);
        }
        //save call for  employment
        function saveEmployment(obj) {
            var url = serviceConfig.newAdminEmpRemoteServer + 'saveemployment';
            return commonService.saveEntity(url, obj);
        }
        //service group lookup call
        function getServiceGroup() {
            var url = serviceConfig.newAdminEmpRemoteServer + "servicegrouplookup?companyId=" + config.companyId;
            return commonService.getEntities(url);
        }
        //create call for service group
        function createServiceGroup(Id) {
            //    createEmployment(Id);
            //    if (Id == 'new') { Id = guid; }
            var url = serviceConfig.newAdminEmpRemoteServer + "createservicegroup?companyId=" + config.companyId + "&&employeeId=" + Id;
            return commonService.getEntities(url);
        }
        //save call for service group
        function saveServiceGroup(obj) {
            var url = serviceConfig.newAdminEmpRemoteServer + "saveservicegroup";
            return commonService.saveEntity(url, obj);
        }
        //tabset code
        function prevtabs() {
            return {
                employeeDetalis: true,
                employment: false,
                serviceGroups: false
            }
        }
        // function deplevel() {
        //     return [{ Name: 1, Id: "1" }, { Name: 2, Id: "2" }, { Name: 3, Id: "3" }, { Name: 4, Id: "4" }, { Name: 5, Id: "5" }, { Name: 6, Id: "6" }, { Name: 7, Id: "7" }, { Name: 8, Id: "8" }, { Name: 9, Id: "9" }, { Name: 10, Id: "10" }];
        // }
        //Designation Details Grid fields
        function departmentGridOptions(company, department, designation, level, Currency, isView) {
            return {
                formName: 'Department',
                fields: [
                    {
                        Name: 'CompanyId', title: 'Company Name', lblDisplay: 'CompanyName', inputControl: 'select',
                        inputControlOptions: { isDisabled: isView, isVisible: true, data: company, valueProperty: 'Id', textProperty: 'Name' }, isEditable: false, Class: 'mand',validationtype:'required'
                    },
                    {
                        Name: 'DepartmentId', title: 'Department', lblDisplay: 'DepartmentName', inputControl: 'select',
                        inputControlOptions: { isDisabled: isView, isVisible: true, data: department, valueProperty: 'Id', textProperty: 'Name' }, isEditable: false, Class: 'mand', validationtype: 'required'
                    },
                    {
                        Name: 'DepartmentDesignationId', title: 'Designation', lblDisplay: 'DesignationName', inputControl: 'select',
                        inputControlOptions: { isDisabled: isView, isVisible: true, data: designation, valueProperty: 'Id', textProperty: 'Name' }, isEditable: false, Class: 'mand', condition: { checkingField: 'DepartmentId', dataFieldId: 'DepartmentId' }, isConditionCheck: true, validationtype: 'required'
                    },
                    {
                        Name: 'LevelRank', title: 'Level', inputControl: 'select',
                        inputControlOptions: { isDisabled: isView, isVisible: true, data:level, textProperty: 'Code', valueProperty: 'Name', directive: true }, isEditable: false, Class: 'zeg150p', condition: { checkingField: 'DepartmentDesignationId', dataFieldId: 'DepartmentDesignationId' }, isConditionCheck: false
                    },
                    {
                        Name: 'EffectiveFrom', title: 'Effective From', inputControl: 'datepicker', 
                        inputControlOptions: { isDisabled: isView, isVisible: true, isOpen: 'effectOpen' }, isEditable: false, Class: 'mand', validationtype: 'required',template: "<label>{{row.EffectiveFrom|date:'dd/MM/yyyy'}}</label>"
                    },
                    // {
                    //     Name: 'Currency', title: 'Currency', inputControl: 'select',
                    //     inputControlOptions: { isDisabled: isView, isVisible: true, data: Currency, textProperty: 'Code', valueProperty: 'Code' }, isEditable: false, Class: 'zeg200p'
                    // },

                     {
                         Name: 'ChargeOutRate', title: 'Charge-out Rate (Per hour)(SGD)', inputControl: 'number', Maxlength: 5,
                         inputControlOptions: { isDisabled: isView, isVisible: true,valueProperty: 'Name' }, isEditable: false, Class: 'zeg200p', condition: { checkingField: 'LevelRank', dataFieldId: 'LevelRank' },
                     },
                    {
                        Name: 'EndDate', title: 'End Date', inputControl: 'datepicker',
                        inputControlOptions: { isDisabled: isView, isVisible: true, isOpen: 'endOpen' }, isEditable: false, Class: 'zeg200p', template: "<label>{{row.EndDate|date:'dd/MM/yyyy'}}</label>"
                    },
                     {
                         Name: 'Comments', title: 'Comments', inputControl: 'text', Maxlength: 30,
                         inputControlOptions: { isDisabled: isView, isVisible: true }, isEditable: false, Class: 'zeg200p'
                     }

                ]
            }
        }
        //service Group grid fields
        function serviceGroupGridOptions(servicegroup, isView) {
            return {
                formName: 'servicegroup',
                fields: [
                    {
                        Name: 'IsDefault', title: 'Default Member For Service Group', lblDisplay: 'IsDefault', inputControl: 'checkbox',
                        inputControlOptions: { isDisabled: isView, isVisible: true }, isEditable: false
                    },
                    {
                        Name: 'ServiceGroupId', title: 'Select Service Groups', lblDisplay: 'ServiceGroupName', inputControl: 'select',
                        inputControlOptions: { isDisabled: isView, isVisible: true, data: servicegroup, valueProperty: 'Id', textProperty: 'Code' }, isEditable: false,
                    },
                ]
            }

        }
       var primaryId = -1;
        function getserviceGroupObj() {
            primaryId--;
            return {
                //    Id: -1,
                  Id:'00000000-0000-0000-0000-000000000000',
                ServiceGroupId:'',
                ServiceGroupName: '',
                IsDefault: '',
                Status: "Active",
                RecordStatus: "Added"
            }
        }
         function getEmploymentGroupObj() {
            primaryId--;
            return {
                 //    Id: -1,
                 Id:'00000000-0000-0000-0000-000000000000',
                  CompanyName:'',
                  DepartmentName:'',
                  DesignationName:'',
                  EffectiveFrom:'',
                   EndDate:'',
                   Comments:'',
                   Status: "Active",
                  RecordStatus: "Added"
            }
         }
    }
})();