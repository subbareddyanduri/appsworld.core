// Edit Profile
// Author: Ramesh

(function () {
    'use strict';

    angular
        .module('appsworld')
        .controller('editprofileController', editprofileController);

    editprofileController.$inject = ['editprofileFactory', '$cookies','config', 'serviceConfig','$rootScope', 'formValidate', '$state','$stateParams', 'commonService', 'customValidations'];

    function editprofileController(editprofileFactory, $cookies,config, serviceConfig, $rootScope, formValidate, $state, $stateParams, commonService, customValidations) {
        var vm = this;
        var CompanyId = config.CompanyId;
        window.scrollTo(0, 0);
        vm.addressType = 'single';
        vm.title = 'Address';
        vm.imgUrl = "images/userprofile.png";
        document.getElementById('img').innerHTML = '<img src="' + vm.imgUrl + '" alt="sa" />';
        vm.save = save;
        vm.cancelbtn = cancelbtn;
        vm.adId = $stateParams.id;
        activate();
        function activate() {
            _getByIds();
        }
        //getby id call
        function _getByIds() {
            var id = $stateParams.id;
            //var deferred = $q.defer();
            editprofileFactory.getByIdservice().then(function (response) {
                vm.editprofileobj = response.data;
                vm.salutetypes = response.data.SalutationLU.Lookups;
                vm.jsonString = vm.editprofileobj.Communication;
                $rootScope.$broadcast('setCommunication');
                vm.imgUrl = vm.editprofileobj.Small;
                if (vm.editprofileobj.Small) {
                    document.getElementById('img').innerHTML = '<img src="' + vm.imgUrl + '" alt="sa" />';
                }
                vm.AddrObj = { FirstName: vm.editprofileobj.FirstName, Username: vm.editprofileobj.Username, PhotoId: vm.editprofileobj.PhotoId, Status: false, Small: vm.editprofileobj.Small, Addresses: vm.editprofileobj.Addresses, Communication: vm.editprofileobj.Communication, Phone: vm.editprofileobj.Phone, Website: vm.editprofileobj.Website }
                return response.data;
            });

        }
        //save call
        function save() {
            $rootScope.$broadcast('checkAddrBook');
            //vm.editprofileobj.Communication = vm.jsonString;
            vm.validationMessages = [];
            var typeMissing = [];
            vm.isValidationRequired = false;
            var validateResult = formValidate.validate('form1');
            if (validateResult.isValidationRequired||$rootScope.isCommunicationValidationRequired || $rootScope.isPostValRequired) {
                    vm.validationMessages.push({ validationText: 'Invalid data, Please Verify !' })
                    vm.isValidationRequired = true;
                    window.scrollTo(0, 0);
                }
                else {
                    if (vm.isFileUploaded) {
                        vm.editprofileobj.PhotoId = vm.mediaRepoId;
                    } else { vm.editprofileobj.PhotoId = vm.editprofileobj.PhotoId; }
                    if ($stateParams.id != 'new') {
                        vm.editprofileobj.ModifiedDate = new Date();
                        vm.editprofileobj.ModifiedBy = config.condoUser;
                    }
                    vm.editprofileobj.SalutationLU = "";
                    vm.editprofileobj.CommunicationTypeLU = "";
                    editprofileFactory.saveservice(vm.editprofileobj).success(function (response) {
                        commonService.notify.success('Saved Successfully');
                        //config.userImage = vm.imgUrl;

                        //TODO

                        // $cookies.put('company_details', JSON.stringify({ companyName: config.companyName, companyId: config.companyId, dateFormat: config.dateFormat, timeFormat: config.timeFormat, currency: config.currency, userImage: vm.imgUrl, userFullName: config.userFullName }));
                        var company = $cookies.get('company_details');
                        company = JSON.parse(company);
                        company.userImage = vm.imgUrl;
                        $cookies.put('company_details', JSON.stringify(company));

                        var params = $rootScope.prevUrlParam;
                        $state.go($rootScope.prevUrl, params);
                    }).error(function (data) {
                        vm.validationMessages.push({ validationText: data });
                        vm.isValidationRequired = true;
                        window.scrollTo(0, 0);
                    });
                }
          }

        
        //fileupload
        $('#invalid').addClass('hide');
        $("#upload").kendoUpload({
            async: {
                saveUrl: serviceConfig.checkRemoteServer + "/breeze/azurestorage/uploadlogo",
                removeUrl: serviceConfig.checkRemoteServer + "/breeze/azurestorage/deletelogo",
                autoUpload: true
            },
            select: onFileSelect,
            success: onSuccess
            //upload: onUpload
        });
        $('.k-upload-button span').text('Upload photo');
        function onSuccess(e) {
            $('#invalid').removeClass('show');
            $('#invalid').addClass('hide');
            vm.isFileUploaded = true;
            vm.imgUrl = e.response.Small;
            vm.mediaRepoId = e.response.Id;
            $rootScope.$broadcast('refresh_userImage', { data: e.response });
            vm.editprofileobj.PhotoId = vm.mediaRepoId;
            document.getElementById('img').innerHTML = '<img src="' + vm.imgUrl + '" alt="sa" />';
        }
        function onFileSelect(e) {
            $.each(e.files, function (index, value) {
                var extension = value.extension.toUpperCase();
                if (extension != ".JPG" && extension != ".PNG" && extension != ".JPG") {
                    vm.isUnsuportedFile = true;
                    $('#invalid').addClass('show');
                    e.preventDefault();
                }
            });
        }

        //cancel
        function cancelbtn() {
            // var params = $rootScope.prevUrlParam;
            // $state.go($rootScope.prevUrl, params);
            window.history.back();
            //$state.go($rootScope.prevUrl);
        }



    }
})();

