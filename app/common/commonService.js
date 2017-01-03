/*author:SubbaReddy
  Description: Common Service For AppsWorld  it  contains   common Methods to serve the data
*/
(function () {
    'use strict';

    var serviceId = 'commonService';
    angular.module('appsworld').factory(serviceId,
        ['$http', 'config', '$q', 'serviceConfig', 'sweetAlert', 'notify', '$moment', 'bootstrap.dialog','authService', commonService]);

    function commonService($http, config, $q, serviceConfig, sweetAlert, notifications, $moment, dialog, authService) {
        var isRouteChangeConfirmRequired = false;
        var intialObject = []; 
        var newObject = [];
        var intialAddr = [];
        var newAddr = [];
        var notifyTemplate = 'views/notification/notify.html';
        var notify = (function () {

            //notifications.closeAll();

            return {
                success: function (message) {
                    notifications.closeAll();
                    notifications({ message: message, classes: 'alert-success', templateUrl: notifyTemplate });
                },
                warning: function (message) {
                    notifications.closeAll();
                    notifications({ message: message, classes: 'alert-warning', templateUrl: notifyTemplate })
                }
            }
        })();

        var service = {
            getEntities: getEntities,
            saveEntity: saveEntity,
            setGridOptions: setGridOptions,
            setAdvancedGridOptions: setAdvancedGridOptions,
            setPagedGridOptions: setPagedGridOptions,
            isRouteChangeConfirmRequired: isRouteChangeConfirmRequired,
            intialObject: intialObject,
            newObject: newObject,
            datevalidations: datevalidations,
            newdatecompare:newdatecompare,
            getCommunicationObject: getCommunicationObject,
            getCommunicationjsonObject:getCommunicationjsonObject,
            validateFields: validateFields,
            guid: guid,
            disableEntity: disableEntity,
            getPhoneString: getPhoneString,
            dateformate:dateformate,          
            getfocusout:getfocusout,
            schemagride:schemagride,
            datepattern: datepattern,
            getfocusout1:getfocusout1,
            getViewMode: getViewMode,
            onlyNumbers: onlyNumbers,
            onlyNumberswithoutdot: onlyNumberswithoutdot,
            getAddrCommunicationString: getAddrCommunicationString,          
            //disableEntity1: disableEntity1,                               
            formatDate: formatDate,
            incrementDateFormat: incrementDateFormat,
            setPagedMasterGridOptions: setPagedMasterGridOptions,
            alerts: alerts,
            notify: notify,
            removeLocalStorageItems: removeLocalStorageItems,
            confirmationDialog: confirmationDialog,
            dirtyHandler: dirtyHandler,
            disableMultipleItems: disableItem,
            _modelFields:_modelFields,
            _kPagedGridOptions: _kPagedGridOptions,
            profileStatusOptions: profileStatusOptions,
            set_module_detail_id: set_module_detail_id
           
        }
        return service;
        function profileStatusOptions() {
            return {
                change: function (e) {
                    if (e.value < 50) {
                        this.progressWrapper.css({
                            "background-color": "red",
                            "border-color": "red"
                        });
                    } else if (e.value > 50 && e.value < 75) {
                        this.progressWrapper.css({
                            "background-color": "#EE9F05",
                            "border-color": "#EE9F05"
                        });
                    } else if (e.value > 75) {
                        this.progressWrapper.css({
                            "background-color": "green",
                            "border-color": "green"
                        });
                    }
                }
            }
        }
        function set_module_detail_id(module, detail) {
            if (authService.current_module(module)) {
                authService.current_module(module).ModuleDetails.filter(function (value) {
                    if (value.Heading == detail) {
                        window.localStorage.removeItem('ModuleDetailId');
                        window.localStorage.setItem('ModuleDetailId', value.Id);
                    }
                });
            }
            
        }
        function getEntities(url) {
            return $http.get(url);
        }

        function disableItem(selection,tableName,companyId) {
            
            var title;
            if (selection.length === 1) {
                if (selection[0].Status === 'Active') { title = 'Confirm Inactive ?' }
                else { title = 'Confirm Active ?' }
            }
            else if (selection.length > 1) { title = 'Confirm Active/Inactive ?'; }
            var message = 'Do you really want to ';
            if (selection.length === 1) {
                if (selection[0].Status === 'Active') { message = message + 'Inactive ?' }
                //else { title = 'Active ?' }
                else { message = message + 'Active ?' }
            }
            else if (selection.length > 1) { message = message + 'Active/Inactive ?'; }
            var _ids = [];
            var _status = [];
            angular.forEach(selection, function (index) {
                _ids.push(index.Id);
                _status.push(index.Status);
            });
          return confirmationDialog(title, message, 'Ok', 'Cancel').then(function (response) {
                if (response === 'ok') {
                    var obj = { id: _ids, tableName: tableName, status: _status,CompanyId:config.companyId };
                    // return masterGridDataContext.disableItems(obj);
                    return saveEntity(serviceConfig.apiCursorsRemoteServer + 'EnableOrDisableNew',obj);
                }
            });
        }

        function alerts(message,title) {
            function _success() {
                sweetAlert.swal({
                    title: title||"Success !",
                    text: message|| "Data saved !",
                    type: "success"
                });
            }

            function _warning() {
                sweetAlert.swal({
                    title: "Are you sure?",
                    text: "do you really want to "+message||"proceed"+ "?",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Ok",
                    cancelButtonText: "No",
                    closeOnConfirm: false,
                    closeOnCancel: false
                },
           function (isConfirm) {
               if (isConfirm) {
                   sweetAlert.swal(title||"Success", "Action completed success fully", "success");
               } else {
                   sweetAlert.swal("Cancelled", "Action ignored :)", "error");
               }
           });
            }
            function _error() {
                sweetAlert.swal(title||"Cancelled", message||"Action ignored :)", "error");
            }
            return {
                success: _success,
                warning: _warning,
                error:_error
            }
        }

        function dirtyHandler(Action) {
            return confirmationDialog('Data Modified Alert', 'Please save the data before proceeding to ' + Action || 'specified action', 'Ok');
        }

        function confirmationDialog(title, message, okText, cancelText) {
            return dialog.confirmationDialog(title, message, okText, cancelText);
        }

        //incrementing date one day(bcoz after selecting from date picker date less one day)
        function incrementDateFormat(date) {
            var now = new Date(date);
            var year = now.getFullYear();
            var month = now.getMonth() + 1;
            var day = now.getDate();
            var hour = now.getHours();
            var minute = now.getMinutes();
            var second = now.getSeconds();
            if (month.toString().length == 1) {
                var month = '0' + month;
            }
            if (day.toString().length == 1) {
                var day = '0' + day;
            }
            if (hour.toString().length == 1) {
                var hour = '0' + hour;
            }
            if (minute.toString().length == 1) {
                var minute = '0' + minute;
            }
            if (second.toString().length == 1) {
                var second = '0' + second;
            }
            var dateTime = year + '-' + month + '-' + day + 'T' + hour + ':' + minute + ':' + second;
            return dateTime;
        }

        function saveEntity(url, object) {
            return $http.post(url, object).success(function (response) {
                return response;
            }).error(function (data, status) {
                return { data: data, status: status };
            })
        }

        function setGridOptions(url, columns) {
            return {
                dataSource: {
                    type: 'json',
                    transport: {
                        read: url
                    },
                    pageSize: 20
                },
                pageable: {
                    pageSizes: true,
                    refresh: true,
                    buttonCount: 5
                },
                filterable: true,
                sortable: true,
                columns: columns
            }
        }

        function setAdvancedGridOptions(url, columns,filter) {
            return {
                dataSource: {
                    type: "json",
                    transport: {
                        read: url
                    },
                    pageSize: 20,
                    filter: filter
                },
               // height: 550,
                // groupable: true,
                filterable:true,
                sortable: true,
                reorderable: true,
                resizable: true,
                columnMenu: true,
                pageable: {
                    pageSizes: ['All', 5, 10, 20, 50, 100],
                    refresh: true,
                    buttonCount: 5
                },
                columns: columns
            }
        }

        function schemagride(obj, fields, aggregate, columns) {
            return {
                dataSource: {
                    data: obj,

                    schema: {
                        model: {
                            fields: fields,                           
                            aggregate: aggregate,
                            pageSize: 20,
                        },

                        pageable: {
                            refresh: true,
                            pageSizes: true,
                            buttonCount: 5
                        },
                        sortable: true,                     
                        scrollable: true,
                        filterable: {
                            extra: false,
                            operators: {
                                string: {
                                    startswith: "Starts with",
                                    eq: "Is equal to",
                                    neq: "Is not equal to"
                                },
                                number: {
                                    eq: "Is equal to"

                                }
                            }
                        },

                        columns: columns

                    }
                }
            }
        }
        function _modelFields(columns) {
            var _modelFields = {};
            angular.forEach(columns, function (index) {
                if (index.field) {
                    _modelFields[index.field] = { type: "string" };
                }
            });
            return _modelFields;
        }
        function _kPagedGridOptions(url,columns) {
            return {
                columns: columns,
                pageable: {
                    pageSizes: ['All', 5, 10, 20, 50, 100],
                    refresh: true,
                    buttonCount: 5
                },
                sortable: true,
                filterable: true,
                columnMenu: true,
                dataSource: {
                    serverPaging: true,
                    serverFiltering: true,
                    serverSorting: true,
                    pageSize: 10,
                    schema: {
                        data: "Data",
                        total: "Total",
                        model: {
                            id: "Id",
                            fields: _modelFields(columns)
                        }
                    },
                    batch: false,
                    transport: {
                        read: {
                            url: url,
                            contentType: "application/json"
                        },
                        parameterMap: function (data, operation) {
                            return JSON.stringify(data) + '&companyId=' + config.companyId;
                        }
                    }
                }
            }

        }

        function setPagedGridOptions(url, columns) {
            var intialLoad = true;
            return {
                dataSource: {
                    transport: {
                        read: {
                            url: url,
                            contentType: "application/json",
                            type: "GET"
                        },
                        parameterMap: function (options) {
                            var t = 0; var s = 0; var sort; var filters = '';
                            for (var key in options) {
                                if (key == 'take') {
                                    t = options[key];
                                } if (key == 'skip') {
                                    s = options[key]
                                }
                                if (key == 'sort' && options[key].length != 0) {
                                    sort = options[key][0].field + ' ' + options[key][0].dir;
                                }
                                if (key == 'filter' && options[key] != null) {
                                    for (var s in options[key].filters) {
                                        if (options[key].filters[s].operator == 'contains') {
                                            filters = filters + 'substringof(' + "'" + options[key].filters[s].value + "'," + options[key].filters[s].field + ') eq true and ';
                                        }
                                        if (options[key].filters[s].operator == 'eq') {
                                            filters = filters + options[key].filters[s].field + ' eq ' + "'" + options[key].filters[s].value + "' and ";
                                        }
                                        if (options[key].filters[s].operator == 'startswith' || options[key].filters[s].operator == 'endswith') {
                                            filters = filters + options[key].filters[s].operator + "(" + options[key].filters[s].field + ",'" + options[key].filters[s].value + "') and ";
                                        }
                                        if (options[key].filters[s].operator == 'neq') {
                                            filters = filters + options[key].filters[s].field + ' ne ' + "'" + options[key].filters[s].value + "' and ";
                                        }
                                        if (options[key].filters[s].operator == 'doesnotcontain') {
                                            filters = filters + 'substringof(' + "'" + options[key].filters[s].value + "'," + options[key].filters[s].field + ') eq false and ';
                                        }
                                    }
                                    filters = filters.substring(0, filters.length - 4);
                                }
                                var _options = { $take: t, $skip: s, page: options['page'], pageSize: options['pageSize'], $orderby: sort };
                                if (filters != '') {
                                    _options['$filter'] = filters;
                                }
                            }
                            return _options;
                        }
                    },
                    requestStart: function () {
                        if (intialLoad) {
                            kendo.ui.progress($('[kendo-grid]'), true);
                        }
                    },
                    requestEnd: function () {
                        if (intialLoad) {
                            kendo.ui.progress($('[kendo-grid]'), false);
                            intialLoad = false;
                        }
                    },
                    schema: {
                        data: "Items",
                        total: "Count",
                    },
                    pageSize: 20,
                    serverPaging: true,
                    height: '400px',
                    serverFiltering: true,
                    serverSorting: true
                },
                filterable: true,
                columnMenu: true,
                sortable: true,
                 reorderable: true,
                resizable: true,
                pageable: {
                    pageSizes: ['All',5,10,20,50,100],
                    refresh: true,
                    buttonCount: 5
                },
                columns: columns
            }
        }

        function setPagedMasterGridOptions(url, columns) {
            var intialLoad = true;
            return {
                dataSource: {
                    transport: {
                        read: {
                            url: url,
                            contentType: "application/json",
                            type: "GET"
                        },
                        parameterMap: function (options) {
                            var t = 0; var s = 0; var sort; var filters = '';
                            for (var key in options) {
                                if (key == 'take') {
                                    t = options[key];
                                } if (key == 'skip') {
                                    s = options[key]
                                }
                                if (key == 'sort' && options[key].length != 0) {
                                    sort = options[key][0].field + ' ' + options[key][0].dir;
                                }
                                if (key == 'filter' && options[key] != null) {
                                    for (var s in options[key].filters) {
                                        if (options[key].filters[s].operator == 'contains') {
                                            filters = filters + 'substringof(' + "'" + options[key].filters[s].value + "'," + options[key].filters[s].field + ') eq true and ';
                                        }
                                        if (options[key].filters[s].operator == 'eq') {
                                            filters = filters + options[key].filters[s].field + ' eq ' + "'" + options[key].filters[s].value + "' and ";
                                        }
                                        if (options[key].filters[s].operator == 'startswith' || options[key].filters[s].operator == 'endswith') {
                                            filters = filters + options[key].filters[s].operator + "(" + options[key].filters[s].field + ",'" + options[key].filters[s].value + "') and ";
                                        }
                                        if (options[key].filters[s].operator == 'neq') {
                                            filters = filters + options[key].filters[s].field + ' ne ' + "'" + options[key].filters[s].value + "' and ";
                                        }
                                        if (options[key].filters[s].operator == 'doesnotcontain') {
                                            filters = filters + 'substringof(' + "'" + options[key].filters[s].value + "'," + options[key].filters[s].field + ') eq false and ';
                                        }
                                    }
                                    filters = filters.substring(0, filters.length - 4);
                                }
                                var _options = { $take: t, $skip: s, page: options['page'], pageSize: options['pageSize'], $orderby: sort };
                                if (filters != '') {
                                    _options['$filter'] = filters;
                                }
                            }
                            return _options;
                        }
                    },
                    requestStart: function () {
                        if (intialLoad) {
                            kendo.ui.progress($('[kendo-grid]'), true);
                        }
                    },
                    requestEnd: function () {
                        if (intialLoad) {
                            kendo.ui.progress($('[kendo-grid]'), false);
                            intialLoad = false;
                        }
                    },
                    schema: {
                        data: "Items",
                        total: "Count",
                    },
                    pageSize: 20,
                    serverPaging: true,
                    height: '400px',
                    serverFiltering: true,
                    serverSorting: true
                },
                filterable: true,
                columnMenu: true,
                sortable: true,
                pageable: {
                    pageSizes: ['All',15,20,50,100,150,200],
                    refresh: true,
                    buttonCount: 5
                },
                columns: columns,
                scrolable: true,
                
            }
        }

        function onlyNumbers(event) {
            var keys = {
                'up': 38, 'right': 39, 'down': 40, 'left': 37,
                'escape': 27, 'backspace': 8, 'tab': 9, 'enter': 13, 'del': 46,
                '0': 48, '1': 49, '2': 50, '3': 51, '4': 52, '5': 53, '6': 54, '7': 55, '8': 56, '9': 57
            };
            for (var index in keys) {
                if (!keys.hasOwnProperty(index)) continue;
                if (event.charCode == keys[index] || event.keyCode == keys[index]) {
                    return; //default event
                }
            }
            event.preventDefault();
        };

        function onlyNumberswithoutdot(event) {
            var keys = {
                'up': 38, 'right': 39, 'down': 40, 'left': 37,
                'escape': 27, 'backspace': 8, 'tab': 9, 'enter': 13,
                '0': 48, '1': 49, '2': 50, '3': 51, '4': 52, '5': 53, '6': 54, '7': 55, '8': 56, '9': 57
            };
            for (var index in keys) {
                if (!keys.hasOwnProperty(index)) continue;
                if (event.charCode == keys[index] || event.keyCode == keys[index]) {
                    return; //default event
                }
            }
            event.preventDefault();
        };

        function getCommunicationObject(jsonString) {
            var _communicationObj = [];
            try {
                if (jsonString != '[{"":""}]' && jsonString != "" && jsonString != null) {
                    var communicationObj = JSON.parse(jsonString);
                    for (var i = 0; i <= communicationObj.length - 1; i++) {
                        for (var key in communicationObj[i]) {
                            var type = key;
                            var value = communicationObj[i][key];
                            _communicationObj.push({ type: type, value: value });
                        }
                    }

                } else {
                    _communicationObj.push({"key": "", "value": "" });
                }
            } catch (err) { }
            return _communicationObj;
        }

        function getCommunicationjsonObject(jsonString) {
            var _communicationObj = [];
            try {
                if (jsonString != '[{"":""}]' && jsonString != "" && jsonString != null) {
                    var communicationObj = JSON.parse(jsonString);
                    for (var i = 0; i <= communicationObj.length - 1; i++) {
                        //for (var key in communicationObj[i]) {
                        //    var type = key;
                        //    var value = communicationObj[i][key];
                        _communicationObj.push({ type: communicationObj[i].key, value: communicationObj[i].value });
                        //}
                       // console.log(communicationObj[i]);


                    }

                } else {
                    _communicationObj.push({ "key": "", "value": "" });
                }
            } catch (err) { }
            return _communicationObj;
        }

        function guid() {
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000)
                  .toString(16)
                  .substring(1);
            }
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
              s4() + '-' + s4() + s4() + s4();
        }

        function validateFields(Id) {
            var _inputFields;
            $("#" + Id).each(function () {
                _inputFields = $(this).find(':input') //<-- Should return all input elements in that specific form.
            });
            for (var _index = 0; _index <= _inputFields.length - 1; _index++) {
                if (_inputFields[_index].type != 'file' && _inputFields[_index].type != 'checkbox' && _inputFields[_index].type != 'button') {
                    if (_inputFields[_index].dataset.validationtype) {
                        if (_inputFields[_index].dataset.validationtype == 'email') {
                            if (!/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i.test(_inputFields[_index].value)) {
                            }
                        }
                    }
                }
            }
        }
        // date validations
        function dateformate(id) {
        return  /(((0|1)[0-9]|2[0-9]|3[0-1])\/(0[1-9]|1[0-2])\/((19|20)\d\d))$/.test(id)
        }
        
        function datevalidations(fdate, sdate) {
            fdate = $moment(fdate, angular.uppercase(config.dateFormat)).format('DD/MM/YYYY');
            sdate = $moment(sdate, angular.uppercase(config.dateFormat)).format('DD/MM/YYYY');
            return $.datepicker.parseDate('dd/mm/yy', fdate) > $.datepicker.parseDate('dd/mm/yy', sdate)
        }
       
        function newdatecompare(pdate, tdate) {
            pdate = $moment(pdate, angular.uppercase(config.dateFormat)).format('DD/MM/YYYY');
            tdate = $moment(tdate, angular.uppercase(config.dateFormat)).format('DD/MM/YYYY');
            return $.datepicker.parseDate('dd/mm/yy', pdate) < $.datepicker.parseDate('dd/mm/yy', tdate);
        }

        function datepattern(id) {
            return /(((0|1)[0-9]|2[0-9]|3[0-1])\/(0[0-9]|1[0-2]))$/.test(id)
      }

        function getfocusout1(idvalue) {
            var dateformate = idvalue;
            var day = dateformate.split("/")[0]
            var month = dateformate.split("/")[1]

            if (day.length == 1 && month.length == 1) {
                return "0" + day + "/" + "0" + month;
            }
            if (day.length == 2 && month.length == 2) {
                return dateformate;
            }
            if (day.length == 1 && month.length == 2) {
                return "0" + day + "/" + month;
            }
            if (day.length == 2 && month.length == 1) {
                return day + "/" + "0" + month;
            }
            else {
                return dateformate;
            }

      }

        function getfocusout(idval) {
            var dateformate = idval;
                var day = dateformate.split("/")[0]
                var month = dateformate.split("/")[1]
                var year = dateformate.split("/")[2]
                if (day.length == 1 && month.length == 1 && year.length == 2) {
                    if (year <= 25) {
                      return  "0" + day + "/" + "0" + month + "/" + "20" + year;
                    }
                    else {return "0" + day + "/" + "0" + month + "/" + "19" + year;}
                }
                if (day.length == 2 && month.length == 2 && year.length == 4) {
                  return  dateformate;
                }
                if (day.length == 1 && month.length == 2 && year.length == 2) {
                    if (year <= 25) {
                     return   "0" + day + "/" + month + "/" + "20" + year;
                    }
                    else {return "0" + day + "/" + month + "/" + "19" + year;}
                }
                if (day.length == 2 && month.length == 2 && year.length == 2) {
                    if (year <= 25) {
                     return   day + "/" + month + "/" + "20" + year;
                    }
                    else {return  day + "/" + month + "/" + "19" + year;}
                }
                if (day.length == 2 && month.length == 1 && year.length == 2) {
                    if (year <= 25) {
                      return day + "/" + "0" + month + "/" + "20" + year;
                    }
                    else {return  day + "/" + "0" + month + "/" + "19" + year;}
                }
                if (day.length == 1 && month.length == 2 && year.length == 4) {
                  return  "0" + day + "/" + month + "/" + year;
                }
                if (day.length == 1 && month.length == 1 && year.length == 4) {
                  return  "0" + day + "/" + "0" + month + "/" + year;
                }
                if (day.length == 2 && month.length == 1 && year.length == 4) {
                   return day + "/" + "0" + month + "/" + year;
                }
                else {return dateformate;}
            }

        function disableEntity(id, tableName, isenable1, title, title1,isDelete) {
            // if (isenable1 == 'Active') {
            if (isDelete) {var Status ="Delete"}
            else{var Status = isenable1 == 'Active' ? 'Inactive' : 'Active' }
           
            return dialog.deleteDialog(title, Status).then(function (res) {
                   if (res == "ok") {
                       return confirmDelete1();
                   }
               });           
            function confirmDelete1() {
                var deferred = $q.defer();
                $http.get(serviceConfig.commonRemoteServer + "EnableOrDisable", { params: { "Id": id, "TableName": tableName, "Status": isenable1, userName:config.userName } }).success(function (response) {
                   deferred.resolve(response);
                }).error(function (err, status) {
                   deferred.reject(err);
                })
               return deferred.promise;
            }
        }       

        /*ViewMode*/
        function getViewMode(formName) {
            for (var i = 0; i <= formName.length - 1; i++) {
                $("#" + formName[i] + " input[type=text]").replaceWith(function () {
                    return "<input class='k-textbox w100p' value='" + $(this).val() + "' disabled>"
                });
                $("#" + formName[i] + " input[type=url]").replaceWith(function () {
                    return "<input class='k-textbox w100p' value='" + $(this).val() + "' disabled>"
                });
                $("#" + formName[i] + " input[type=email]").replaceWith(function () {
                    return "<input class='k-textbox w100p' value='" + $(this).val() + "' disabled>"
                });
                $("#" + formName[i] + " input[type=number]").replaceWith(function () {
                    return "<input class='k-textbox w100p' value='" + $(this).val() + "' disabled>"
                });
                $("#" + formName[i] + " input[type=checkbox]").replaceWith(function () {
                    return $(this).attr('disabled', true);
                });
                $("#" + formName[i] + " textarea").replaceWith(function () {
                    return "<br/><input class='k-textbox w100p' value='" + $(this).val() + "' disabled>";
                });
                $("#" + formName[i] + "select [id=dptidentificationtype]").replaceWith(function () {
                    return "<input class='k-textbox w100p' value='" + $(this).children("option").filter(":selected").text() + "' disabled>";
                });
            }
        }

        function getPhoneString(obj)
        {
            var str = "["
            var isValidString = false;
            angular.forEach(obj, function (index) {
                if (index.key == '' && index.value == '') {

                } else {
                    isValidString = true;
                    str += '{'+'"key"'+":"+'"'+index.key+'",'+'"value"'+":"+'"'+index.value+'"'+'},'
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

        function getAddrCommunicationString(obj) {
            var str = "["
            var isValidString = false;
            angular.forEach(obj, function (index) {
                if (index.key.CodeValue == '' && index.value == '') {

                } else {
                    isValidString = true;
                    str += '{' + '"key"' + ":" + '"' + index.key.CodeValue + '",' + '"value"' + ":" + '"' + index.value + '"' + '},'
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

        function formatDate(date) {
            var d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

            if (month.length < 2) month = '0' + month;
            if (day.length < 2) day = '0' + day;

            return [month, day, year, ].join('/');
        }

        function removeLocalStorageItems(prefix) {
            for (var key in window.localStorage) {
                if (key.indexOf(prefix) != -1) {
                    window.localStorage.removeItem(key);
                }
            }
        }
    }
})();
