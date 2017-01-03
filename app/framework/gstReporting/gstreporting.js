(function () {
    'use strict';
    angular.module('appsworld')
    .directive('gstReporting', gstReporting)
    .factory('gstReportingContext', gstReportingContext)
    gstReporting.$inject = ['gstReportingContext', 'companysettings', '$http'];
    function gstReporting(gstReportingContext, companysettings, $http) {

        function link(scope,ele,attr) {
            scope.items = !scope.items ? [] : scope.items;
            scope.$on('refresh_gst_reporting', function (event,args) {
                scope.gstReportingSource = reportingGrid(args);
            });
            scope.gstReportingSource = reportingGrid(scope.items);
            function reportingGrid(data) {
                if (!scope.gstReporting.GSTExchangeRate) { scope.gstReporting.GSTExchangeRate = 1; }
                function items(taxcode) {
                    return data.filter(function (value) {
                        return value.ApplicableTaxCode == taxcode;
                    });
                }
                var _taxcodes = [];
                for (var i = 0; i <= data.length - 1; i++) {
                    if (_taxcodes.indexOf(data[i].ApplicableTaxCode) == -1) {
                        _taxcodes.push(data[i].ApplicableTaxCode);
                    }
                }
                var _griddata = [];
                for (var i = 0; i <= _taxcodes.length - 1; i++) {
                    var obj = { TaxCode: _taxcodes[i], Amount: 0, TaxAmount: 0, Total: 0 };
                    var _items = items(_taxcodes[i]);
                    for (var j = 0; j <= _items.length - 1; j++) {
                        if (!_items[j].InvoiceFee) { _items[j].InvoiceFee = 0; }
                        obj.Amount = parseFloat(obj.Amount) + parseFloat(_items[j].InvoiceFee);
                        if (!_items[j].Tax) { _items[j].Tax = 0; }
                        obj.TaxAmount = parseFloat(obj.Amount) * parseFloat(_items[j].Tax) / 100;
                    }
                    obj.Amount = parseFloat(obj.Amount) * parseFloat(scope.gstReporting.GSTExchangeRate);
                    obj.TaxAmount = parseFloat(obj.TaxAmount) * parseFloat(scope.gstReporting.GSTExchangeRate);
                    obj.Total = parseFloat(obj.Amount) + parseFloat(obj.TaxAmount);

                    _griddata.push(obj);
                }
                scope.gstTotals = { TotalAmount: 0, TotalTaxAmount: 0, GrandTotal: 0 };
                for (var k = 0; k <= _griddata.length - 1; k++) {
                    scope.gstTotals.TotalAmount = scope.gstTotals.TotalAmount + parseFloat(_griddata[k].Amount);
                    scope.gstTotals.TotalTaxAmount = scope.gstTotals.TotalTaxAmount + parseFloat(_griddata[k].TaxAmount);
                    scope.gstTotals.GrandTotal = scope.gstTotals.GrandTotal + parseFloat(_griddata[k].Total);
                }
                return _griddata;
            }
            scope.exRateChange = function () {
                scope.gstReportingSource = reportingGrid(scope.items);
            }
        }
        return {
            restrict: 'E',
            templateUrl: 'framework/gstReporting/gstreporting.html',
            scope: {
                showExRate: '=',
                showDateRanges: '=',
                disableExRate: '=',
                disableDateRanges: '=',               
                gstReporting: '=',
                items:'=',
            },
            link: link,
        }
    }
    gstReportingContext.$inject = ['commonService','serviceConfig','config'];
    function gstReportingContext(commonService,serviceConfig,config) {
        var service = {

        };
        return service;
    }
})();