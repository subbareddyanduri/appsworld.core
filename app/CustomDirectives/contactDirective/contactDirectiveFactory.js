/*
Migration in new Framework (Created new Factory)
Subhani
CreatedDate:11/08/2015
*/
(function () {
    'use strict';

    angular
        .module('contactdirectiveapp',[])
        .factory('contactDirectiveFactory', contactDirectiveFactory);

    contactDirectiveFactory.$inject = ['$http', 'serviceConfig','commonService', 'config'];

    function contactDirectiveFactory($http, serviceConfig, commonService, config) {
        var service = {
           
            getPostalCodeData: getPostalCodeData,
            getContactAssociations: getContactAssociations,
            getcontactAutoLookup: getcontactAutoLookup,
            getContactLookupObj: getContactLookupObj,

        };

        return service;


        function getPostalCodeData() {
            var url = serviceConfig.elasticSearchRemoteServer + 'AutoComplete?indexName=postalcodes&input=' + null + '&indexField=PostalCode&noOfRecords=100'
            var data;
            return data = new kendo.data.DataSource({
                transport: {
                    read: {
                        dataType: "json",
                        url: url
                    }
                }
            })
        }
        function getContactAssociations(id, stateid) {
          //  if (stateid) {
                if (id && stateid != 'new') {
                    var url = serviceConfig.clientCursorNewRemoteServer + 'GetAssociationsByContact?Id=' + id + '&accid=' + stateid;
                    return commonService.getEntities(url)
                } else if (stateid === 'new' && id) {
                    var url = serviceConfig.clientCursorRemoteServer + 'GetAssociationsByContactForNew?Id=' + id + '&accid=' + stateid + '&companyId=' + config.companyId;
                    return commonService.getEntities(url)
                }
          //  }
        }       
        function getcontactAutoLookup(accid) {
            return {
                type: 'json',
                transport: {
                    read: serviceConfig.ccApiRemoteServer + 'contacts?CompanyId=' + config.companyId + '&accountId=' + accid
                }
            }
        }
        function getContactLookupObj(requesttype, id,mode,contactid) {
            id = id == 'new' ? '00000000-0000-0000-0000-000000000000' : id;
            contactid = !contactid ? '00000000-0000-0000-0000-000000000000' : contactid;
            var url = serviceConfig.clientCursorNewRemoteServer + "CreateContactDirective?companyId=" + config.companyId + '&relationId=' + id + '&type=' + requesttype + '&contactMode=' + mode + '&contactId=' + contactid;
            return commonService.getEntities(url)
        }
    }
})();