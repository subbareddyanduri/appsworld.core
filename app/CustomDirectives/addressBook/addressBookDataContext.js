(function () {
    'use strict';

    angular
        .module('addressbook', [])
        .factory('addressBookDataContext', addressBookDataContext);

    addressBookDataContext.$inject = ['$http', 'DefaultValues', 'commonService','serviceConfig','config'];

    function addressBookDataContext($http, DefaultValues, commonService,serviceConfig,config) {
        var service = {
            getAddressGridOptions: getAddressGridOptions,
            addressObject: addressObject,
            addressTypeLookUp:addressTypeLookUp
        };
        return service;
  function addressTypeLookUp(addressType,selectedAdd){
      selectedAdd=selectedAdd?selectedAdd:null;
         //http://192.168.0.100:90/AWAdminDev/api/Common/addresslu?companyid=156&categorycode=IndividualAddress&selectedAddType=Registered%20Address,Mailing%20Address,Office%20Address
        var url=serviceConfig.adminRemoteServer+'addresslu?companyid='+config.companyId+'&categorycode='+addressType+'&selectedAddType='+selectedAdd;
  return commonService.getEntities(url);
}
        function getAddressGridOptions(data) {
            return {
                dataSource: {
                    type: 'json',
                    data: data,
                    pageSize: 20
                },
                sortable: true,
                pageable: {
                    refresh: true,
                    buttonsCount: 5
                },
                filtarable: true,
                columns: [
                    { field: "AddType", title: "Address Type" },
                    { field: 'AddSectionType', title: 'Address Section Type' },
                    { title: 'Address', template: "" }
                ]
            }
        }
        function addressObject(addType, addTypeId) {
            return {
                Id: commonService.guid(), AddSectionType: "", AddType: "", AddTypeId: addTypeId, AddTypeIdInt: addTypeId, AddressBookId: "", Status: "Active", AddressBook: DefaultValues.addressBook()
            }
        }
    }
})();