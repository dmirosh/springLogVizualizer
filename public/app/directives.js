"use strict";
angular.module('SpringLogs')
    .directive('barChart', function () {
        return {
            replace: false,
            template: '<svg></svg>',
            restrict: "E",
            scope: {
                chartData: "=chartData"
            },
            link: function ($scope, element, attrs) {
                var chart = d3.select(element[0]).select("svg");
                chart.attr({
                    width: attrs.width,
                    height: attrs.height
                });
                var margin = {top: 10, right: 20, bottom: 20, left: +attrs.leftMargin},
                    width = attrs.width - margin.left - margin.right,
                    height = attrs.height - margin.top - margin.bottom;
                //creating painting rectangle
                chart = chart.append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
                //creating and adding tooltip
                var tip = d3.tip()
                    .attr('class', 'd3-tip')
                    .direction('e')
                    .offset([0, 10])
                    .html(function(d) {
                        return "<strong>Total:</strong> <span>" + d.val + "</span>";
                    });
                chart.call(tip);
                // watching chart data changes
                $scope.$watch("chartData", render);
                render($scope.chartData);

                function render(chartData) {
                    chart.select("g").selectAll("*").remove(); //clear previous chart
                    if(!chartData || !chartData.length) {
                        return;
                    }
                    //creating x scale anx axis
                    var xScale = d3.scale.linear()
                        .domain([0, d3.max(chartData, function (d) { return d.val; })])
                        .range([0, width]);
                    var xAxis = d3.svg.axis().scale(xScale).orient("bottom");

                    //creating y scale and axis
                    var yPadding = .3;
                    var yScale = d3.scale.ordinal()
                        .domain(_.map(chartData, function (d) {return d.name}))
                        .rangeRoundBands([0, height], yPadding);
                    var yAxis = d3.svg.axis().scale(yScale).orient("left");

                    //adding x axis
                    chart.append("g")
                        .attr("class", "x axis")
                        .attr("transform", "translate(0," + height + ")")
                        .call(xAxis);
                    //adding y axis
                    chart.append("g")
                        .attr("class", "y axis")
                        .call(yAxis);
                    //draw bar
                    var bars = chart.selectAll(".bar").data(chartData);
                    bars.enter().append("rect")
                        .attr({
                            class: "bar",
                            x: function (d) {return 10},
                            y: function (d) {return yScale(d.name)},
                            height: yScale.rangeBand(),
                            width: function (d) {return xScale(d.val)}
                        })
                        .on('mouseover', tip.show)
                        .on('mouseout', tip.hide);
                    bars.exit().remove();
                }
            }
        };
    });