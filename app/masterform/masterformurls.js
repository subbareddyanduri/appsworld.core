(function () {
    'use strict';
    angular.module('appsworld')
    .factory('formurlsContext', formurlsContext);
    formurlsContext.$inject = ['serviceConfig','$stateParams','config'];
    function formurlsContext(serviceConfig, $stateParams, config) {
        var _id = $stateParams.Id == 'new' ? '00000000-0000-0000-0000-000000000000' : $stateParams.Id;
        var service = {
            campaign: {
                saveUrl: serviceConfig.clientCursorClientRemoteServerapi + "/SaveCampaign",
                lookups: serviceConfig.clientCursorClientRemoteServerapi + "/GetCampaign?companyId=" + config.companyId + '&campaignId=' + _id,
                saveDefaults:{}
            }
        }
        return service;
    }
})();