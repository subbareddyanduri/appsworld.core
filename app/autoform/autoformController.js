(function () {
    'use strict';

    angular
        .module('autoform')
        .controller('autoformController', autoformController);

    autoformController.$inject = ['$location','config','serviceConfig','$http']; 

    function autoformController($location, config,serviceConfig,$http) {
        /* jshint validthis:true */
        var vm = this;
        vm.title = 'autoformController';
        vm.formOptions = {};
        activate();
        vm.ddlchange = function(item,selected_value) {
            
        }

        
        function activate() {
            $http.get("campaign.json").success(function (data) {
                var _options = data;
                _options.saveUrl = serviceConfig.clientCursorClientRemoteServerapi + "/SaveCampaign";
                _options.lookups = serviceConfig.clientCursorClientRemoteServerapi + "/GetCampaign?companyId=" + config.companyId + '&campaignId=00000000-0000-0000-0000-000000000000';
                _options.saveDefaults.CompanyId = config.companyId;
                _options.UserCreated = config.userName;
                _options.CreatedDate = new Date();
                vm.formOptions = _options;
            });

            //vm.formOptions = {
            //    ispopup:false,
            //    formname: 'campign',
            //    isdetail:true,
            //    detailsource:'CampaignDetails',
            //    isView:true,
            //    displaycolumns: 4,
            //    savetype:'server',
            //    saveUrl: serviceConfig.clientCursorClientRemoteServerapi + "/SaveCampaign",    // url
            //    dataItem:null,   // object or url
            //    lookups: serviceConfig.clientCursorClientRemoteServerapi + "/GetCampaign?companyId=" + config.companyId + '&campaignId=00000000-0000-0000-0000-000000000000',    // object or url
            //    showSaveButton:true,
            //    saveDefaults: {
            //        CompanyId: config.companyId,
            //        Status: 'Active',
            //        CreatedDate: new Date(),
            //        UserCreated: config.userName,
            //        ModifiedBy: null,
            //        ModifiedDate:null
            //    },
            //    detailOptions:{
            //        ispopup:true,
            //        formname:'campaigndetail',
            //        headding:'Campaign Details',
            //        showSaveButton:true,
            //        displaycolumns: 3,
            //        actiontype:'popup',
            //        rowclass:'',
            //        saveDefaults: {                  
            //        Status: 'Active',                  
            //        },
            //        gridtype:'basicgrid',
            //        crud:{a:true,e:true,dl:true,d:false},
            //        saveUrl:null,
            //        savetype:'local', // local,server -- if it is server save you need to specify saveUrl
            //        fields:[
            //        {name:'subheading',type:'sub_heading',lblname:'Campaign Details',isgridfield:false,Class:'col-md-12'},
            //        {name:'ItemName',title:'Item Name',tdclasses:'',thclasses:'',isgridfield:true,type:'text',datavalidationtype:'required',clases:'mand'},
            //        {name:'BudgetedCost',title:'Budgeted cost',tdclasses:'',thclasses:'',isgridfield:true,type:'text'},
            //        {name:'ActualCost',title:'Actual cost',tdclasses:'',thclasses:'',isgridfield:true,type:'text'},
            //        {name:'Remarks',title:'Remarks',tdclasses:'',thclasses:'',isgridfield:false,type:'textarea',Class:'col-md-12'},                   
            //        ],
            //        dataSource:[],
            //        dataItem:null
            //    },
            //    fields: [
            //        { name: 'Code', type: 'text', lblname: 'Code', datavalidationtype: 'required', clases: 'mand' },
            //        {
            //            name: 'Name', type: 'text', lblname: 'Name', datavalidationtype: 'required', clases: 'mand'
            //        },
            //        { name: 'StartDate', type: 'date', lblname: 'Start Date', datavalidationtype: 'date', clases: '' },
            //        { name: 'EndDate', type: 'date', lblname: 'End Date', datavalidationtype: 'date', clases: '' },
            //        { name: 'Description', type: 'textarea', lblname: 'Description', datavalidationtype: '', clases: '',Class:'col-md-12' },
            //        { name: 'CampaignType', type: 'select', lblname: 'Type', datavalidationtype: '', clases: '',Class:'',options:{textfield:'Name',valuefield:'Code',ds:'CampaignTypeLU.Lookups'} },
            //        { name: 'CampaignStatus', type: 'select', lblname: 'Status', datavalidationtype: '', clases: '',Class:'',options:{textfield:'Name',valuefield:'Code',ds:'CampaignStatusLU.Lookups'} },
            //        { name: 'CampaignOwner', type: 'select', lblname: 'Owner', datavalidationtype: '', clases: '',Class:'',options:{textfield:'Name',valuefield:'Code',ds:'CampaignOwnerLU'} },
            //        { name: 'ExpectedLeads', type: 'text', lblname: 'Expected leads', datavalidationtype: '', clases: '' },
            //        { name: 'GeneratedLeads', type: 'text', lblname: 'Generated leads', datavalidationtype: '', clases: '',disabled:true },
            //        { name: 'Remarks', type: 'textarea', lblname: 'Remarks', datavalidationtype: '', clases: '',Class:'col-md-12' },
            //        {name:'detailgrid',type:'detailgrid',Class:'col-md-12'}

            //    ]
            //} 
        }
    }
})();
