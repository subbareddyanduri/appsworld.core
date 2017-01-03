
(function () {
    'use strict';
    angular.module('scheduler', [])
    .factory('scheduler', scheduler);
    scheduler.$inject = ['$moment', 'config', 'serviceConfig', 'commonService'];
    function scheduler(moment, config, serviceConfig, commonService) {
        var week_days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        var bg_colors = ['bg-1', 'bg-2', 'bg-3', 'bg-4', 'bg-5'];
        var service = {
            load_sheads: load_sheads,
            load_month_weeks: load_month_weeks,
            load_tasks: load_tasks,
            load_day_tasks: load_day_tasks,
            request_task: request_task,
            load_employees: load_employees,
            save_task: save_task,
            delete_task: delete_task,
            bg_colors: bg_colors,
            set_case_users: set_case_users,
            remove_tasks: remove_tasks,
            // load_tasks_by_user: load_tasks_by_user,
            update_object: update_object,
            concat_objects: concat_objects,
            remove_system_tasks: remove_system_tasks
        };
        return service;

        function load_sheads(view_type, date) {
            var sheads = [];
            if (!date) { date = new Date(); }
            var _duplicateDate = angular.copy(date);
            for (var i = 0; i <= 6; i++) {
                var _date = moment(_duplicateDate).add(i, 'days');
                sheads.push({ date: _date.format(config.dateFormat.toUpperCase()), day: week_days[_date.day()] });
            }
            return sheads;
        }
        function set_case_users(object) {
            var _result = {};
            if (object) {
                for (var i = 0; i <= object.length - 1; i++) {
                    _result[object[i].Id] = object[i].Name;
                }
            }
            return _result;
        }
        function load_month_weeks(date) {
            function nextWeek(index, dates) {
                index = index == 0 ? index : index * 7;
                var _dup = [];
                for (var i = index; i <= dates.length - 1; i++) {
                    if (i <= index + 6)
                        _dup.push(dates[i]);
                }
                return _dup;
            }
            var weeks = [];
            if (!date) { date = new Date(); }
            var _duplicateDate = angular.copy(date);
            var days = [];
            for (var i = 0; i <= 29; i++) {
                var _date = moment(_duplicateDate).add(i, 'days');
                days.push({ day: new Date(_date).getDate(), date: _date.format(config.dateFormat.toUpperCase()) });
            }
            for (var i = 0; i <= 4; i++) {
                weeks.push({ days: nextWeek(i, days) })
            }
            return weeks;
        }
        function remove_system_tasks(tasks) {
            return tasks.filter(function (item) {
                return !item.IsSystem;
            });
        }
        function load_tasks(listEmp, caseid, scheduler_date, view_type) {
            if (!scheduler_date) { scheduler_date = new Date(); }
            var _startDate = typeof (scheduler_date) == 'object' ? moment(scheduler_date).format('YYYY-MM-DD') : moment(scheduler_date, config.dateFormat).format('YYYY-MM-DD');
            var _endDate;
            if (view_type == 'month_view') {
                _endDate = moment(_startDate).add(29, 'days');
            }
            else { _endDate = moment(_startDate).add(6, 'days'); }
            _endDate = moment(_endDate).format('YYYY-MM-DD');
            var uri = serviceConfig.workflowRemoteScheduleServer + 'getsheduletask?lstEmployeeIds=' + JSON.stringify(listEmp) + '&startDate=' + _startDate + '&endDate=' + _endDate + '&caseId=' + caseid + '&companyId=' + config.companyId;
            return commonService.getEntities(uri);
        }
        function load_day_tasks(tasks, date, view_type) {
            var count = view_type == 'week_view' ? 6 : 29;
            function get_tasks(date) {
                return tasks.filter(function (value) {
                    if (value.Fromdate && value.Todate) {
                        return new Date(date) >= new Date(value.Fromdate) && new Date(date) <= new Date(value.Todate) && value.RecordStatus != 'Deleted';
                    }
                    else if (value.Fromdate) {
                        return new Date(date) >= new Date(value.Fromdate) && value.RecordStatus != 'Deleted';
                    }

                });
            }
            if (!date) { date = new Date(); }
            var _tasks = {};
            var _startDate = date;
            _startDate = typeof (_startDate) == 'object' ? moment(_startDate).format('YYYY-MM-DD') : moment(_startDate, config.dateFormat.toUpperCase()).format('YYYY-MM-DD');
            for (var i = 0; i <= count; i++) {
                _tasks[moment(_startDate).add(i, 'days').format(config.dateFormat.toUpperCase())] = get_tasks(moment(_startDate).add(i, 'days').format('YYYY-MM-DD'));
            }
            return _tasks;
        }

        function request_task(taskid) {
            taskid = taskid ? taskid : '00000000-0000-0000-0000-000000000000';
            var uri = serviceConfig.workflowRemoteScheduleServer + 'createscheduletask?id=' + taskid + '&companyId=' + config.companyId;
            return commonService.getEntities(uri);
        }

        function load_employees(caseid) {
            caseid = !caseid ? null : caseid;
            var uri = serviceConfig.workflowRemoteScheduleServer + 'getemployeesllokup?caseid=' + caseid + '&companyId=' + config.companyId;
            return commonService.getEntities(uri);
        }

        function delete_task(taskid) {
            var uri = serviceConfig.workflowRemoteScheduleServer + 'deletescheduletask?id=' + taskid + '&companyId=' + config.companyId;
            return commonService.getEntities(uri);
        }

        function save_task(object) {
            var uri = serviceConfig.workflowRemoteScheduleServer + 'savescheduletask';
            var _duplicatetask = angular.copy(object);
            _duplicatetask.StartDate = moment(_duplicatetask.StartDate).format('YYYY-MM-DDT00:00:00');
            _duplicatetask.EndDate = moment(_duplicatetask.StartDate).format('YYYY-MM-DDT00:00:00');
            _duplicatetask.Fromdate = _duplicatetask.StartDate;
            _duplicatetask.Todate = _duplicatetask.StartDate;
            _duplicatetask.TaskName = _duplicatetask.Title;
            _duplicatetask.ModifiedHours = parseFloat(_duplicatetask.Hours) - parseFloat(_duplicatetask.DPBH);
            _duplicatetask.RecordStatus = _duplicatetask.RecordStatus == 'Added' ? 'Added' : 'Modified';
            _duplicatetask.IsSystem = false;
            _duplicatetask.Id = commonService.guid();
            _duplicatetask.TaskId = _duplicatetask.TaskId == '00000000-0000-0000-0000-000000000000' ? angular.copy(_duplicatetask.Id) : _duplicatetask.TaskId;
            return _duplicatetask;
            //return commonService.saveEntity(uri,_duplicatetask);          
        }

        function remove_tasks(empid, tasks) {
            return tasks.filter(function (value) {
                return value.EmployeeId != empid;
            });
        }
        function update_object(tasks, object) {
            for (var i = 0; i <= tasks.length - 1; i++) {
                if (tasks[i].TaskId == object.TaskId) {
                    tasks[i] = object;
                }
            }
            return tasks;
        }
        function isExistingObject(id, objects) {
            return objects.filter(function (value) {
                return value.TaskId == id;
            }).length != 0;
        }
        function concat_objects(toObj, fromObj) {
            for (var i = 0; i <= fromObj.length - 1; i++) {
                if (!isExistingObject(fromObj[i].TaskId, toObj))
                    toObj.push(fromObj[i]);
            }
            return toObj;
        }
    }
})();