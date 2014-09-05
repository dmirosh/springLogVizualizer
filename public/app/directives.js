"use strict";
angular.module('SpringLogs')
    .directive('barChart', function () {
        function render(chartSelect, chartData) {
            console.log("render total: " + chartData.length);
            var chart = chartSelect.selectAll('div');
            chart = chart.data(chartData);
            chart.enter().append("div").attr("class", "chart");
            chart.exit().remove();
            chart.style("width", function (d) { return d.val + "%"; })
                .text(function (d) {return d.name + " - " + d.val + "%"; });
        }
        return {
            replace: true,
            template: '<div></div>',
            restrict: "E",
            scope: {
                chartData: "=chartData"
            },
            link: function ($scope, element) {
                $scope.$watch("chartData", function (newData) {
                    render(chart, newData);
                });
                var chart = d3.select(element[0]);
                render(chart, $scope.chartData);
            }
        };
    });