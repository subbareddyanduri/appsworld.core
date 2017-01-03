(function () {
    'use strict';

    angular.module('masterGrids')
    .factory('subactionsContext', subactionsContext);
    subactionsContext.$inject = ['config', 'serviceConfig'];
    function subactionsContext(config, serviceConfig) {
        var subactions = {
            client: {
                template: {
                    delete_template:serviceConfig.templateRemoteServer + "deletetemplate?",
                    copy_template: serviceConfig.templateRemoteServer + "duplicatetemplate?",
                },
                lead: {
                    delete_lead: serviceConfig.clientCursorClientRemoteServer + "DeleteAccount?"
                }
            },
            bean: {
                receipt:{
                    void_receipt: serviceConfig.receiptRemoteServer + 'savereceiptdocumentvoid',//Void post call
                },
                revaluation:{
                    cancel_revaluation: serviceConfig.revaluationRemoteServer + 'savecancelrevaluation'//Cancel post call
                }
            },
            admin: {

            },
            hr: {
                jobapplication: {
                    delete_jobapplication: serviceConfig.hrmsRecruitment + "deletejobapplication?"
                }
            }
        }
       return subactions
    }
})();