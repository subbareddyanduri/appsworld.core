
angular.module('contactdirectiveapp')
.directive('zCreateContact', function () {
    return {
        restrict: 'E',
        scope: {
            contactObject: '=',
            addressTitle: '=',
            infoTitle: '=',
            infoName: '=',
            showContactAssociation: '=',
            isRemember: '=',
            isContactAutoLookUp: '=',
            isMultiDesignation: '=',
            isContactView: '=',
            isMatters: '=',
            isNotPrimory: '=',
            isShowBack: '=',
            isShowPrimary: '=',
            isEdit: '='
        },
        templateUrl: "CustomDirectives/contactDirective/contactDirective.html",
        controller: function ($rootScope, $scope, $timeout, $stateParams, $http, config, DefaultValues, serviceConfig, $state, contactDirectiveFactory, customValidations, $moment, commonService, formValidate) {
            $scope.elasticSearchApi = serviceConfig.elasticSearchRemoteServer + "AutoCompletePostalCodes?indexName=postalcodes&indexField=PostalCode&noOfRecords=20&input="
            $scope.isView = false;
            $scope.adId = $stateParams.Id || $stateParams.id;
            $scope.validationMessages = [];
            $scope.isValidationRequired = false;
            $scope.phones = [];
            var saveText = '';
            $scope.isFieldsDisable = false;
            $scope.imgUrl = "content/images/iconsnew/userprofile.png";
            document.getElementById('img').innerHTML = '<img src="' + $scope.imgUrl + '" alt="sa" />';
            $scope.isClicked = null;
            $scope.contactObj = $scope.contactObj ? $scope.contactObj : {
                Id: commonService.guid(), Addresses: [], ContactId: commonService.guid(), Salutation: "", FirstName: "", LastName: "", DOB: null, Designation: "", IdType: null, IdNo: "", IsLocal: true, IsPrimaryContact: true, IsReminderReceipient: false, CountryOfResidence: "", Matters: null, ContactStatus: "", RecOrder: null, Status: "Active", BlockHouseNo: "", Street: "", UnitNo: "", BuildingEstate: "", City: "", PostalCode: "", State: "Singapore", Country: "Singapore", Website: null, Communication: null, AddressBookId: commonService.guid(), ContactType: null, AccountId: null, Small: null
            }
            $scope.dateOptions = {
                format: "dd/MM/yyyy",
                parseFormats: "['yyyy-MM-ddTHH:mm:ss']"
            }
            $scope.matterCheck = false;
            $scope.selection = [];
            $scope.isCommunicationReq = false;
            $scope.toggleSelection = function toggleSelection(id) {
                var idx = $scope.selection.indexOf(id);
                if (idx > -1) { $scope.selection.splice(idx, 1); }
                else { $scope.selection.push(id); }
                if ($scope.matters.length !== $scope.selection.length) { $scope.matterCheck = false; }
                if ($scope.matters.length === $scope.selection.length) { $scope.matterCheck = true; }
            };

            $scope.isMattersChecked = function () {
                if ($scope.matters)
                    return $scope.selection.length == $scope.matters.length;
            }
            $scope.checkAllMatters = function () {
                $scope.matterCheck = document.getElementById('mattersCheck').checked;
                if ($scope.matterCheck) {
                    $scope.selection = [];
                    angular.forEach($scope.matters, function (index) {
                        $scope.selection.push(index.Name);
                    })
                } else { $scope.selection = []; }
            }
           
            //  getlookupsdata();
            function getlookupsdata() {
                  var screenName = $scope.infoTitle; 
                  var type= screenName.split(" ", 1);
                contactDirectiveFactory.getContactLookupObj(type, $stateParams.id || $stateParams.Id).success(function (data) {
                    return data;
                })
            }
            $('#invalid').addClass('hide');
            $("#upload").kendoUpload({
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
            });
            function onSuccess(e) {
                $('#invalid').removeClass('show');
                $('#invalid').addClass('hide');
                $scope.isFileUploaded = true;
                $scope.imgUrl = e.response.Small;
                $scope.contactObj.Small = e.response.Small;
                $scope.mediaRepoId = e.response.Id;
                $scope.contactObj.PhotoId = $scope.mediaRepoId;
                document.getElementById('img').innerHTML = '<img src="' + $scope.imgUrl + '" alt="sa" />';
            }
            function onFileSelect(e) {
                $.each(e.files, function (index, value) {
                    var extension = value.extension.toUpperCase();
                    if (extension != ".JPG" && extension != ".PNG" && extension != ".JPG") {
                        $scope.isUnsuportedFile = true;
                        $('#invalid').addClass('show');
                        e.preventDefault();
                    }
                });
            }
            $scope.$on("getViewModeContact", function (event, args) {
                $scope.isView = true;
                $scope.isContactView = true;
                $timeout(function () {
                    var formName = ["contactForm"];
                    $("select").prop('disabled', true);
                    commonService.getViewMode(formName);
                }, 500);
            });
            //datepickers
            $scope.dateplaceholder = config.dateFormat;
            $scope.dateFormat = config.dateFormat;
            $scope.openCDatePicker = function ($event, opened) {
                $event.preventDefault();
                $event.stopPropagation();
                $scope.datePicker[opened] = $scope.datePicker[opened] === true ? false : true;
            };
            $scope.closeAll = function () {
                $scope.DateOpen = false;
            };
            $scope.datePicker = {
                DateOpen: false
            }
            $scope.datepickerOptions = {
                format: config.dateFormat,
                'class': 'datepicker'
            };
            $scope.formats = [config.dateFormat];
            $scope.format = $scope.formats[0];
            $scope.dateOptions6 = {
                format: 'dd-MMM',
                'class': 'datepicker'
            };
            $scope.formats6 = ['dd-MMM'];
            $scope.format6 = $scope.formats6[0];
            //Postal Code LookUp
            var datatext = "postalcode";
            var poststr;
            var headertemplate = '<div class="dropdown-header">' +
                        '<span class="tile-header">info</span>' +
                    '</div>';
            var template = '<span class="k-state-default"><h4>#: data.postalcode #</h4><p><b>place: </b>#: data.streetname # </p></span>';
            $scope.selectedContactObject = function (e) {
                $scope.iscntpostval = false;
                var dataItem = e.originalObject;
                $scope.contactObj.PostalCode = dataItem.PostalCode;
                $scope.contactObj.BuildingEstate = dataItem.BuildingName;
                $scope.contactObj.BlockHouseNo = dataItem.BuildingNumber;
                $scope.contactObj.Country = dataItem.Country;
                $scope.contactObj.State = dataItem.State;
                $scope.contactObj.City = dataItem.State;
                $scope.contactObj.Street = dataItem.StreetName;
                $scope.isFieldsDisable = true;
            }
            if ($scope.isContactAutoLookUp) { _contactAutoLookUp(); }
            
            function _contactAutoLookUp() {
                $scope.contactLookUp = {
                    dataTextField: 'FirstName',
                    template: '<span class="k-state-default"><h4>#: data.FirstName #</h4><p><b>IdNo: </b>#: data.IdNo # </p></span>',
                    dataSource: contactDirectiveFactory.getcontactAutoLookup($stateParams.Id || $stateParams.id === 'new' ? '00000000-0000-0000-0000-000000000000' : $stateParams.Id || $stateParams.id),
                    height: 470,
                    select: onContactSelect
                }
            }
            //Countries
            $scope.Countries = Countries;
            $scope.countries = {
                select: countries1
            }
            function countries1(e) {
                var selectedItem = this.dataItem(e.item.index());
                $scope.contactObj.CountryOfResidence = selectedItem.name;
            }
            function onContactSelect(e) {
                function _setCommunication(phone) {
                    $scope.phones = [];
                    var type;
                    var value;
                    try {
                        if (phone === '[{"":""}]' || phone === "" || phone === undefined || phone === null || phone === ']') {
                            $scope.phones.push({ "type": "", "value": "" });
                        } else {
                            $scope.phones = commonService.getCommunicationObject(phone);
                        }
                    }
                    catch (err) { }
                }
                var dataItem = this.dataItem(e.item.index());
                $scope.contactObj.ContactId = dataItem.Id;
                $scope.contactObj.DOB = dataItem.DOB ? new Date(dataItem.DOB.split('T')[0]) : null;;
                $scope.contactObj.AddressBookId = dataItem.MailingAddressBookId;
                $scope.contactObj.PhotoId = dataItem.PhotoId;
                if (dataItem.Matters != "" && dataItem.Matters != null) {
                    var matters = dataItem.Matters.split(';');
                    for (var _idx = 0; _idx <= matters.length - 1; _idx++) {
                        $scope.selection.push(matters[_idx]);
                    }
                }
                $scope.contactObj.CountryOfResidence = dataItem.CountryOfResidence;
                $scope.contactObj.FirstName = dataItem.FirstName;
                $scope.contactObj.IdNo = dataItem.IdNo;
                $scope.contactObj.IdType = dataItem.IdType;
                $scope.contactObj.Salutation = dataItem.Salutation;
                if ($scope.isMultiDesignation) {
                    if (dataItem.Designation) { $scope.contactObj.Designation = dataItem.Designation.split(','); }
                    else { $scope.contactObj.Designation = dataItem.Designation; }
                }
                else { $scope.contactObj.Designation = dataItem.Designation; }
                $scope.contactObj.IdType = dataItem.IdType;
                if ($scope.contactObj.IsLocal) { $scope.isResLocal = true; }
                else {   $scope.isResLocal = false; }
                return _getContactAssociations(dataItem.Id);
            }

            function _setObjects(fromObj, toObj) {
                try {
                    toObj.Id = fromObj.Id;
                    if (fromObj.Salutation == "") { fromObj.Salutation = null; }
                    toObj.Salutation = fromObj.Salutation == null ? $scope.contactLookupDataObj.SalutationLU.DefaultValue : fromObj.Salutation;
                    toObj.FirstName = fromObj.FirstName;
                    toObj.LastName = fromObj.LastName;
                    toObj.DOB = fromObj.DOB;
                    toObj.Matters = fromObj.Matters;
                    toObj.PhotoId = fromObj.PhotoId;
                    if (toObj.Matters != "" && toObj.Matters != null) {
                        var matters = toObj.Matters.split(';');
                        for (var _idx = 0; _idx <= matters.length - 1; _idx++) {
                            if ($scope.selection.indexOf(matters[_idx]) == -1)
                                $scope.selection.push(matters[_idx]);
                        }
                    } else {
                        if ($scope.isContactAutoLookUp) {
                            if ($scope.selection.indexOf($scope.contactLookupDataObj.MattersLU.DefaultValue) == -1)
                                $scope.selection.push($scope.contactLookupDataObj.MattersLU.DefaultValue);
                        }
                    }
                    if ($scope.matters.length === $scope.selection.length) {
                        $scope.matterCheck = true;
                        $('#mattersCheck').attr('checked', true);
                    } else { $scope.matterCheck = false;  }
                    if (fromObj.Designation) {
                        if (typeof (fromObj.Designation) === 'object') {
                            var desig = '';
                            angular.forEach(fromObj.Designation, function (index) {
                                desig = desig + index + ',';
                            });
                            toObj.Designation = desig.substring(0, desig.length - 1);
                        }
                        else {
                            if (fromObj.Designation === 'DIRECTOR') { fromObj.Designation = "Director" }
                            if (fromObj.Designation === 'SECRETARY') { fromObj.Designation = "Secretary" }
                            toObj.Designation = fromObj.Designation.split(',');
                        }
                    } else {  toObj.Designation = fromObj.Designation;  }
                    toObj.Communication = fromObj.Communication;
                    toObj.AddressBookId = fromObj.AddressBookId;
                    toObj.ContactId = fromObj.ContactId;
                    toObj.IsPrimaryContact = fromObj.IsPrimaryContact;
                    toObj.IsReminderReceipient = fromObj.IsReminderReceipient;
                    toObj.CountryOfResidence = fromObj.CountryOfResidence;
                    toObj.AccountId = fromObj.AccountId;
                    toObj.IdType = Number(fromObj.IdType);
                    toObj.IdNo = fromObj.IdNo;
                    toObj.ContactType = fromObj.ContactType;
                    toObj.Status = fromObj.Status;
                    $scope.contactStatus = fromObj.Status == "Active" ? false : true;
                    toObj.Communications = fromObj.Communications;
                    toObj.Small = fromObj.Small;
                    toObj.Addresses = fromObj.Addresses;
                    if (fromObj.DOB == "Invalid date" || fromObj.DOB == null) {
                        fromObj.DOB = '';
                    }
                    var DOB = $("#demo1").val();
                    toObj.DOB = fromObj.DOB;
                    if (!fromObj.Small) {
                        $scope.imgUrl = "content/images/iconsnew/userprofile.png";
                    } else {
                        $scope.imgUrl = fromObj.Small;
                    }
                    document.getElementById('img').innerHTML = '<img src="' + $scope.imgUrl + '" alt="sa" />';
                    document.getElementById('chkStatusAdd').checked = $scope.contactStatus;
                }
                catch (err) { }
            }


            $scope.backToTab = function () {
                $rootScope.$broadcast('backClick')
            }
            function _getContactAssociations(id) {
                if ($state.current.name != "app.client.vendor_addEdit.vendorcontacts") {
                    if ($stateParams.Id || $stateParams.id != 'new') {
                        contactDirectiveFactory.getContactAssociations(id, $stateParams.Id || $stateParams.id).then(function (response) {
                            $scope.contactAssociations = response.data;
                            return response;
                        });
                    } else if ($stateParams.Id || $stateParams.id === 'new') {
                        contactDirectiveFactory.getContactAssociations(id, $stateParams.Id || $stateParams.id).then(function (response) {
                            $scope.contactAssociations = response.data;
                            return response;
                        });
                    }
                }
            }

            function formatDate(date) {
                var d = new Date(date),
                    month = '' + (d.getMonth() + 1),
                    day = '' + d.getDate(),
                    year = d.getFullYear();

                if (month.length < 2) month = '0' + month;
                if (day.length < 2) day = '0' + day;

                return [month, day, year].join('/');
            }

            function _clearLookUps() {
                $scope.salutationdata = [];
                $scope.matters = [];
                $scope.Designations = [];
                $scope.idTypes = [];
                $scope.communicationObj = [];
            }

            $scope.$watch(function () {
                return $scope.contactObject;
            }, function (newContactObj) {
                $scope.isValidationRequired = false;
                $scope.isPhotoUploaded = false;
                $scope.selection = [];
                 var screenName = $scope.infoTitle; 
                 var type= screenName.split(" ", 1);
               //  alert(type)
               //  $scope.screenName = $scope.infoTitle.indexOf('Lead') != -1 ? 'Lead' : 'Vendor'
       var newContactObjId=newContactObj?newContactObj.Id:'00000000-0000-0000-0000-000000000000';
                contactDirectiveFactory.getContactLookupObj(type, $stateParams.id || $stateParams.Id, !$scope.isEdit ? 'Add' : 'Edit', newContactObjId).success(function (data) {
                        _clearLookUps();
                        $scope.contactLookupDataObj = data;
                        $scope.salutationdata = $scope.contactLookupDataObj.SalutationLU.Lookups;
                        $scope.contactObj.Salutation = $scope.contactLookupDataObj.SalutationLU.DefaultValue;
                        $scope.matters = $scope.contactLookupDataObj.MattersLU.Lookups;
                       if($scope.isContactAutoLookUp)
                            $scope.selection.push($scope.contactLookupDataObj.MattersLU.DefaultValue)
                        $scope.Designations = $scope.contactLookupDataObj.DesignationLU.Lookups;
                        $scope.idTypes = $scope.contactLookupDataObj.IdTypeLU;
                        $scope.communicationObj = $scope.contactLookupDataObj.AddressBookLU.Lookups;
                        $scope.contactObj.Salutation = data.SalutationLU.DefaultValue;
                        _setObjects(newContactObj, $scope.contactObj);
                        try {
                            _getContactAssociations(newContactObj.ContactId);                            
                        }
                        catch (errr) { }
                    });
            
            });

            function _setPreviousAddr(fromObj) {
                $scope.contactObj.PostalCode = fromObj.PostalCode;
                $scope.contactObj.UnitNo = fromObj.UnitNo;
                $scope.contactObj.State = fromObj.State;
                $scope.contactObj.Country = fromObj.Country;
                $scope.contactObj.City = fromObj.City;
                $scope.contactObj.BlockHouseNo = fromObj.BlockHouseNo;
                $scope.contactObj.Street = fromObj.Street;
                $scope.contactObj.BuildingEstate = fromObj.BuildingEstate;
            }

            function _clearValues() {
                $scope.contactObj.PostalCode = '';
                $scope.contactObj.UnitNo = '';
                $scope.contactObj.State = '';
                $scope.contactObj.Country = '';
                $scope.contactObj.City = '';
                $scope.contactObj.BlockHouseNo = '';
                $scope.contactObj.Street = '';
                $scope.contactObj.BuildingEstate = '';
            }

            function _getPhoneEmails(newAddressBook) {
                $scope.phones = [];
                var type;
                var value;
                try {
                    if (newAddressBook.Communication === '[{"":""}]' || newAddressBook.Communication === "" || newAddressBook.Communication === undefined || newAddressBook.Communication === null || newAddressBook.Communication === ']') {
                        $scope.phones.push({ "type": "", "value": "" });
                    } else {
                        $scope.phones = commonService.getCommunicationObject(newAddressBook.Communication);
                    }
                }
                catch (err) { }

            }

            $scope.iscntpostval = false;
            $scope.postalCodeChanged = function () {
                $scope.iscntpostval = false;
                var val = document.getElementById('cntPostalAutocmptl_value').value;
                if (val) {
                    if (isNaN(val) || val.length < 6 || val.length > 6) {
                        $scope.iscntpostval = true;
                    }
                }
                $scope.isFieldsDisable = false;
            }

            $scope.setAddressType = function (addrType) {
                if (addrType == 'Rlocal') {
                    if ($scope.isResLocal) { return; }
                    else
                    {
                        $rootScope.RFAddr = angular.copy($scope.contactObj);
                        _clearValues();
                        if ($rootScope.RAddr) {
                            _setPreviousAddr($rootScope.RAddr);
                        }
                        $scope.isResLocal = true;
                        $scope.contactObj.State = 'Singapore';
                        $scope.contactObj.City = 'Singapore';
                        $scope.contactObj.Country = 'Singapore';
                        $scope.contactObj.IsLocal = true;
                        document.getElementById('Rlocal').checked = true;
                        $scope.isFieldsDisable = false;
                    }
                }
                else if (addrType == 'Rforeign') {
                    if (!$scope.isResLocal) { return; }
                    else
                    {
                        $rootScope.RAddr = angular.copy($scope.contactObj);
                        _clearValues();
                        if ($rootScope.RFAddr) {
                            _setPreviousAddr($rootScope.RFAddr);
                        }
                        $scope.isResLocal = false;
                        $scope.contactObj.IsLocal = false;
                        document.getElementById('Rforeign').checked = true;
                    }
                }
            }

            $scope.addemail = function () {
                $scope.emails.push({ type: "", value: "" });
            }
            //deleting email
            $scope.deleteemail = function (index) {
                $scope.emails.splice(index, 1)
            }
            $scope.checkRemainderRecip = function () {
                return $scope.contactObj.IsReminderReceipient;
            }
            $scope.countryNames = DefaultValues.countries();
       
            function _checkForEmail() {
                var _email = [];
                var emailCount = 0;
                var emailNullableCount = 0;
                if ($scope.contactObj.Communication == '') {
                    $scope.contactObj.Communication = null;
                }
                $scope.commDupObj = JSON.parse($scope.contactObj.Communication)
                if ($scope.commDupObj == null) {
                    $scope.isCommunicationReq = true;
                    $scope.contactCMMVText = rememberRcpVT;
                    return false;
                }
                for (var index = 0; index <= $scope.commDupObj.length - 1; index++) {
                    if ($scope.commDupObj[index].key.search('mail') != -1) {
                        emailCount++;
                        _email.push($scope.contactObj.Communication[index]);
                    }
                }
                if (emailCount > 0) {
                    for (var idx = 0; idx <= _email.length - 1; idx++) {
                        if (_email[idx].value == "") {
                            emailNullableCount++;
                        }
                    }
                }
                if (emailNullableCount == emailCount) {
                    return false;
                } else {
                    return true;
                }
            }

            $scope.$on('saveNew', function (args, evemt) {
                $scope.selection = [];
            });

            function _checkCOMM() {
                var count = 0;
                var testCases = /null|undefined|""|'null'|'undefined'/
                if ($scope.contactObj.Communication == "" || $scope.contactObj.Communication == null || testCases.test($scope.contactObj.Communication)) {
                    return false;
                } else {
                    return true;
                }
            }

            // declaring validation text
            var primaryContactVT = 'At least one Communication is required';
            var rememberRcpVT = 'Email Communication is required';
            $scope.isContactCMVT = false;
            $scope.cntCMTChange = function (type, value) {
                $scope.isCommunicationReq = false;
                _validate(type, value);
            }

            function _validate(type, value) {
                $scope.isContactCMVT = false;
                $scope.cntCMMValidationText = '';
                var testCases = /null|undefined|""|'null'|'undefined'/
                angular.forEach($scope.contactObj.Communication, function (index) {
                    if ((testCases.test(type) || index.type === "") && index.value !== "") {
                        $scope.isContactCMVT = true;
                        $scope.cntCMMValidationText = 'Please select CommunicationType';
                    }
                    else if ((!testCases.test(index.type) || index.type != "") && index.value !== "") {
                        if (customValidations.validateCommunicationType(index.type, index.value) !== true) {
                            $scope.isContactCMVT = true;
                            $scope.cntCMMValidationText = 'Invalid ' + index.type;
                        }
                    }
                    else if ((!testCases.test(index.type) && index.type != "") && index.value === "") {
                        $scope.isContactCMVT = true;
                        $scope.cntCMMValidationText = 'Please Enter ' + index.type;
                    }
                })
            }

            $scope.$on('getContactObj', function () {
                $scope.validate();
            })

            $scope.validate = function () {
                $scope.isValidationRequired = false;
                $scope.isCommunicationReq = false;
                $scope.isPrimaryReq = false;
                $scope.isRemaindereReq = false;
                $scope.contactCMMVText = '';
                $scope.validationMessages = [];
                $scope.typeMissing = [];
                var isRemainderChecked = $('#chkRemainder').is(':checked');
                if (!($scope.isNotPrimory)) {
                    var isPrimaryChecked = $('#chkPrimary').is(':checked');
                }
                var _emailCount = 0, _phoneCount = 0, _faxCount = 0, _mobileCount = 0;
                if (isRemainderChecked && isPrimaryChecked) {
                    if (!_checkCOMM()) {
                        $scope.isCommunicationReq = true;
                        $scope.contactCMMVText = primaryContactVT;
                    } else if (!_checkForEmail()) {
                        $scope.isCommunicationReq = true;
                        $scope.contactCMMVText = rememberRcpVT;
                    }
                } else {
                    if (isRemainderChecked) {
                        if (!_checkForEmail()) {
                            $scope.isCommunicationReq = true;
                            $scope.contactCMMVText = rememberRcpVT;
                        }
                    } else if (isPrimaryChecked) {
                        if (!_checkCOMM()) {
                            $scope.isCommunicationReq = true;
                            $scope.contactCMMVText = primaryContactVT;
                        }
                    }
                }
                $scope.$on('primaryContactRequired', function () {
                    $scope.isPrimaryReq = true;
                    _showErrorLog();
                })
                $scope.$on('remainderRequired', function () {
                    if (isRemainderChecked) {
                        $scope.contactObj.IsReminderReceipient = true;
                    } else {
                        $scope.isRemaindereReq = true;
                        _showErrorLog();
                    }
                });

                var errormesgs = formValidate.validate('contactForm');
                if (!errormesgs.isValidationRequired && !$scope.isCommunicationReq && !$scope.isContactCMVT && !$scope.isPrimaryReq && !$scope.isRemaindereReq && !$scope.iscntpostval) {
                    return saveContact(saveText);
                } else {
                    _showErrorLog();
                }
            }
            //broadcast for communication in WF only
            $rootScope.$on('ContactCommRequired', function () {
              
                 if (!_checkCOMM()) {
                               $scope.isCommunicationReq = true;
                    $scope.isContactCMVT = true;
                    $scope.cntCMMValidationText = 'At least one Communication is required';
                      _showErrorLog();
                        }
                 
            
                
            });
            //broadcast for inactive functionality
            $scope.$on("oneinactive", function (event, args) {
                $scope.validationMessages.push({ validationText: args.data });
                $scope.isValidationRequired = true;
                window.scrollTo(0, 0);
                return;
            });
         
            $scope.saveCnt = function (type) {
                saveText = type;
                $scope.isCommunicationReq = false;
                $scope.isContactCMVT = false;
                $scope.isValidationRequired = false;
            }
        
            function _showErrorLog() {
                $scope.validationMessages = [];
                $scope.isValidationRequired = true;
                $scope.validationMessages.push({ validationText: 'Please complete the mandatory fields! ' });
                window.scrollTo(0, 0);
            }

            $scope.validationOptions = {
                rules: {
                    cntLPostalCode: function (input) {
                        if ($scope.isResLocal) {
                            if (input.is("[name=cntLPostalCode]")) {
                                if (input.val() != "") {
                                    if (input.val().length != 6) { return false; }
                                    else { return /^\d+$/.test(input.val()); }
                                }
                                else { return true; }
                            } else {
                                return true;
                            }
                        } else {
                            return true;
                        }
                    },
                    cntFPostalCode: function (input) {
                        if (!$scope.isResLocal) {
                            if (input.is("[name=cntFPostalCode]")) {
                                if (input.val() != "") {
                                    if (input.val().length > 10 || input.val().length < 6) { return false }
                                    else { return /^[a-z\d\-_\s]+$/i.test(input.val()); }

                                }
                                else { return true; }
                            }
                            else {
                                return true;
                            }
                        } else { return true; }
                    },

                },
                messages: {
                    cntLPostalCode: 'It must be 6 digit number',
                    cntFPostalCode: 'Should be Alphanumaric Between 6-10 Characters',
                    cntIdentificationNumber: 'Please enter alphanumerics only',
                    Website: 'Invalid Website',
                }
            }
            function saveContact(type) {
                $scope.contactStatus = document.getElementById('chkStatusAdd').checked;
                $scope.validationMessages = [];
                $scope.isValidationRequired = false;
                if ($scope.contactStatus) {
                    $scope.contactObj.Status = "Inactive";
                    if ($scope.isNotPrimory) { $scope.contactObj.IsPrimaryContact = false; }
                    if ($scope.contactObj.IsPrimaryContact) {
                        $scope.validationMessages.push({ validationText: 'In-activating of primary contact should not allowed' });
                        $scope.isValidationRequired = true;
                        window.scrollTo(0, 0);
                        return;
                    }
                    if ($scope.contactObj.IsReminderReceipient) {
                        $scope.validationMessages.push({ validationText: 'In-activating of Reminder receipient contact should not allowed' });
                        $scope.isValidationRequired = true;
                        window.scrollTo(0, 0);
                        return;
                    }
                } else {
                    $scope.contactObj.Status = "Active";
                }
                if ($scope.contactObj.IsLocal == false) {
                }
               
                var errormesgs = formValidate.validate('contactForm');
                $rootScope.$broadcast('checkAddrBook');
                if (errormesgs.isValidationRequired || $rootScope.isCommunicationValidationRequired || $rootScope.isPostValRequired) {
                  
                    $scope.validationMessages.push({ validationText: ' Please complete the mandatory fields! ' });
                    _showErrorLog();
                    return;
                }
                var matters = "";
                $scope.selection = _.uniq($scope.selection);
                for (var idx = 0; idx <= $scope.selection.length - 1; idx++) {
                    matters = matters + $scope.selection[idx] + ';';
                }
                matters = matters.substring(0, matters.length - 1);
                $scope.contactObj.Matters = matters;

                if ($scope.isPhotoUploaded) {
                    $scope.contactObj.PhotoId = $scope.mediaRepoId;
                }
                 if($scope.contactObj.DOB > new Date()){
                     $scope.validationMessages = [];
                $scope.isValidationRequired = true;
                    $scope.validationMessages.push({ validationText: 'Date of Birth should not allow future dates !' });
                   window.scrollTo(0, 0);
                    return;
                 }
                _setObjects($scope.contactObj, $scope.contactObject);
                $rootScope.$broadcast('saveCancel' + $scope.infoTitle, { data: { status: 'saveContact', state: type } })
                $rootScope.$broadcast('refreshContactCards', { data: '' });
                if (saveText == "new") {
                    if (!$scope.isValidationRequired) { 
                    document.getElementById('Residence').value = '';
                    $scope.contactStatus = false;
                    $('#mattersCheck').attr('checked', false);
                    getlookupsdata();
                    if (!$scope.isRemaindereReq) {
                        $scope.contactObj = {
                            Id: commonService.guid(), ContactId: commonService.guid(), Salutation: "", FirstName: "", LastName: "", DOB: null, Designation: "", IdType: null, IdNo: "", IsLocal: true, IsPrimaryContact: true, IsReminderReceipient: false, CountryOfResidence: "", Matters: null, ContactStatus: "", RecOrder: null, Status: "Active", BlockHouseNo: "", Street: "", UnitNo: "", BuildingEstate: "", City: "", PostalCode: "", State: "Singapore", Country: "Singapore", Website: null, Communication: null, AddressBookId: commonService.guid(), ContactType: null, AccountId: null, Small: null
                        }
                    }
                }
                }
            }


            $scope.cancelContact = function () {
                formValidate.hideMessages('contactForm');
                $scope.contactObject = [];
                $scope.isValidationRequired = false;
                $scope.isCommunicationReq = false;
                $scope.selection = [];
                $scope.isRemaindereReq = false;
                $scope.isPrimaryReq = false;
                $rootScope.$broadcast('saveCancel' + $scope.infoTitle, { data: { status: 'cancelContact', state: '' } });
                $rootScope.$broadcast('refreshContactCards', { data: '' });

                $('#mattersCheck').attr('checked', false);
            }
        },
        link: function (scope, ele, attr) {
        }

    }
});
