var app = angular.module('addressbook');

app.controller('addressModel', function ($rootScope, $scope, $uibModal, config, addrConfig, commonService) {
    $scope.open = function (size, addtype, addtypeid, type, totalAddressObject, selection,addresstypes) {
        $rootScope.type = type;
        totalAddressObject = totalAddressObject ? totalAddressObject : [];
        addrConfig.addressTotalObject = totalAddressObject;

        //$rootScope.addtype = addtype;
        //$rootScope.addtypeid = addtypeid;
        if (type === "edit") {
            if (selection.length === 0 || selection.length > 1) {
                commonService.notify.warning('Please Select One Address');
                return;
            }
        }
        for (var i = 0; i <= addrConfig.addressTotalObject.length - 1; i++) {
            if (addrConfig.addressTotalObject[i].AddType === 'VendorContact' || addrConfig.addressTotalObject[i].AddType === 'AccountContact' || addrConfig.addressTotalObject[i].AddType === 'clientContact' || addrConfig.addressTotalObject[i].AddType === 'ClientContact') {
                if (addrConfig.addressTotalObject.length >= 1 && type === "new") {
                    return commonService.notify.warning('Unable to add more than One record!');
                }
            }
        } 
        if (addrConfig.addressTotalObject.length >= 2 && type === "new") {
            commonService.notify.warning('Unable to add more than Two Records!');
            return;
        }
        var modalInstance = $uibModal.open({
            templateUrl: 'myAddrBook.html',
            controller: 'myModalAddrInstance',
            size: size,
            backdrop: 'static',
            resolve: {
                items: function () {
                    return $scope.items;
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {

        });
    };
})

app.controller('myModalAddrInstance', ['$rootScope', '$uibModalInstance', '$scope', 'config', 'serviceConfig', 'addressBookDataContext', 'DefaultValues', 'formValidate', 'addrConfig', 'notify', myModalAddrInstance]);
function myModalAddrInstance($rootScope, $modalInstance, $scope, config, serviceConfig, addressBookDataContext, DefaultValues, formValidate, addrConfig) {
var vm=this;
    setAddressObject();
    $scope.elasticSearchApi = serviceConfig.elasticSearchRemoteServer + "AutoCompletePostalCodes?indexName=postalcodes&indexField=PostalCode&noOfRecords=20&input="

    $scope.Countries = DefaultValues.countries();
    $scope.countries={
        select:countries1
    }
    function countries1(e){
        var selectedItem = this.dataItem(e.item.index());
        $scope.addressObject.AddressBook.Country=selectedItem.name;
    }
    function setAddressObject() {
        removeAddrFromLocalStorage();
         addressBookDataContext.addressTypeLookUp($rootScope.addressType,$rootScope.selectedAdd).then(function(res){
             $scope.addressTypeLU = res.data.Lookups;
             if ($rootScope.type === 'new') {
                 if (res.data.DefaultValue) {
                     $scope.addressObject.AddSectionType = res.data.DefaultValue;
                 }
             }
        });
        if ($rootScope.type === 'new') {
            var addrBook = addressBookDataContext.addressObject($rootScope.addtype, $rootScope.addtypeid);
            addrBook.AddressBook.IsLocal = 'localaddress';
            $scope.addressObject = addrBook;
        } else if ($rootScope.type === 'edit') {
            var _addr = angular.copy(addrConfig.addressObject);
            _addr.AddressBook.IsLocal = _addr.AddressBook.IsLocal === true ? 'localaddress' : 'foreignaddress';
            $scope.addressObject = _addr;
        }
    }
    function clearAddrValues() {
        $scope.addressObject.AddressBook.PostalCode = '';
        $scope.addressObject.AddressBook.Street = '';
        $scope.addressObject.AddressBook.BlockHouseNo = '';
        $scope.addressObject.AddressBook.BuildingEstate = '';
        $scope.addressObject.AddressBook.State = '';
        $scope.addressObject.AddressBook.Country = '';
        $scope.addressObject.AddressBook.City = '';
        $scope.addressObject.AddressBook.UnitNo = '';
    }
    var laddr;
    var faddr;
    function setAddr(type) {
        laddr = { PostalCode: "", BuildingEstate: '', BlockHouseNo: '', Country: '', State: '', City: '', Street: '', UnitNo: '' };
        faddr = { PostalCode: "", BuildingEstate: '', BlockHouseNo: '', Country: '', State: '', City: '', Street: '', UnitNo: '' };
        if (type === 'localaddress') {
            faddr.PostalCode = $scope.addressObject.AddressBook.PostalCode;
            faddr.BuildingEstate = $scope.addressObject.AddressBook.BuildingEstate;
            faddr.BlockHouseNo = $scope.addressObject.AddressBook.BlockHouseNo;
            faddr.Country = $scope.addressObject.AddressBook.Country;
            faddr.State = $scope.addressObject.AddressBook.State;
            faddr.City = $scope.addressObject.AddressBook.City;
            faddr.Street = $scope.addressObject.AddressBook.Street;
            faddr.UnitNo = $scope.addressObject.AddressBook.UnitNo;
        }
        if (type === 'foreignaddress') {
            laddr.PostalCode = $scope.addressObject.AddressBook.PostalCode;
            laddr.BuildingEstate = $scope.addressObject.AddressBook.BuildingEstate;
            laddr.BlockHouseNo = $scope.addressObject.AddressBook.BlockHouseNo;
            laddr.Country = $scope.addressObject.AddressBook.Country;
            laddr.State = $scope.addressObject.AddressBook.State;
            laddr.City = $scope.addressObject.AddressBook.City;
            laddr.Street = $scope.addressObject.AddressBook.Street;
            laddr.UnitNo = $scope.addressObject.AddressBook.UnitNo;
        }
    }
    function _setAddrValues(object) {
        $scope.addressObject.AddressBook.PostalCode = object.PostalCode;
        $scope.addressObject.AddressBook.Street = object.Street;
        $scope.addressObject.AddressBook.BlockHouseNo = object.BlockHouseNo;
        $scope.addressObject.AddressBook.BuildingEstate = object.BuildingEstate;
        $scope.addressObject.AddressBook.State = object.State;
        $scope.addressObject.AddressBook.Country = object.Country;
        $scope.addressObject.AddressBook.City = object.City;
        $scope.addressObject.AddressBook.UnitNo = object.UnitNo;
    }
    $scope.addressSectionChanged = function (type) {
        setAddr(type);
        if (type === 'localaddress') {
            window.localStorage.setItem('foreignAddr', JSON.stringify(faddr));
            clearAddrValues();
            if (JSON.parse(window.localStorage.getItem('localAddr') != null)) {
                _setAddrValues(JSON.parse(window.localStorage.getItem('localAddr')));
            } else {
                $scope.addressObject.AddressBook.Country = "Singapore";
                $scope.addressObject.AddressBook.State = "Singapore";
                $scope.addressObject.AddressBook.City = "Singapore";
            }

        } else if (type === 'foreignaddress') {
            window.localStorage.setItem('localAddr', JSON.stringify(laddr));
            clearAddrValues();
            if (JSON.parse(window.localStorage.getItem('foreignAddr') != null)) {
                _setAddrValues(JSON.parse(window.localStorage.getItem('foreignAddr')));
            }
        }
    }
    $scope.selectedObject = function (selectedObject) {
        if(selectedObject){
        var dataItem = selectedObject.originalObject;
        $scope.ispostval = false;
        $scope.addressObject.AddressBook.PostalCode = dataItem.PostalCode;
        $scope.addressObject.AddressBook.BuildingEstate = dataItem.BuildingName;
        $scope.addressObject.AddressBook.BlockHouseNo = dataItem.BuildingNumber;
        $scope.addressObject.AddressBook.Country = dataItem.Country;
        $scope.addressObject.AddressBook.State = dataItem.State;
        $scope.addressObject.AddressBook.City = dataItem.State;
        $scope.addressObject.AddressBook.Street = dataItem.StreetName;
        $scope.isDisableRequired = true;
        }
    }

    $scope.postalCodeChanged = function () {
        $scope.isDisableRequired = false;
        $scope.addressObject.AddressBook.PostalCode = document.getElementById('postalAutocmptl_value').value;
    }

    $scope.save = function () {
        var valaidate = formValidate.validate('addrBook');
        $scope.servicecodeerror = false;
        $scope.isRpostval = false;
        if ($scope.addressObject.AddressBook.IsLocal === 'localaddress') {
            var pcode = document.getElementById('postalAutocmptl_value').value;
            if (isNaN(pcode) || (pcode.length != 6 && pcode != "")) {
                $scope.isRpostval = true;
            }
        }
        if (valaidate.isValidationRequired || $scope.isRpostval) {
            return;
        }
        $scope.IsLocalDummy = $scope.addressObject.AddressBook.IsLocal === 'localaddress' ? true : false;
        $scope.count = addrConfig.addressTotalObject.filter(function (val, index, totArray) {
            return $scope.IsLocalDummy === val.AddressBook.IsLocal && val.AddSectionType === $scope.addressObject.AddSectionType && val.AddressBookId != $scope.addressObject.AddressBookId;
        })
        if ($scope.count.length >= 1) {
            //toastr.error("Unable to save this Record!, Record already exist with same Address Type and Local / Foreign Address")
            $scope.validationMessages = [];
            $scope.validationMessages.push("Unable to save this Record!, Record already exist with same Address Type and Local / Foreign Address");
            $scope.isValidationRequired = true;
            return;
        };
        // if ($scope.count)
        $scope.addressObject.AddressBook.IsLocal = $scope.addressObject.AddressBook.IsLocal === 'localaddress' ? true : false;
        $scope.addressObject.AddType = $rootScope.addtype;
        isNaN($rootScope.addtypeid) === true ? $scope.addressObject.AddTypeId = $rootScope.addtypeid : $scope.addressObject.AddTypeIdInt = $rootScope.addtypeid;
        if (isNaN($rootScope.addtypeid)) {
            $scope.addressObject.AddTypeIdInt = null;
            $scope.addressObject.AddTypeId = $rootScope.addtypeid;
        } else {
            $scope.addressObject.AddTypeIdInt = $rootScope.addtypeid;
            $scope.addressObject.AddTypeId = null;
        }
        $scope.addressObject.AddressBookId = $scope.addressObject.AddressBook.Id;
        $rootScope.$broadcast('saveAddressObject', { data: { type: $rootScope.type, object: $scope.addressObject } });
        removeAddrFromLocalStorage();
        addrConfig.addressTotalObject = '';
        $modalInstance.dismiss('ok');
    }
    function removeAddrFromLocalStorage() {
        if (window.localStorage.getItem('localAddr') != null) { window.localStorage.removeItem('localAddr'); }
        if (window.localStorage.getItem('foreignAddr') != null) { window.localStorage.removeItem('foreignAddr'); }
    }
    $scope.cancel = function () {
        removeAddrFromLocalStorage();
        $rootScope.$broadcast('cancelAddressObject');
        $modalInstance.dismiss('cancel');
        addrConfig.addressTotalObject = '';
    }


}