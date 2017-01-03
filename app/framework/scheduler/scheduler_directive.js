(function () {
    'use strict';
    angular.module('scheduler')
    .directive('schedulerModule', schedulerModule)
    .controller('scheduleTaskController', scheduleTaskController)

    schedulerModule.$inject = ['scheduler', 'config', '$moment', '$uibModal', '$rootScope'];
    function schedulerModule(scheduler, config, moment, uibModal, $rootScope) {
        var link = function (scope, ele, attr) {
            scope.view_type = 'week_view';
            scope.sheads = [];
            scope.month_weeks = [];
            scope.load_sheads = load_sheads;
            scope.load_month_weeks = load_month_weeks;
            scope.individual_actions = individual_actions;
            scope.request_task = request_task;
            scope.delete_task = delete_task;
            scope.load_bg_color = load_bg_color;
            scope.bg_colors = scheduler.bg_colors;
            scope.create_task = create_task;
            scope.selectedList = [];
            scope.load_tasks = load_tasks;
            scope.schedulerDate = new Date();
            scope.selectedList = !scope.users ? [] : angular.copy(scope.users);
            var all_tasks = [];
            load_case_members();           
            scope.$on('refresh_schedule_items', function () {
                refresh();
            });

            scope.selectUser = function (empid) {
                var _idx = scope.selectedList.indexOf(empid);
                if (_idx > -1) {
                    scope.selectedList.splice(_idx, 1);
                    remove_tasks(empid);
                }
                else {
                    scope.selectedList.push(empid);
                    add_tasks(empid);
                }
                // loading tasks for selected users

            }

            scope.$on('addOrRemove_employee', function (event, empid) {
                scope.selectUser(empid);
            });

            function load_day_tasks() {
                scope.day_tasks = scheduler.load_day_tasks(all_tasks, scope.schedulerDate, scope.view_type);
            }

            function remove_tasks(empid) {
                all_tasks = scheduler.remove_tasks(empid, all_tasks);
                load_day_tasks();
            }

            function add_tasks(empid) {
                scheduler.load_tasks([empid], scope.caseId, scope.schedulerDate, scope.view_type).then(function (res) {
                    all_tasks = scheduler.concat_objects(all_tasks, res.data);
                    load_day_tasks();
                });
            }

            function load_case_members() {
                scheduler.load_employees(scope.caseid).then(function (response) {
                    scope.case_users = scheduler.set_case_users(response.data)
                });
            }

            function refresh() {
                scope.selectedList = !scope.users ? [] : angular.copy(scope.users);
                //if(!scope.$$phase){scope.$apply();}
                load_tasks();
            }

            function create_task(date) {
                request_task(null, date,null);
            }

            load_sheads(scope.view_type);

            function load_sheads(view_type) {
                scope.sheads = scheduler.load_sheads(view_type, scope.schedulerDate);
                if (scope.view_type == 'month_view') {
                    load_month_weeks();
                }
                load_tasks();
            }

            function load_bg_color(index, emp) {
                if (emp) { index = scope.users.indexOf(index); }
                return emp ? 'bg-color-' + parseInt(index + 1) : scope.bg_colors[index];
            }

            function delete_task(task) {
                //scheduler.delete_task(taskid).then(function () {
                //    load_tasks();
                //});
                if (task.RecordStatus == 'Added') {
                    all_tasks.splice(all_tasks.indexOf(task), 1);
                    load_day_tasks();
                }
                else {
                    task.RecordStatus = 'Deleted';
                    update_object(task);
                }
                task.RecordStatus = 'Deleted';
                $rootScope.$broadcast('schedule_item_saved', { data: task });
            }

            function load_tasks() {
                scheduler.load_tasks(scope.selectedList, scope.caseId, scope.schedulerDate, scope.view_type).then(function (response) {
                    all_tasks = scheduler.remove_system_tasks(all_tasks);
                    all_tasks =scheduler.concat_objects(all_tasks,response.data);
                    scope.tasksList = all_tasks;
                    load_day_tasks();
                });
            }

            function individual_actions(type) {
                var date = {
                    today: new Date(),
                    prev: moment(scope.schedulerDate).add(scope.view_type == 'week_view' ? -7 : -30, 'days'),
                    next: moment(scope.schedulerDate).add(scope.view_type == 'week_view' ? 7 : 30, 'days'),
                }
                scope.schedulerDate = new Date(date[type]);
                load_sheads(scope.view_type);
            }

            function request_task(taskid, date, task) {                
                if ((!taskid && !date) || scope.isReadonly||(task&&task.IsSystem)) { return; }
                var instance = uibModal.open({
                    templateUrl: 'request_task.html',
                    controller: 'scheduleTaskController',
                    controllerAs: 'vm',
                    size: 'md',
                    windowClass: "",
                    resolve: {
                        options: function () {
                            return {
                                taskid: taskid,
                                caseid: scope.caseId,
                                date: date,
                                case: scope.caseNo,
                                object:task
                            }
                        }
                    }
                });
                instance.result.then(function (response) {
                    if (response.RecordStatus == 'Added') {
                        all_tasks.push(response);
                        load_day_tasks();
                    }
                    else {
                        update_object(response);
                    }
                    $rootScope.$broadcast('schedule_item_saved', {data:response});                    
                    //load_tasks();
                });
            }
            function update_object(response) {
                all_tasks = scheduler.update_object(all_tasks, response);
                $rootScope.$broadcast('scheduler_items_updated');
                load_day_tasks();
            }
            function load_month_weeks() {
                scope.month_weeks = scheduler.load_month_weeks(scope.schedulerDate);
            }

            // datepicker
            scope.format = config.dateFormat;
            scope.dateOptions = {
                format: config.dateFormat,
                showWeeks: false
            }
            scope.schedulerDateOpen = false;
            scope.open = function (event, opened) {
                event.preventDefault();
                scope[opened] = scope[opened] == true ? false : true;
            }
        }
        return {
            link: link,
            templateUrl: 'framework/scheduler/scheduler.html',
            scope: {
                caseId: '=',
                users: '=',
                caseNo: '=',
                isReadonly: '=',
                tasksList:'='
            },
            restrict: 'E',
        };
    }
    scheduleTaskController.$inject = ['$scope', '$uibModalInstance', 'commonService', 'options', 'scheduler', '$moment', 'config', 'formValidate']
    function scheduleTaskController($scope, uibModalInstance, commonService, options, scheduler, $moment, config, formValidate) {
        var vm = this;
        vm.save_task = save_task;
        vm.cancel_task = cancel_task;
        vm.case = options.case;
        vm.disable_fields = [];
        activate();

        function activate() {
            request_task();
        }

        function request_task() {
            function set_object(object) {
                object.Hours = object.Hours ? parseFloat(object.Hours.toString().replace(':', '.')) : object.Hours;
                object.DPBH =object.Hours?angular.copy(object.Hours):0;
                vm.scheduleTask = object;
                vm.scheduleTask.CaseId = options.caseid;
                if (vm.scheduleTask.StartDate) { vm.scheduleTask.StartDate = new Date(vm.scheduleTask.StartDate); }
                if (vm.scheduleTask.EndDate) { vm.scheduleTask.EndDate = new Date(vm.scheduleTask.EndDate); }
                if (options.date) {
                    vm.scheduleTask.StartDate = new Date(moment(options.date, config.dateFormat.toUpperCase()).format('YYYY-MM-DD'));
                    vm.scheduleTask.EndDate = new Date(moment(options.date, config.dateFormat.toUpperCase()).format('YYYY-MM-DD'));
                }
            }
            scheduler.load_employees(options.caseid).then(function (data) {
                vm.employees = data.data;
                scheduler.request_task(options.taskid).then(function (response) {
                    if (!options.object) {
                        response.data.RecordStatus = "Added";
                        set_object(response.data);
                    }
                    else {
                        options.object.Task = response.data.Task;
                        set_object(options.object);
                    }
                });
                
            });

        }

        function save_task() {
            if (formValidate.validate('scheduletask').isValidationRequired) {

            }
            else {
                if (options.date) {
                    vm.scheduleTask.CreatedDate = new Date();
                    vm.scheduleTask.UserCreated = config.userName;
                } else {
                    vm.scheduleTask.ModifiedDate = new Date();
                    vm.scheduleTask.ModifiedBy = config.userName;
                }
                commonService.notify.success('Saved data');
                uibModalInstance.close(scheduler.save_task(vm.scheduleTask));
                //scheduler.save_task(vm.scheduleTask).then(function(response){
                //  commonService.notify.success('Saved data');
                //  uibModalInstance.close(response);
                //});
            }

        }

        function cancel_task() {
            uibModalInstance.dismiss();
        }

        // date pickers
        vm.dateplaceholder = config.dateFormat.toUpperCase();
        $scope.format = config.dateFormat;
        $scope.dateOptions = {
            format: config.dateFormat,
            'class': 'datepicker'
        }
        $scope.datePicker = {
            startOpen: false,
            endOpen: false
        }
        $scope.open = function (event, opened) {
            event.preventDefault();
            $scope.datePicker[opened] = $scope.datePicker[opened] == true ? false : true;
        }
    }
})();