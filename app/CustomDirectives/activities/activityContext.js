(function () {
    'use strict';
    angular.module('activitymodule', [])
    .factory('activitymoduleContext', activitymoduleContext)
    .value('activityConfig', {
        related_models: [],
        related_lu: {}
    })
    .filter('activity_description', function () {
        return function (input) {
            if (input) { return input.length > 80 ? input.substring(0, 80) + '...' : input; }
            else { return ''; }
        }
    })
    .filter('activitydate', function (config,$moment) {
        return function (input,type) {
            if (input) {
                var _timeFormat = type == 'Tasks' ? "" : " HH:mm";
                if (typeof (input) == 'string') {
                    if (input.indexOf('/') == -1)
                        return $moment(input, "YYYY-MM-DDThh:mm:ss").format(config.dateFormat.toUpperCase() + _timeFormat);
                    else
                        return $moment(input, "DD/MM/YYYY hh:mm:ss").format(config.dateFormat.toUpperCase() + _timeFormat);
                }
                else {
                    return $moment(input).format(config.dateFormat.toUpperCase() + _timeFormat);
                }
               
            }
        }
    })
    activitymoduleContext.$inject = ['commonService', 'serviceConfig', 'config', '$moment', 'activityConfig'];
    function activitymoduleContext(commonService, serviceConfig, config, $moment, activityConfig) {
        var activity_server = serviceConfig.activityRemoteServer + 'activity/'
        var related_models = [];
        var service = {
            all_activities: all_activities,
            request_activity: request_activity,
            save_activity: save_activity,
            sort_options: sort_options,
            get_cards: get_cards,
            sort_data: sort_data,
            hide_complete_button: hide_complete_button,
            filter_data: filter_data,
            delete_file: delete_file,
            files_length: files_length,
            related_list: related_list,
            set_participants: set_participants,
            isPrticipant: isPrticipant,
            save_activity_action: save_activity_action,
            delete_activity: delete_activity,
            reply_object: reply_object,
            save_reply: save_reply,
            edit_reply: edit_reply,
            delete_reply: delete_reply,
            relatedmodels: relatedmodels,
            saveviewby: saveviewby,
            getPreference : getPreference
        };
        return service;
        function all_activities(modulename, activitytype, relatedtype, relatedid) {
            var uri = activity_server + 'getallactivities?companyId=' + config.companyId + '&userName=' + config.userName + '&moduleName=' + modulename + '&activityType=' + activitytype + '&relatedType=' + relatedtype + '&relationId=' + relatedid;
            return commonService.getEntities(uri);
        }
        function getPreference(relatedtype,activitytype) {
            var uri = activity_server + 'getpreferences?userName=' + config.userName + '&relatedType=' + relatedtype + '&activityType=' + activitytype;
            return commonService.getEntities(uri);
        }
        //http://192.168.0.100:90/AWAuthDev/api/activity/getpreferences?userName=lakshmi@mailinator.com&relatedType=&activityType=TasksSorting
        //Save mypreferences
        function saveviewby(obj) {
            var url = serviceConfig.activityRemoteServer + "task/savepreference"
            return commonService.saveEntity(url, obj);
        }

        function relatedmodels(type, data) {
            if (type == 'set')
                related_models = data;
            else
                return related_models;
        }
        function request_activity(activity_type, activity_id,module_name) {
            return commonService.getEntities(activity_server + 'createactivity?companyId=' + config.companyId + '&activityId=' + activity_id + '&activityType=' + activity_type+ '&moduleName=' + module_name );
        }

        // function request_activity(activity_type, activity_id) {
        //     return commonService.getEntities(activity_server + 'createactivity?companyId=' + config.companyId + '&activityId=' + activity_id + '&activityType=' + activity_type);
        // }

        function set_activity_object(object, type, participants, relatedid, relatedtype, modulename, relatedname) {
            var obj = {};         
            object.ActivityType = type == 'All' ? '' : type;
            object.CursorName = modulename;
            if (object.CreatedDate && !object.ModifiedDate) { object.ModifiedDate = new Date(); object.ModifiedBy = config.userName; }
            if (!object.CreatedDate) { object.CreatedDate = new Date(); object.UserCreated = config.userName; }

            // filling participants
            if (participants && participants.length != 0) {
                object.ParticipantModel = [];
                angular.forEach(participants, function (index) {
                    var user = object.ParticipantsLU.filter(function (value) {
                        if(value)
                            return value.Id == index;
                    })[0];
                    if (user) {
                        object.ParticipantModel.push({ Id: user.Id, Name: user.Name, Status: 'Active', UserName: user.Username });
                    }
                });
            }
            else {
                object.ParticipantModel = [];
            }

            // filling related models
            if (object.RelatedModel.length != 0) {
                for (var i = 0; i <= object.RelatedModel.length - 1; i++) {
                    object.RelatedModel[i].Id = !object.RelatedModel[i].Id || object.RelatedModel[i].Id == '00000000-0000-0000-0000-000000000000' ? commonService.guid() : object.RelatedModel[i].Id;
                    if (object.RelatedModel[i].EntityType == '' || !object.RelatedModel[i].EntityType) { object.RelatedModel[i].EntityType = object.RelatedModel[i].Relation; }
                }              
            }
            if (object.RelatedModel.length == 0 && relatedtype) {
                object.RelatedModel.push({ EntityId: relatedid, EntityType: relatedtype, EntityName: relatedname, Id: commonService.guid() });
            }
            delete object['participants'];
            obj = object;
            return obj;
        }

        function save_activity(object, type, participants, relatedid, relatedtype, modulename, relatedname) {
            //TODO
            var duplicate_obj = angular.copy(object);
            var _result = { isValidate: false, messages: '' };
            // validating dates for task saving
            if (type == 'Tasks') {
                if (duplicate_obj.DueDate) {
                    if ($moment(duplicate_obj.DueDate) < $moment().startOf('day')) {
                        _result.isValidate = true;
                        _result.messages = 'Due Date must be later than current Date';
                        return Promise.resolve(_result);
                    }
                }
                if (duplicate_obj.RemindmeDate) {
                    if ($moment(duplicate_obj.RemindmeDate) < $moment().startOf('day')) {
                        _result.isValidate = true;
                        _result.messages = 'Remind me must be later or equal to current date';
                        return Promise.resolve(_result);
                    }
                    if ($moment(duplicate_obj.RemindmeDate) > $moment(duplicate_obj.DueDate)) {
                        _result.isValidate = true;
                        //_result.messages = 'Remind me must be less than Due Date';
                        _result.messages = 'Date of Remind Me must be earlier than the Due Date';
                        return Promise.resolve(_result);
                    }
                }
                if (duplicate_obj.DueDate)
                    object.DueDate = $moment(duplicate_obj.DueDate).format('YYYY-MM-DD');
                if (duplicate_obj.RemindmeDate)
                    object.RemindmeDate = $moment(duplicate_obj.RemindmeDate).format('YYYY-MM-DD');
            }
            // validating dates for Event saving
            if (type == 'Events') {
                var datetime = duplicate_obj.DueDate.split(' ');
                var _date = datetime[0];
                var _time = datetime[1];
                var _orgdate = _date.split('/')[2] + '-' + _date.split('/')[1] + '-' + _date.split('/')[0];
                var datetime = $moment(_orgdate + 'T' + _time);
                if (duplicate_obj.RemindmeDate) {
                    var rdatetime = duplicate_obj.RemindmeDate.split(' ');
                    var _rdate = rdatetime[0];
                    var _rtime = rdatetime[1];
                    var _rorgdate = _rdate.split('/')[2] + '-' + _rdate.split('/')[1] + '-' + _rdate.split('/')[0];
                    var remindme = $moment(_rorgdate + 'T' + _rtime);
                }
                if (datetime <= $moment()) {
                    _result.isValidate = true;
                    _result.messages = 'Date & Time must be later to current Date & Time';
                    return Promise.resolve(_result);
                }
                if (remindme && remindme<$moment()) {
                    _result.isValidate = true;
                    _result.messages = 'Remind me must be later or equal to current date';
                    return Promise.resolve(_result);
                }
                if (remindme > datetime) {
                    _result.isValidate = true;
                   // _result.messages = 'Remind me must be less than Date & Time';
                    _result.messages = 'Date of Remind Me must be earlier than the Date & Time';
                    return Promise.resolve(_result);
                }
                object.DueDate = _orgdate + 'T' + _time;
                if (duplicate_obj.RemindmeDate)
                    object.RemindmeDate = _rorgdate + 'T' + _rtime;
            }
            return commonService.saveEntity(activity_server + '/saveactivity', set_activity_object(object, type, participants, relatedid, relatedtype, modulename, relatedname));
        }

        function sort_options(tab,moduleName) {
            var source = [{ name: 'CreatedDate', applicable: 'Events,Tasks' }, { name: 'DateTime', applicable: 'Events' }, { name: 'DueDate', applicable: 'Tasks' }, { name: 'IsHighPriority', applicable: 'Events,Tasks,Notes' }, { name: 'RemindmeDate', applicable: 'Events,Tasks' }, { name: 'User', applicable: 'Events,Tasks' }];
            if(moduleName == 'Client') {
               source.push({ name: 'Subject', applicable: 'Events,Tasks,Notes' });
            }
            if (tab != 'All') {
                return source.filter(function (value) {
                    return value.applicable.indexOf(tab) != -1;
                });
            } else { return source; }

        }

        function get_cards(object) {
            var _result = [];
            var _rowslength = Math.ceil(object.length / 3);
            for (var i = 0; i <= _rowslength - 1; i++) {
                _result.push({ list: [] });
                for (var j = 0; j <= 2; j++) {
                    if (object[i * 3 + j])
                        _result[i].list.push(object[i * 3 + j]);
                }
            }
            return _result;
        }

        function filter_data(filter, data) {
            var _result = data.filter(function (value) {
                var isSuccess = false;
                for (var key in value) {
                    if (typeof (value[key]) != 'object' && typeof (value[key]) == 'string') {
                        if (value[key].toLowerCase().indexOf(filter.toLowerCase()) != -1) {
                            isSuccess = true;
                        }
                    }
                }
                if (isSuccess) { return value; }
            });
            return get_cards(_result);
        }

        function hide_complete_button(card) {
            var isPrticiepient = [];
            if (card.ParticipantModel) {
                isPrticiepient = card.ParticipantModel.filter(function (value) {
                    return value.UserName == config.userName;
                });
            }
            return config.userName == card.UserCreated || isPrticiepient.length != 0;
        }

        function sort_data(sortfield, data) {
            data = !data ? [] : data;
            var sorting = {
                IsHighPriority: function () {
                    var _listhigh = data.filter(function (value) {
                        return value.IsHighPriority;
                    });
                    var _listnothigh = data.filter(function (value) {
                        return !value.IsHighPriority;
                    });
                    return _listhigh.concat(_listnothigh);
                },
                any: function () {
                    if (sortfield.toLowerCase().indexOf('date') != -1) {
                        return data.sort(function (a, b) {
                            return new Date(b[sortfield]) - new Date(a[sortfield]);
                        });
                    }
                    else {
                        return data.sort(function (a, b) {
                            var x = a[sortfield].toLowerCase();
                            var y = b[sortfield].toLowerCase();
                            return x < y ? -1 : x > y ? 1 : 0;
                        });
                    }
                }
            }
            if (sortfield == 'IsHighPriority') {
                return get_cards(sorting[sortfield]());
            }
            if (!sortfield || sortfield == '') {
                return get_cards(data);
            }
            return get_cards(sorting.any());
        }

        function delete_file(file, object) {
           
            for (var i = 0; i < object.length; i++) {
                if (file.Id == object[i].Id&&file.RecStatus!="Added") {
                    object[i].RecStatus = 'Deleted';
                }
            }
            return object;
        }

        function files_length(object) {
            return object.filter(function (value) {
                return value.RecStatus != 'Deleted';
            }).length;
        }

        function related_list(relation, relationid, relations, index, relatedid, relatedtype) {
            if (index == 0) {
                if ((relation == 'Opportunity' || relation == 'Quotation') && relatedtype == 'Lead') {
                    var _method = relation == 'Opportunity' ? 'getopportunitybyleadid' : 'getquotationbyleadid';
                    return serviceConfig.activityRemoteServer + 'quotation/' + _method + '?id=' + relatedid;
                }
                return activity_server + 'RelatedLuList?companyId=' + config.companyId + '&relation=' + relation + '&relationId=' + relationid;
            }
            else {
                if ((relation == 'Opportunity' || relation == 'Quotation') && relatedtype == 'Lead') {
                    var _method = relation == 'Opportunity' ? 'getopportunitybyleadid' : 'getquotationbyleadid';
                    return serviceConfig.activityRemoteServer + 'quotation/' + _method + '?id=' + relations[0].EntityId;
                }
                else {
                    return activity_server + 'RelatedLuList?companyId=' + config.companyId + '&relation=' + relation + '&relationId=' + relationid;
                }
            }
        }

        function set_participants(object) {
            var _result = [];
            for (var i = 0; i <= object.length - 1; i++) {
                if (object[i].Status == 'Active') { _result.push(object[i].Id); }
            }
            return _result;
        }

        function isPrticipant(object) {
            return object.ParticipantModel.filter(function (value) {
                return value.UserName == config.userName;
            }).length != 0;
        }

        function save_activity_action(activity, action) {
            if (action == 'pin') {
                activity.IsPinned = !activity.IsPinned ? true : false;
                return commonService.saveEntity(activity_server + '/saveactivity', activity);
            }
            activity.ActivityStatus = action;

            return commonService.saveEntity(activity_server + '/saveactivity', activity);
        }

        function delete_activity(activity) {
            return commonService.confirmationDialog('Confirm Delete ?', 'Are you sure do you really want to delete?', 'Ok', 'Cancel').then(function (res) {
                if (res == 'ok') {
                    return commonService.getEntities(serviceConfig.activityRemoteServer + 'task/deleteactivitytask?activityId=' + activity.Id);
                }
                else { return Promise.resolve(res); }
            });
        }

        function reply_object(activityid) {
            return { "Reply": null, "Id": null, "UserCreated": config.userName, "ActivityId": activityid, "ParticipantModel": [], "FileRepoModel": [] };
        }

        function save_reply(replyobj, ParticipantsLU) {
            replyobj.Id = !replyobj.Id ? commonService.guid() : replyobj.Id;
            replyobj.ParticipantModel = [];
            angular.forEach(replyobj.participants, function (index) {
                var user = ParticipantsLU.filter(function (value) {
                    if(value)
                        return value.Id == index;
                })[0];
                if (user) {
                    replyobj.ParticipantModel.push({ Id: user.Id, Name: user.Name, Status: 'Active', UserName: user.Username });
                }
            });
            return commonService.saveEntity(serviceConfig.activityRemoteServer + 'task/savereply', replyobj);
        }

        function edit_reply(id) {
            return commonService.getEntities(serviceConfig.activityRemoteServer + 'task/getreplybyid?Id=' + id);
        }

        function delete_reply(id) {
            return commonService.confirmationDialog('Confirm Delete ?', 'Are you sure do you really want to delete?', 'Ok', 'Cancel').then(function (res) {
                if (res == 'ok') {
                    return commonService.getEntities(serviceConfig.activityRemoteServer + 'task/deletereply?replyId=' + id);
                }
                else { return Promise.resolve(res); }
            });
        }


    }
})();