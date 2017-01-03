(function () {
    'use strict';
    angular.module('activitymodule')
    .controller('activityrelatedController', activityrelatedController)
    .controller('activityrelatedControllerInstance', activityrelatedControllerInstance);

    activityrelatedController.$inject = ['$scope', '$uibModal', '$log'];

    function activityrelatedController($scope, $uibModal, $log) {
        $scope.open_model = function (size,relatedid,relatedtype,relatedname) {
            var $uibModalInstance = $uibModal.open({
                templateUrl: 'activity_related_model.html',
                controller: 'activityrelatedControllerInstance',
                backdrop: 'static',
                size: size,
                resolve: {
                    items: function () {
                        return $scope.items;
                    },
                    options: {
                        relatedid: relatedid,
                        relatedtype: relatedtype,
                        relatedname:relatedname
                    }
                }
            });

            $uibModalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };
    }

    activityrelatedControllerInstance.$inject = ['$uibModalInstance', '$scope', 'activityConfig', 'activitymoduleContext', 'options','formValidate'];
    function activityrelatedControllerInstance($uibModalInstance, $scope, activityConfig, activitymoduleContext, options, formValidate) {
      //   activityConfig.related_lu.Lookups
      //   $scope.relations[0].RelatedLU = angular.copy(activityConfig.related_lu.Lookups);
        $scope.related_title = options.relatedname;
        $scope.lookupmessage = null;
        fill_relations();
        function fill_relations() {
            var duplicate_relations = angular.copy(activitymoduleContext.relatedmodels('get'));
            if (options.relatedtype == 'Lead' || options.relatedtype == 'Client')
            {
                if (duplicate_relations.length == 0)
                {
                    duplicate_relations.push({ EntityName: null, EntityId: null, EntityType: null, Relation: null, RelatedLU: [] });
                }
                else if (duplicate_relations.length > 0 && duplicate_relations[0].EntityType == 'Lead')
                {
                    duplicate_relations = [];
                    duplicate_relations.push({ EntityName: null, EntityId: null, EntityType: null, Relation: null, RelatedLU: [] });
                }
                duplicate_relations[0]['RelatedLU'] = activityConfig.related_lu.Lookups.filter(function (value) {
                    return value.Name == 'Opportunity' || value.Name == 'Quotation' || value.Name == 'Case';
                });
            }
            else
            {
                if (duplicate_relations.length == 0)
                {
                    duplicate_relations.push({ EntityName: null, EntityId: null, EntityType: null, Relation: null, RelatedLU: [] });
                }
                duplicate_relations[0]['RelatedLU'] = activityConfig.related_lu.Lookups;
                if (duplicate_relations.length > 1) {
                    duplicate_relations[1]['RelatedLU'] = activityConfig.related_lu.Lookups.filter(function (value) {
                        return value.Name == 'Opportunity' || value.Name == 'Quotation'||value.Name == 'Case';
                    });
                }
            }
            // assigning EntityType if there is no entity type;
            for (var i = 0; i <= duplicate_relations.length - 1; i++)
            {
                if (duplicate_relations[i].EntityType == '' || !duplicate_relations[i].EntityType) {
                    duplicate_relations[i].EntityType = duplicate_relations[i].Relation;
                }
            }
            $scope.relations =angular.copy(duplicate_relations);
         
        }
        //text box keyup function
        $scope.load_source = function (relation, index) {
            if (index == 0) { $scope.relations.length > 1 ? $scope.relations.splice(1, 1) : '';}
            if (relation&&relation!='') {
                $scope.relation_uri = activitymoduleContext.related_list(relation, options.relatedid == '' ? '00000000-0000-0000-0000-000000000000' : options.relatedid, $scope.relations, index, options.relatedid, options.relatedtype);
                $("#nameAutocmptl" + index).data("kendoAutoComplete").dataSource.transport.options.read.url = $scope.relation_uri;
                $("#nameAutocmptl" + index).data("kendoAutoComplete").dataSource.read();
            }
            
        }
        $scope.relation_uri = '';
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        }
        $scope.save = function () {
            $scope.lookupmessage = null;
            if (formValidate.validate('relatedto').isValidationRequired) { return; }
            var _isNotLookupValue = false;
            for (var i = 0; i <= $scope.relations.length - 1; i++) {
                if ($scope.relations[i].EntityId == '' || !$scope.relations[i].EntityId) { _isNotLookupValue = true;}
            }
            if (_isNotLookupValue) { $scope.lookupmessage='Please select from lookup'; return; }
            for (var i = 0; i <= $scope.relations.length - 1; i++) {
                delete $scope.relations[i]["RelatedLU"];
            }
            activitymoduleContext.relatedmodels('set', $scope.relations);
            $uibModalInstance.close($scope.relations);
        }
        $scope.add_relation = function () {
            if ($scope.relations.length == 2 || ($scope.relations[0].EntityType != 'Lead'&&$scope.relations[0].EntityType !='Client')) { return;}
            if (formValidate.validate('relatedto').isValidationRequired) { return;}
            var relatedLU = activityConfig.related_lu.Lookups.filter(function (value) {
                return value.Code == 'Opportunity' || value.Code == 'Quotation' || value.Code=='Case';
            });
            $scope.relations.push({ EntityId: null, EntityName: null, EntityType: null, Relation: null, RelatedLU: relatedLU });
        }
        $scope.delete_relation = function (index) {
            $scope.relations.splice(index, 1);
        }
        var selected_index = null;
        $scope.change_index = function (index) {
            selected_index = index;
        }
        //Drop Down change function
        $scope.reltion_change = function (relation, index) {
            selected_index = index;           
            if (index == 0) { $scope.relations.length > 1 ? $scope.relations.splice(1, 1) : '';}
            $scope.relation_uri = activitymoduleContext.related_list(relation, options.relatedid == '' ? '00000000-0000-0000-0000-000000000000' : options.relatedid,$scope.relations,index,options.relatedid,options.relatedtype);
            $("#nameAutocmptl" + index).data("kendoAutoComplete").dataSource.transport.options.read.url = $scope.relation_uri;
            $("#nameAutocmptl" + index).data("kendoAutoComplete").dataSource.read();
            $("#nameAutocmptl" + index).data("kendoAutoComplete").value('');
        }
        function onSelect(e) {
            var selectedItem = this.dataItem(e.item.index());
            if (selected_index != null) {
                $scope.relations[selected_index].EntityId = selectedItem.Id;
                $scope.relations[selected_index].EntityName = selectedItem.Name;
                $scope.relations[selected_index].Relation = $scope.relations[selected_index].EntityType;
            }

        }
        $scope.relation_options = {
            dataTextField: "Name",
            dataValueField: "Id",
            select: onSelect,
         //   change:onChange,
            // filtering: onFiltering,
            maxLength: 2,
            dataSource: {
                transport: {
                    read: {
                        dataType: "json",
                        url: $scope.relation_uri,
                    }
                },
            },
            height: 470,
        }
        
    }
})();