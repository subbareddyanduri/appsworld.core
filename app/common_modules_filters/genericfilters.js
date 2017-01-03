(function () {
    'use strict'

    var serviceId = 'genericFilters';
    angular.module('appsworld').factory(serviceId,
        [genericFilters]);
    function genericFilters() {
        var service = {

        }
        return service;
    }

    // this filter will use convert the date  UTC to  client browser time format.
    
    angular.module('appsworld').filter('clientZoneDateTimeFormat', function ($filter, config) {
        return function (input) {
            if (input == null) { return ""; }
            var _date = $filter('date')(new Date(input), config.dateFormat);
            var input1 = moment.utc(input).toDate();
            //var _time = $filter('date')(new Date(input1), "h:mm a");
            var _time = $filter('date')(new Date(input1), config.timeFormat);
            return _date+" " +_time;
        };
    });
  
    angular.module('appsworld').filter('clientZoneDateFormat', function ($filter, config) {
        return function (input) {
            if (input == null) { return ""; }
            var _date = $filter('date')(new Date(input), config.dateFormat);
            var input1 = moment.utc(input).toDate();
            var _time = $filter('date')(new Date(input1), "h:mm a");
            //return _date.toUpperCase();
            return _date;
        };
    });
//this is used in HR cursor
   angular.module('appsworld').filter('clientZonedateTimeFormat', function (config) {
        return function (input) {
            if (input == null) { return ""; }
            var _date = moment(input).format(config.dateFormat.toUpperCase());
            var input1 = moment(input).toDate();
            var _time = moment(input1).format("h:mm a");
            return _date+" " +_time;
        };
    });
    //return negative values in paranthasis ...using in bean cursor   -24.458 converts (24.46)
    angular.module('appsworld').filter('makePositive', function ($filter, config) {
        return function (value) {
            if (value < 0) {
                value = '(' + Math.abs(value).toFixed(2) + ')';
            }
            return value;
        };
    });
    
    //return negative values in paranthasis and adding commas ...using in bean cursor   -78666624.458 converts (7,86,66,624.46)
    angular.module('appsworld').filter('makeDecimalFormat', function () {
        return function (value) {
            if(value) {
                if(value >= 0) {
                    //var e = parseFloat(Number(value.replace(/[^0-9\.]+/g,"")));
                    var f = parseFloat(value);
                    value  = f.toLocaleString('en-IN',{ minimumFractionDigits: 2 });
                }
               else {
                    //var e = parseFloat(Number(value.replace(/[^0-9\.]+/g,"")));
                    var f = parseFloat(value);
                    value  = '(' + Math.abs(f).toLocaleString('en-IN',{ minimumFractionDigits: 2 }) + ')';
                }
              return value;
            }
        };
    });

    angular.module('appsworld').filter('formatDateAndTime', function () {
        return function (input) {
            var input1= moment.utc(input).toDate()
            var newdate = moment().format();
            var createdhour, Message, createdhour4
            var yourvalue = parseFloat("0");
            var date2 = moment(input1).format('DD/MM/YYYY HH:mm');
            var date1 = moment(newdate).format('DD/MM/YYYY HH:mm');
            var data3 = moment(input1).format('DD/MM/YYYY');
            var data4 = moment(newdate).format('DD/MM/YYYY');
            var now = date1;
            var then = date2;
            if (data3 == data4) {
                var ms = moment(now, "DD/MM/YYYY HH:mm").diff(moment(then, "DD/MM/YYYY HH:mm"));
                var d = moment.duration(ms);
              var createdhour1 = Math.floor(d.asHours())
              if (createdhour1 == 0) {
                    var ms = moment(now, "DD/MM/YYYY HH:mm").diff(moment(then, "DD/MM/YYYY HH:mm"));
                    var d = moment.duration(ms);
                     createdhour4 = Math.floor(d.asMinutes());
                    if (createdhour4 == 0) {
                        return createdhour = " few seconds ago ";
                    } else { return createdhour = Math.floor(d.asMinutes()) + " minutes ago";   }   } 
                else { return createdhour = Math.floor(d.asHours()) + " hours ago";  }}
            else { return createdhour = moment(input1).format('DD/MM/YYYY HH:mm') }
        };
    });


    angular.module('appsworld').filter('UTCtime', function () {
        return function (input) {
            var date2
            var yourvalue = parseFloat("5.5");
        return date2 = moment.utc(input).add('hours', yourvalue).format('DD/MM/YYYY HH:mm');
          
        };
    });

    angular.module('appsworld').filter('limitTo40', function () {
    	return function (input) {
    		if (input.length > 10) {
    			var string = input;
    			var length = 10;
    			var trimmedString;
    			trimmedString = string.substring(0, length);
    			return trimmedString + ".....";}
    		else {return input;}};
    });

    angular.module('appsworld').filter('limitTo150', function () {
    	return function (input) {
    		if (input.length > 150) {
    			var string = input;
    			var length = 150;
    			var trimmedString;
    			trimmedString = string.substring(0, length);
    			return trimmedString + ".....";
				 }
    		else { return input;}};
    });

    /*Returns CommunicationType in grid With SelectedType (AddressBook)*/

    angular.module('appsworld').filter('communicationType', function () {
        return function (input) {
               var CommunationObj = [];
               var type;
               var value;
               var val;
            try {
                if (input.Communication.indexOf("key") === -1) {
                    if (input.Communication != '[{"":""}]' && input.Communication != [{ "undefined": "" }] && input.Communication != [{ "key": "undefined", "value": "" }]) {
                        for (var key in JSON.parse(input.Communication)) {
                            type = key;
                            value = JSON.parse(input.Communication)[key];
                            for (var key in value) {
                                Data.push({ type: key, value: value[key] }); }
                        }
                        if (CommunationObj[0].value == "undefined" || CommunationObj[0].type == "undefined" || CommunationObj[0].value == "") { return val = ''; }
                        else { return val = CommunationObj[0].type + " : " + CommunationObj[0].value; }
                    }
                }
                else {
                    if (input.Communication != '[{"":""}]' && input.Communication != [{ "undefined": "" }] && input.Communication != [{ "key": "undefined", "value": "" }]) {
                        for (var key in JSON.parse(input.Communication)) {
                            type = key;
                            value = JSON.parse(input.Communication)[key];
                            CommunationObj.push({ type: value.key, value: value.value });
                        }
                        if (CommunationObj[0].value == "undefined" || CommunationObj[0].type == "undefined" || CommunationObj[0].value == "") { return val = ''; }
                        else { return val = val = CommunationObj[0].type + " : " + CommunationObj[0].value; }
                    }
                }
            }
            catch (err) { }
            return val = '';
        }
    });




})();