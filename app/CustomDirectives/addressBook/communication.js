'use strict'
angular.module('addressbook')
.directive('communication', function () {
    return {
        restrict: 'E',
        templateUrl: 'CustomDirectives/addressBook/communication.html',
        scope: {
            jsonString: '=jsonString',
            isView: '='
        },
        require: 'ngModel',
        link: function (scope, element, attr, ngModel, commonService) {
            scope.$watch('jsonString', function () {
                var str = angular.copy(scope.jsonString);
                function replaceAll(str, find, replace) {
                    return str.replace(new RegExp(find, 'g'), replace);
                }
                if (str) { str = replaceAll(str, "'", '"'); }
                if (str) { ngModel.$setViewValue(getPhoneString(JSON.parse(str))); }

            });
            function getPhoneString(obj) {
                var str = "["
                var isValidString = false;
                angular.forEach(obj, function (index) {
                    if ((index.key == '' || index.key == null || index.key == 'null' || index.key == 'undefined' || index.key == undefined) && (index.value == '' || index.value == null || index.value == 'null' || index.value == 'undefined' || index.value == undefined)) {
                    } else {
                        isValidString = true;
                        str += '{' + '"key"' + ":" + '"' + index.key + '",' + '"value"' + ":" + '"' + index.value + '"' + '},'
                    }
                });
                var strin;
                if (isValidString) {
                    strin = str.substring(0, str.length - 1) + ']';
                } else {
                    strin = '';
                }
                return strin;
            }
        },
        controller: function ($http, $scope, $rootScope, serviceConfig, config, commonService, formValidate, customValidations) {
            function replaceAll(str, find, replace) {
                return str.replace(new RegExp(find, 'g'), replace);
            }
            $scope.$watch(function () {
                return $scope.jsonString;
            }, function (newObj) {
                //$rootScope.$on('setCommunication', function (event, args) {
                if ($scope.jsonString === "" || $scope.jsonString === undefined || $scope.jsonString === null || $scope.jsonString === '[{ "key": "", "value": "" }]' || $scope.jsonString === '["":""]') {
                    $scope.communication = [{ "key": "", "value": "" }];
                } else {
                    $scope.communication = [];
                    $scope.communications = [];
                    $scope.phones = [];

                    if ($scope.jsonString) { $scope.jsonString = replaceAll($scope.jsonString, "'", '"'); }
                    var communicationObj = JSON.parse($scope.jsonString);

                    for (var key in communicationObj) {
                        var type = key;
                        var value = communicationObj[key];
                        $scope.communication.push({ key: value.key, value: value.value });
                    }
                }
            });

            var url = serviceConfig.adminSgRemoteServer + 'ControlCodeCategory?';
            var cid;
            if (config.companyId === 'null' || config.companyId === null || config.companyId === 'undefined' || config.companyId === undefined) {
                cid = 0;
            } else {
                cid = config.companyId;
            }
            $http.get(url + "CompanyId=" + cid).success(function (response) {
                var _phoneTypes = [];
                for (var _index = 0; _index <= response.ControlCodes.length - 1; _index++) {
                    if (response.ControlCodes[_index].Status == "Active") {
                        _phoneTypes.push(response.ControlCodes[_index]);
                    }
                }
                $scope.phoneTypes = _phoneTypes;
                return response;
            });
            $scope.setComm = function () {
                $scope.jsonString = getPhoneString($scope.communication);

            }
            $scope.addCommunication = function () {
                $scope.communication.push({ "key": "", "value": "" });
            }
            $scope.deleteCommunication = function (index,obj) {
                if ($scope.communication.length === 1 || $scope.isView) { return; }
                $scope.communication.splice(index, 1);
                for (var i = 0; i <= obj.length; i++) {
                 if (obj[i].key =="null" && obj[i].Value != "") {
                     _validate();
                 }
                 else if ((obj[i].key != "null" || obj[i].key == "") && obj[i].Value != "") {
                     _validate();
                     $scope.jsonString = getPhoneString($scope.communication);

                 }
                   else if (obj[i].key != "" && obj[i].Value != "") {
                        $scope.isContactCMVT = false;
                        $scope.cntCMMValidationText = "";
                   }
                    else {
                        $scope.isContactCMVT = true;
                    }
                }
               
                //$scope.cntCMMValidationText =;
                $rootScope.isCommunicationValidationRequired = false;
            }
            $scope.categoryChange = function (key, value) {
                $scope.jsonString = getPhoneString($scope.communication);
                _validate(key, value);
            }

            function _validate(key, value) {
                $scope.isContactCMVT = false;
                $scope.cntCMMValidationText = '';
                var testCases = /null|undefined|""|'null'|'undefined'/
                angular.forEach($scope.communication, function (index) {
                    if ((testCases.test(index.key) || index.key === "") && index.value !== "") {
                        $scope.isContactCMVT = true;
                        $scope.cntCMMValidationText = 'Please select Communication Type';
                    }
                    else if ((!testCases.test(index.key) || index.key != "") && index.value !== "") {
                        if (customValidations.validateCommunicationType(index.key, index.value) !== true) {
                            $scope.isContactCMVT = true;
                            $scope.cntCMMValidationText = 'Invalid ' + index.key;
                        }
                    }
                    else if ((!testCases.test(index.key) && index.key != "") && index.value === "") {
                        $scope.isContactCMVT = true;
                        $scope.cntCMMValidationText = 'Please Enter ' + index.key;
                    }
                })
                if ($scope.isContactCMVT === true) {
                    $rootScope.isCommunicationValidationRequired = true;
                } else {
                    $rootScope.isCommunicationValidationRequired = false;
                }
            }
            $rootScope.getCommunication = function () {
                if (formValidate.validate('communication').isValidationRequired) {
                    $rootScope.isCommunicationValidationRequired = true;
                } else {
                    $rootScope.isCommunicationValidationRequired = false;
                }
                $scope.jsonString = commonService.getPhoneString($scope.communication);
                $scope.comm = $scope.jsonString;
            }
            function getPhoneString(obj) {
                var str = "[";
                angular.forEach(obj, function (index) {
                    str = str + "{" + '"' + "key" + '"' + ':' + '"' + index.key + '"' + "," + '"' + "value" + '"' + ":" + '"' + index.value + '"' + "},";
                });
                return str.substring(0, str.length - 1) + "]";
            }
        }
    }
});