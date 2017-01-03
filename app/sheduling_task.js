
(function () {
    'use strict';
    angular
        .module('appsworld')
        .controller('create_task', create_task)
        .controller('create_taskInstance', create_taskInstance);

    create_task.$inject = ['$scope', '$uibModal', '$log'];

    function create_task($scope, $uibModal, $log) {
        $scope.open = function (size,task) {
            var $uibModalInstance = $uibModal.open({
                templateUrl: 'create_task.html',
                controller: 'create_taskInstance',
                backdrop: 'static',
                size: size,
                resolve: {
                    items: function () {
                        return $scope.items;
                    },
                    options: {
                        task:task
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

    create_taskInstance.$inject = ['$uibModalInstance', '$scope', 'options'];
    function create_taskInstance($uibModalInstance, $scope, options) {
        if (options.task) {
            $scope.task = options.task;
        }
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        }
        $scope.save = function () {
            $uibModalInstance.dismiss('ok');
        }
    }
})();
