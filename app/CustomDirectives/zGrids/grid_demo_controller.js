(function () {
    'use strict';
    angular.module('z.grids')
    .controller('zgridDemoController', zgridDemoController);
    zgridDemoController.$inject = [];
    function zgridDemoController() {
        var vm = this;
        vm.say = say;
        vm.gridOptions =
            {
            isActionsRequired: true,
            editableType:'inline',
            actions:
                [
                    { name: 'Add', icon: 'add-icon tool-icons',method:'Add' },
                    { name: 'Edit', icon: 'edit-icon tool-icons',method:'Edit' },
                    { name: 'Delete', icon: 'delete-icon tool-icons',method:'Delete'}
                ],
            fields:
                [
                    { name: 'Name', title: 'Name', type:'text' },
                    { name: 'Age', title: 'Age',type:'text' },
                    { name: 'Gender', title: 'Gender', type: 'select', data: [{ name: 'Male', code: 'M' }, { name: 'Female', code: 'F' }], valueField: 'code', textField: 'name' },
                    { name: 'Email', title: 'Email', type:'text' }
                ]
            };
        vm.data = [{ Name: 'SubbaReddy', Gender: 'M', Email: 'subbareddy@ziraff.in', Age: 24 }, { Name: 'Anduri', Gender: 'M', Email: 'subbareddy@ziraff.in', Age: 24 }, { Name: 'Venkata', Gender: 'M', Email: 'subbareddy@ziraff.in', Age: 24 }, { Name: null, Gender: null, Email: null, Age: null }];

        function say(message) {
            alert(message);
        }
    }
})();