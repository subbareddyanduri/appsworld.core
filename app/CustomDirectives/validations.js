(function () {
    'use strict';

    var app = angular.module('ZValidations');
    app .directive('formValidate', function (customValidations,formValidate,$moment,config) {
        return {
            restrict: 'A',
            link: function (scope, elem, attr) {
                // function change_date_format(value) {
                //     var _format = config.dateFormat.toUpperCase();
                //     var _splitter = _format.indexOf('/') == -1 ? '-' : '/';
                //     var _splittedformat = _format.split(_splitter);
                //     var _year = new Date().getFullYear().toString();
                //     var _min, _din, _yin;   // month,day,year indexes
                //     for (var key in _splittedformat) {
                //         if (_splittedformat[key] == 'MM'||_splittedformat[key] == 'MMM'||_splittedformat[key] == 'MMMM') { _min = key; }
                //         else if (_splittedformat[key] == 'YYYY' || _splittedformat[key] == 'YY') { _yin = key; }
                //         else if (_splittedformat[key] == 'DD') { _din = key; }
                        
                //     }
                //     var _date = value.split(_splitter);
                //     for (var key in _date) {
                //         if (_date[key].length == 1) { _date[key] = "0" + _date[key]; }
                //     }
                //     if(_date[_yin]){
                //         if(_date[_yin].length==1){_date[_yin]="200"+_date[_yin];}
                //         else if(_date[_yin].length==2){_date[_yin]="20"+_date[_yin];}
                //         else if(_date[_yin].length==3){_date[_yin]="2"+_date[_yin];}
                //         _year=_date[_yin];
                //     }
                //     var _fulldate = _date[_din] +"/"+ _date[_min] +"/"+ _year;
                //     return $moment(_fulldate, _splittedformat[_din]+"/"+_splittedformat[_min]+"/"+_splittedformat[_yin]).format(_format);
                // }
                angular.forEach(elem[0], function (node) {
                    if (node.dataset){
                    if (node.dataset.validationtype) {
                        $('#' + node.id).bind('blur', function () {
                            formValidate.removeInvalid(node.parentElement);
                        //     if (node.dataset.validationtype.indexOf('date') != -1&&node.value) {
                        //         node.value = change_date_format(node.value) == "Invalid date" ? node.value : change_date_format(node.value);
                        //   }
                            function validate(type, value, fieldName,field,lookupvalue) {

                                if (type == 'email') {
                                    return customValidations.validateEmail(value) == true ? true :formValidate.modifyFieldName(fieldName)+ ' is Invalid';
                                }
                                else if (type == 'decimal') {
                                    return customValidations.valiadteDecimal(value);
                                }
                                else if (type == 'url' || type == 'Website') {
                                    return customValidations.valiadteUrl(value);
                                }
                                else if (type == 'alpha') {
                                    return customValidations.validateAlpha(value);
                                }
                                else if (type == 'alphanumaric') {
                                    return customValidations.validateAlphaNumaric(value);
                                }
                                else if (type == 'number') {
                                    return customValidations.validateNumber(value);
                                }
                                else if (type == 'required') {
                                    value = value.trim().length == 0 ? '' : value;
                                    return value != undefined && value != '' && value != null == true ? true :formValidate.modifyFieldName(fieldName) + ' is required';
                                }
                                else if (type == 'lpostalcode'&&field.dataset.validationrequired=='true') {
                                    value = value.trim().length == 0 ? '' : value;
                                    return customValidations.validateLocalPostalCode(value);
                                }
                                else if (type == 'fpostalcode' && field.dataset.validationrequired == 'true') {
                                    value = value.trim().length == 0 ? '' : value;
                                    return customValidations.validateForeignPostalCode(value);
                                }
                               else if (type == 'date') {
                                    value = value.trim().length == 0 ? '' : value;
                                    return customValidations.dateFormateValidator(value,field.dataset.format);
                               }
                               else if (type === 'newdatecompare') {
                                   value = value.trim().length == 0 ? '' : value;
                                   return customValidations.compareWithNewDate(value);
                               }
                               else if (type === 'lookup') {
                                   if (!lookupvalue) {
                                       return 'select from lookup';
                                   }
                                   return true;
                               }
                               else if (type === 'mobile' || type === 'phone' || type === 'fax') {
                                   value = value.trim().length == 0 ? '' : value;
                                   return customValidations.validatePhone(value, fieldName);
                               }
                               else if(type=='maxlength'){
                                   value = value.trim().length == 0 ? '' : value;
                                   return value.length<=parseInt(field.dataset.maxvalue)?true:fieldName+' length should be '+field.dataset.maxvalue+' characters';
                               }
                               else if (type == 'country') {
                                   value = value.trim().length == 0 ? '' : value.trim();
                                   if (value) {
                                       var _result = Countries.filter(function (country) {
                                           return country.name.toLowerCase() == value.toLowerCase();
                                       });
                                       return _result.length == 0 ? 'select from lookup' : true;
                                   }

                                   else
                                       return true;
                               }
                               else if(type=='time'){
                                    value = value.trim().length == 0 ? '' : value.trim();
                                    if(value){return $moment(value,"LT").isValid()?true:'Invalid time';}
                               }
                               else if (!type || type == '') { return true; }
                            }
                            var fieldValidationTypes = node.dataset.validationtype.split(',');
                            var lookupvalue = !node.dataset.lookupvalue ? null : node.dataset.lookupvalue;
                            for (var i = 0; i <= fieldValidationTypes.length - 1; i++) {
                                formValidate.removeInvalid(node.parentElement);
                                var val = validate(fieldValidationTypes[i], node.value, node.name, node,lookupvalue);
                                if (val != true) {
                                    $(node).addClass('error');
                                    formValidate.setValidationMessages(node.parentElement, val);
                                    break;
                                } else {
                                    $(node).removeClass('error');
                                }
                            }
                            
                        })
                    }
                    }
                })
            }
        }
    })
})();
