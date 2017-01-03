(function () {
    'use strict';

    angular
        .module('activitymodule')
        .directive('activityModule', activityDirective);

    activityDirective.$inject = ['$window', 'activitymoduleContext', 'commonService', 'formValidate', 'config', 'serviceConfig', 'activityConfig', '$moment', '$uibModal','$state'];

    function activityDirective($window, activitymoduleContext, commonService, formValidate, config, serviceConfig, activityConfig, $moment, $uibModal,$state) {

        var directive = {
            link: link,
            restrict: 'EA',
            scope: {
                relatedId: '=',
                relatedType: '=',
                relatedName: '=',
                view: '=',
                moduleName: '=',
            },
            templateUrl: 'CustomDirectives/activities/activities.html'
        };
        return directive;

        function link(scope, element, attrs) {
            scope.activityTabs = {
                All: true,
                Tasks: false,
                Events: false,
                Notes: false
            }
            scope.isActivityEdit = false;
            scope.isEdit = false;
            scope.userName = config.userName;
            scope.isReply = false;
            scope.active_tab = 'All';
            scope.validation_message = null;
            scope.sortByDS = activitymoduleContext.sort_options(scope.active_tab,scope.moduleName);
            scope.reply = function () {
                scope.activityReply = activitymoduleContext.reply_object(scope.activity.Id);
                scope.isReply = true;
            }
            scope.tabClickHandler = function (tab) {
                // clearing sort value
                scope.Sortby = '';
                scope.isReply = false;
                //setting previous tab to false 
                for (var key in scope.activityTabs) {
                    if (scope.activityTabs[key] == true && tab != key) { scope.activityTabs[key] = false; }
                }
                //setting current tab to true
                scope.activityTabs[tab] = true;
                scope.active_tab = tab;
                scope.isEdit = false;
                scope.isActivityEdit = false;
                if (tab != 'All') { formValidate.hideMessages('activitymodule'); request_activity('00000000-0000-0000-0000-000000000000', tab); scope.isActivityEdit = false; }
                else
                {
                    all_activities();
                    scope.sortByDS = activitymoduleContext.sort_options(scope.active_tab,scope.moduleName);
                }
            }
            // date and time pickers 
            scope.format = config.dateFormat;

            scope.datePicker = {
                dueDateOpen: false,
                remindmeOpen: false
            }

            scope.dateOptions = {
                format: config.dateFormat
            }

            scope.pdfUploadOptions = {
                async: {
                    saveUrl: serviceConfig.AzureStorageRemoteServer + "UploadFile?companyId=" + config.companyId,
                    removeUrl: "",
                    autoUpload: true
                },
                localization: {
                    select: "Upload PDF"
                },
                success: _uploadPdf,
                select: onFileUpload
            }

            function onFileUpload(e) {
                $.each(e.files, function (index, value) {
                    var extension = value.extension.toUpperCase();
                    var size = value.size;
                    if (size > 5000000) {
                        return;
                    }
                    scope.filename = value.name;
                });
            }

            function _uploadPdf(e) {
                var value = e.response.result;
                if (e.files[0].size > 5000000) {
                    scope.$apply(function () {
                        alert("File Upload Size Is To Large");
                    });
                    return;
                }
                var file_obj = { Id: value.Id, FileName: e.files[0].name, FileFullPath: value.Medium, RecStatus: "Added" };
                scope.$apply(function () {
                    scope.activity.FileRepoModel.push(file_obj);
                });

            }

            scope.pdfUploadOptionsReply = {
                async: {
                    saveUrl: serviceConfig.AzureStorageRemoteServer + "UploadFile?companyId=" + config.companyId,
                    removeUrl: "",
                    autoUpload: true
                },
                localization: {
                    select: "Upload PDF"
                },
                success: _uploadPdfReply,
                select: onFileUploadReply
            }

            function onFileUploadReply(e) {
                $.each(e.files, function (index, value) {
                    var extension = value.extension.toUpperCase();
                    var size = value.size;
                    if (size > 5000000) {
                        return;
                    }
                    scope.filenamereply = value.name;
                });
            }

            function _uploadPdfReply(e) {
                var value = e.response.result;
                if (e.files[0].size > 5000000) {
                    scope.$apply(function () {
                        alert("File Upload Size Is To Large");
                    });
                    return;
                }
                var file_obj = { Id: value.Id, FileName: scope.filenamereply, FileFullPath: value.Medium, RecStatus: "Added" };
                scope.$apply(function () {
                    if (!scope.activityReply.FileRepoModel) { scope.activityReply.FileRepoModel = []; }
                    scope.activityReply.FileRepoModel.push(file_obj);
                });

            }

            scope.open = function (event, open) {
                event.preventDefault();
                scope.datePicker[open] = scope.datePicker[open] ? false : true;
            }

            activate_module();
            function activate_module() {
                all_activities();
            }
           
            function all_activities() {
                scope.validation_message = null;
                var tab;
                 if(scope.active_tab == 'All'){ tab = "AllSorting";}
                 else if(scope.active_tab == 'Tasks'){ tab = "TaskSorting";}
                 else if(scope.active_tab == 'Events'){ tab = "EventSorting";}
                 else if(scope.active_tab == 'Notes'){ tab = "NoteSorting";}
                activitymoduleContext.getPreference(scope.relatedType, tab).then(function(res){
                  scope.Sortby = res.data;
                })
                activitymoduleContext.all_activities(scope.moduleName, scope.active_tab == 'All' ? '' : scope.active_tab, scope.relatedType, scope.relatedId).then(function (allactivities) {
                    scope.allactivities = allactivities.data;
                    scope.activities = activitymoduleContext.get_cards(angular.copy(scope.allactivities));
                });
            }

            function request_activity(activity_id, activity_type) {
                scope.subjects = [];
                scope.ParticipantsLU = [];
                activitymoduleContext.request_activity(activity_type, activity_id,scope.moduleName).then(function (requested_activity) {
                    if(requested_activity.data.SubjectLU){
                      scope.subjects = requested_activity.data.SubjectLU.Lookups;
                      var subjectsDefaultValue = requested_activity.data.SubjectLU.DefaultValue;//Subject DefaultValue 
                    }
                    scope.ParticipantsLU = requested_activity.data.ParticipantsLU.filter(function (value) {
                        if (value)
                            return value.Username != config.userName;
                    });
                    if (scope.active_tab == 'Tasks') { scope.ReplyParticipantsLU = angular.copy(scope.ParticipantsLU); }
                    activityConfig.related_lu = requested_activity.data.RelatedToLU;
                    scope.sortByDS = activitymoduleContext.sort_options(scope.active_tab,scope.moduleName);
                    scope.activity = requested_activity.data;
                    if(!scope.isEdit){
                      scope.activity.Subject = subjectsDefaultValue;//Subject DefaultValue binding
                    }
                    activitymoduleContext.relatedmodels('set', scope.activity.RelatedModel);
                    if (scope.active_tab == 'Events') {
                        scope.activity.DueDate = !scope.activity.DueDate ? null :$moment(scope.activity.DueDate.split('T')[0]).format('DD/MM/YYYY '+scope.activity.DueDate.split('T')[1]);
                        scope.activity.RemindmeDate = !scope.activity.RemindmeDate ? null : $moment(scope.activity.RemindmeDate.split('T')[0]).format('DD/MM/YYYY ' + scope.activity.RemindmeDate.split('T')[1]);
                    }
                    else {
                        scope.activity.DueDate = !scope.activity.DueDate ? null : new Date(scope.activity.DueDate.split('T')[0]);
                        scope.activity.RemindmeDate = !scope.activity.RemindmeDate ? null : new Date(scope.activity.RemindmeDate.split('T')[0]);
                    }

                    if (scope.activity.FileRepoModel.length != 0) { scope.activity.FileRepoModel[0].Id == '00000000-0000-0000-0000-000000000000' ? scope.activity.FileRepoModel.splice(0, 1) : ''; }                   
                    all_activities();
                });
            }

            scope.delete_file = function (file, type) {
                if (type == 'reply') {
                    if (scope.activityReply.FileRepoModel)
                        scope.activityReply.FileRepoModel = activitymoduleContext.delete_file(file, scope.activityReply.FileRepoModel);
                } else {
                    if (scope.activity.FileRepoModel)
                        scope.activity.FileRepoModel = activitymoduleContext.delete_file(file, scope.activity.FileRepoModel);
                }
                
            }

            scope.preference = function (Sortby) {
             if (Sortby != 'SelectOption') {
                 var tab;
                 if(scope.active_tab == 'All'){ tab = "All";}
                 else if(scope.active_tab == 'Tasks'){ tab = "Task";}
                 else if(scope.active_tab == 'Events'){ tab = "Event";}
                 else if(scope.active_tab == 'Notes'){ tab = "Note";}
                 var relatedType=scope.relatedType==''?null:scope.relatedType;
                var sarchobj = { Id: commonService.guid(), UserName: config.userName,RelatedType:relatedType, Type: tab + "Sorting", PreferenceData: { "Key": "SortBy", "Value": Sortby } }
                // if ($state.current.name === "client.lead.leadactivity.all") {
                //     var sarchobj = { Id: commonService.guid(), UserName: config.userName, Type: "LeadActivitySorting", PreferenceData: { "Key": "'SortBy'", "Value": "'" + Sortby + "'" } }
                // }
                // if ($state.current.name === "app.client.vendor_addEdit.vendoractivity.all") {
                //     var sarchobj = { Id: commonService.guid(), UserName: config.userName, Type: " VendorActivitySorting", PreferenceData: { "Key": "'SortBy'", "Value": "'" + Sortby + "'" } }
                // }
                activitymoduleContext.saveviewby(sarchobj).then(function (data) { })
              }
            }
            

            scope.files_length = function (type) {
                if (!type) {
                    if (scope.activity)
                        return activitymoduleContext.files_length(scope.activity.FileRepoModel);
                }
                else if (type == 'reply') {
                    return activitymoduleContext.files_length(scope.activityReply.FileRepoModel);
                }
            }

            scope.save_activity = function () {
                scope.validation_message = null;
                if (formValidate.validate('activitymodule').isValidationRequired) {
                     scope.validation_message = 'Invalid Data,Please Verify!';
                     return;
                }
                if (scope.active_tab == 'Events') {
                    scope.activity.DueDate = document.getElementById('datepickerone').value;
                    scope.activity.RemindmeDate = document.getElementById('datepickertwo').value;
                }

                if (scope.isActivityEdit && scope.active_tab != 'Notes')
                {
                    if (!document.getElementById('High1').checked && !document.getElementById('High2').checked) { scope.activity.ActivityStatus = ''; }
                }
                activitymoduleContext.save_activity(scope.activity, scope.active_tab, scope.activity.participants, scope.relatedId, scope.relatedType, scope.moduleName, scope.relatedName).then(function (response) {
                    if (response.isValidate) {
                        scope.validation_message = response.messages;
                    } else {
                        var message = scope.active_tab == 'Notes' ? 'Note Posted' : scope.active_tab.substring(0, scope.active_tab.length - 1) + ' Saved';
                        commonService.notify.success(message);
                        scope.isActivityEdit = false;
                        scope.isEdit = false;
                        request_activity('00000000-0000-0000-0000-000000000000', scope.active_tab);
                    }
                });
            }

            scope.sort_data = function () {
                scope.activities = activitymoduleContext.sort_data(scope.Sortby, angular.copy(scope.allactivities));
            }

            scope.filter_data = function (filter) {
                scope.activities = activitymoduleContext.filter_data(filter, angular.copy(scope.allactivities));
            }

            scope.toggle_activity_status = function (type,event) {
                if (type == 'cancel') { if (event.currentTarget.checked) { scope.isCompleted = false; document.getElementById('High2').checked = false; scope.activity.ActivityStatus = 'Cancel'; } }
                if (type == 'completed') { if (event.currentTarget.checked) { scope.isCancel = false; document.getElementById('High1').checked = false; scope.activity.ActivityStatus = 'Completed'; } }
            }

            scope.edit_card = function (activity) {
                request_activity(activity.Id, scope.active_tab);
                scope.isEdit = true;
            }

            scope.edit_activity = function (activity) {
                scope.isEdit = false;
                scope.isReply = false;
                scope.activity.participants = activitymoduleContext.set_participants(activity.ParticipantModel);
                scope.isActivityEdit = true;
            }

            scope.activity_actions = function (activity, action) {
                if (action != 'Delete') {
                    activitymoduleContext.save_activity_action(activity, action).then(function (res) {
                        request_activity('00000000-0000-0000-0000-000000000000', scope.active_tab);
                        scope.isEdit = false;
                        scope.isActivityEdit = false;
                    });
                }
                else if (action == 'Delete') {
                    activitymoduleContext.delete_activity(activity).then(function (res) {
                        if (typeof (res) == 'object') {
                            commonService.notify.success('Saved Data'); request_activity('00000000-0000-0000-0000-000000000000', scope.active_tab);
                            scope.isEdit = false;
                            scope.isActivityEdit = false;
                            all_activities();//To refresh cards
                        }
                    });
                }
                
            }
            scope.dateplaceholder1 = config.dateFormat;
            scope.datatime1 = config.dateFormat + " " + "HH:mm";
            
            scope.activity_icon = function (type) {
                if (type == 'Notes') {return 'fa fa-book fa-lg icon-size'; }
                else if (type == 'Events') { return 'fa fa-calendar fa-lg'; }
                else if (type == 'Tasks') {return 'fa fa-tasks fa-lg'; }
            }
            scope.show_activity_actions = function (action, activity) {
                if (action == 'cancel') {
                    return config.userName == activity.UserCreated && activity.ActivityType != 'Notes';
                }
                else if (action == 'complete') {
                    return activity.ActivityType == 'Tasks' && (config.userName == activity.UserCreated || activitymoduleContext.isPrticipant(activity));
                }
                else if (action == 'reply') {
                    if (scope.relatedType != ''&&activity.UserCreated!=config.userName)
                        return activitymoduleContext.isPrticipant(activity);
                    else
                        return true;
                }
            }
            scope.cancel_activity = function () {
                formValidate.hideMessages('activitymodule');
                scope.validation_message = null;
                scope.isEdit = false;
                scope.isActivityEdit = false;
                request_activity('00000000-0000-0000-0000-000000000000', scope.active_tab);
            }
            scope.edit_reply = function (reply) {
                activitymoduleContext.edit_reply(reply.Id).then(function (res) {
                    scope.activityReply = res.data;
                    scope.activityReply.participants = activitymoduleContext.set_participants(scope.activityReply.ParticipantModel);
                    scope.isReply = true;
                });
            }
            scope.delete_reply = function (reply) {
                activitymoduleContext.delete_reply(reply.Id).then(function () {
                    commonService.notify.success('Reply deleted');
                    scope.edit_card(scope.activity);
                })
            }
            scope.save_reply = function () {
                scope.replydec = null;
                if (document.getElementById("Descriptions").value == "") {                   
                    scope.replydec = "Reply is Required"
                    return;
                }
                activitymoduleContext.save_reply(scope.activityReply,scope.ReplyParticipantsLU).then(function (res) {
                    commonService.notify.success('Reply posted');
                    scope.edit_card(scope.activity);
                    scope.isReply = false;

                });
            }
            scope.cancel_reply = function () {
                scope.isReply = false;
            }

            scope.open_model = function (size, relatedid, relatedtype, relatedname) {
                var $uibModalInstance = $uibModal.open({
                    templateUrl: 'activity_related_model.html',
                    controller: 'activityrelatedControllerInstance',
                    backdrop: 'static',
                    size: size,
                    resolve: {
                        items: function () {
                            return scope.items;
                        },
                        options: {
                            relatedid: relatedid,
                            relatedtype: relatedtype,
                            relatedname: relatedname
                        }
                    }
                });

                $uibModalInstance.result.then(function (related_models) {
                    scope.activity.RelatedModel = [];
                    for (var i = 0; i <= related_models.length - 1; i++) {
                        scope.activity.RelatedModel.push(related_models[i]);
                    }
                    activitymoduleContext.relatedmodels('set', scope.activity.RelatedModel);
                }, function () {
                    $log.info('Modal dismissed at: ' + new Date());
                });
            };
        }
    }

})();