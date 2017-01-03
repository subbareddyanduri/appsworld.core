(function () {
    'use strict';
    angular
        .module('validationDirective', [])
        //allows digits only
        .directive('zNumber', function (formValidate) {
            return {
                restrict: 'A',
                //templateUrl: 'directive.html',
                //controller: 'directiveController'
                //transclude: true;
                //require: 'ngModel',
                link: function (scope, element, attrs, ctrl) {
                    element.on('blur', function (event) {
                        if (element[0].value != null && element[0].value != "" && element[0].value != undefined) {
                            var regex = /^[0-9]\d+?$/;
                            if (!regex.test(element[0].value)) {
                                formValidate.setValidationMessages(element[0].parentElement, "Digits Only");
                                return;
                            }
                            formValidate.removeInvalid(element[0].parentElement);
                        }
                    });
                }
            }
        })
        //allows decimal number only
         .directive('zDecimal', function (formValidate) {
             return {
                 restrict: 'A',
                 link: function (scope, element, attrs) {
                     element.on('blur', function (event) {
                         if (element[0].value != null && element[0].value != "" && element[0].value != undefined) {
                             var regex = /((\d+)+(\.\d+))$/;
                             if (!regex.test(element[0].value)) {
                                 formValidate.setValidationMessages(element[0].parentElement, "Decimal Number Only");
                                 return;
                             }
                             formValidate.removeInvalid(element[0].parentElement);
                         }
                     });
                 }
             }
         })
        //allows digits and decimals(any number)
        .directive('zNumberDecimal', function (formValidate) {
            return {
                restrict: 'A',
                link: function (scope, element, attrs) {
                    element.on('blur', function (event) {
                        if (element[0].value != null && element[0].value != "" && element[0].value != undefined) {
                            var regex = /^[0-9]\d*(\.\d+)?$/;
                            if (!regex.test(element[0].value)) {
                                formValidate.setValidationMessages(element[0].parentElement, "Digits Or Decimals Only");
                                return;
                            }
                            formValidate.removeInvalid(element[0].parentElement);
                        }
                        });
                    
                }
            }
        })
         //allows Email format only
     .directive('zEmail', function (formValidate) {
         return {
             restrict: 'A',
             link: function (scope, element, attrs, ctrl) {
                 element.on('blur', function (event) {
                     if (element[0].value != null && element[0].value != "" && element[0].value != undefined) {
                         var regex = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
                         if (!regex.test(element[0].value)) {
                             formValidate.setValidationMessages(element[0].parentElement, "Invalid Email");
                             return;
                         }
                         formValidate.removeInvalid(element[0].parentElement);
                     }
                 });
             }
         }
     })
        //allows digits and chars not special symbols
    .directive('zAlphaNumeric', function (formValidate) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs, ctrl) {
                element.on('blur', function (event) {
                    if (element[0].value != null && element[0].value != "" && element[0].value != undefined) {
                        var regex = /^[a-z0-9]+$/i;
                        if (!regex.test(element[0].value)) {
                            formValidate.setValidationMessages(element[0].parentElement, "Alphanumeric only");
                            return;
                        }
                        formValidate.removeInvalid(element[0].parentElement);
                    }
                });
            }
        }
    })
    //allows required date format only data-format="mmmm/dd/yyy"
     .directive('zDate', function (formValidate, customValidations) {
         return {
             restrict: 'A',
             link: function (scope, element, attrs, ctrl) {
                 element.on('blur', function (event) {
                     if (element[0].value != null && element[0].value != "" && element[0].value != undefined) {
                         if (customValidations.dateFormateValidator(element[0].value, element[0].dataset.format) !== true) {
                             formValidate.setValidationMessages(element[0].parentElement, customValidations.dateFormateValidator(element[0].value, element[0].dataset.format));
                             //formValidate.setValidationMessages(element[0].parentElement,"Invalid Date"));
                             return;
                         }
                         formValidate.removeInvalid(element[0].parentElement);
                     }
                 });
             }
         }
     })


})();

