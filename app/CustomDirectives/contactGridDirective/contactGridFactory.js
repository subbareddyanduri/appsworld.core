(function () {
    'use strict';

    angular
        .module('ContactGridDirapp',[])
        .factory('contactGridFactory', contactGridFactory);

    contactGridFactory.$inject = ['$http', 'serviceConfig', 'commonService','config'];
    function contactGridFactory($http, serviceConfig, commonService,config) {
        var service = {
            getAssociations: getAssociations,
            getleadAssociations: getleadAssociations,
            savePingAssosiation: savePingAssosiation,
            getContactleadAssoValidations:getContactleadAssoValidations,
            getContactAssValidation:getContactAssValidation,
            createContact:createContact,
            deleteContact:deleteContact

        };

        return service;

         function createContact() {
            var url = serviceConfig.clientCursorNewRemoteServer + 'CreateContact?companyId=' + config.companyId;
            return commonService.getEntities(url);
        }

        function getAssociations(id) {
            var url = serviceConfig.clientCursorNewRemoteServer + "GetAssociationsByContact?Id=" + id;
            return commonService.getEntities(url)
        }
        
        function getleadAssociations(id, leadid) {
            var url = serviceConfig.clientCursorRemoteServer + "GetAssociationsByContact?Id=" + id + "&accid=" + leadid;
            return commonService.getEntities(url)
        }

        function savePingAssosiation(Obj) {
            var url = serviceConfig.clientCursorRemoteServer + "UpdateAssociations";
            return commonService.saveEntity(url, Obj)
        }

       function deleteContact(contactId, leadId, contactType) {
            var url = serviceConfig.clientCursorNewRemoteServer + 'DeleteContact?contactId=' + contactId + '&accountId=' + leadId + '&Type=' + contactType;
            return commonService.getEntities(url);
        }

        function getContactleadAssoValidations(Obj,gridObj,id){
            var contactAssociations = Obj;
            var contactgridobject = gridObj
                  if (contactAssociations.length != 0) {
                                for (var i = 0; i <= contactAssociations.length - 1; i++) {
                                    if (contactAssociations[i].Communication != '{ "": "" }' && contactAssociations[i].Communication != ']') {
                                        var phones = [];
                                        var type;
                                        var value;
                                        for (var key in JSON.parse(contactAssociations[i].Communication)) {
                                            type = key;
                                            value = JSON.parse(contactAssociations[i].Communication)[key];
                                            for (var key in value) {
                                                phones.push({ type: key, value: value[key] });
                                            }
                                        }
                                        contactAssociations[i].Communications = phones;
                                    }
                                }
                                for (var i = 0; i <= contactgridobject.length - 1; i++) {
                                    if (contactgridobject[i].ContactId == id) {
                                        contactgridobject[i].Assosiations = [];
                                        for (var j = 0; j <= contactAssociations.length - 1; j++) {
                                            contactgridobject[i].Assosiations.push(contactAssociations[j]);
                                        }
                                    }
                                }
                            }
              return ;
        }

        function getContactAssValidation(Obj,conGridObj,id){
            var contactAssociations = Obj;
            var contactgridobject = conGridObj;
                if (contactAssociations.length != 0) {
                            for (var i = 0; i <= contactAssociations.length - 1; i++) {
                                if (contactAssociations[i].Communication != '{ "": "" }' && contactAssociations[i].Communication != ']') {
                                    var phones = [];
                                    var type;
                                    var value;
                                    for (var key in JSON.parse(contactAssociations[i].Communication)) {
                                        type = key;
                                        value = JSON.parse(contactAssociations[i].Communication)[key];
                                        for (var key in value) {
                                            phones.push({ type: key, value: value[key] });
                                        }
                                     }
                                    contactAssociations[i].Communications = phones;
                                }
                            }
                            for (var i = 0; i <= contactgridobject.length - 1; i++) {
                                if (contactgridobject[i].ContactId == id) {
                                    contactgridobject[i].Assosiations = [];
                                    for (var j = 0; j <= contactAssociations.length - 1; j++) {
                                        contactgridobject[i].Assosiations.push(contactAssociations[j]);
                           }
                         }
                       }
                    }
                    return;
                }
   
    }
})();