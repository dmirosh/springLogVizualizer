"use strict";
angular.module('SpringLogs')
    .controller('MappingsCtrl', ["$scope", "$filter", "mappingInfoService",
        function ($scope, $filter, mappingInfoService) {

        function onListUpdated(mappingsList) {
            $scope.mappings = mappingsList;
            $scope.totalMappings = $scope.mappings.length;
            $scope.currentPage = 1;
            return mappingsList;
        }

        mappingInfoService.getAllMappings().then(onListUpdated).then(function (mappingsList) {
            $scope.controllers = _.uniq(_.pluck(mappingsList, "handlerClassShort")).sort();
        });

        $scope.mappings = [];
        // for controller select input
        $scope.selectedController = null;
        $scope.controllers = [];

        //page data
        $scope.currentPage = 1;
        $scope.pageSize = 8;
        $scope.totalMappings = 0;

        //sort data
        $scope.sortOrder = "url";
        $scope.reverse = false;

        //filters
        $scope.filters = {
            query: "",
            controllers: []
        };
        //add\remove controller as filters
        $scope.toggleControllerFilter = function (controllerName) {
            if (_.contains($scope.filters.controllers, controllerName)) {
                $scope.filters.controllers = _.without($scope.filters.controllers, controllerName);
            } else {
                $scope.filters.controllers.push(controllerName);
            }
        };

        //when filters changed requesting new mappings list from service
        $scope.$watch("filters", function (newFilters, oldFilters) {
            if (newFilters !== oldFilters) { //if not initial call
                mappingInfoService.getFilteredMappings(newFilters).then(onListUpdated);
            }
        }, true);
    }])

    .controller("GraphCtrl", ["$scope", "mappingInfoService",
        function ($scope, mappingInfoService) {
            function updateMethodsChart(mappingsList) {
                var totalLength = mappingsList.length,
//                    TODO  httpMethods format to be [GET, POST, ...]
                    GETMethodLength = _.filter(mappingsList, function (mapping) {return mapping.httpMethods.join("").indexOf("GET") != -1}).length,
                    POSTMethodLength = _.filter(mappingsList, function (mapping) {return mapping.httpMethods.join("").indexOf("POST") != -1}).length;
                GETMethodLength = isNaN(GETMethodLength) ? 0 : GETMethodLength;
                POSTMethodLength = isNaN(POSTMethodLength) ? 0 : POSTMethodLength;
                $scope.methodsChart = [{name: "GET", val:Math.floor(GETMethodLength / totalLength * 100)},
                    {name: "POST", val: Math.floor(POSTMethodLength / totalLength * 100)}
                ];
                return mappingsList;
            }
            function updateControllersChart(mappingsList) {
                var groupedByController = _.groupBy(mappingsList, "handlerClassShort"),
                    totalControllers = _.size(groupedByController)
                $scope.controllersChart = _.map(groupedByController, function (mappings, controller) {
                    //FIXME hack to enlarge minimal bar width
                    return {name: controller, val: Math.ceil(mappings.length / totalControllers * 100) + 60};
                });
            }

            $scope.controllersChart = [];
            $scope.methodsChart = [];
            $scope.showControllers = true;
            $scope.showMethods = true;
            mappingInfoService.getAllMappings().then(updateMethodsChart).then(updateControllersChart);

        }]);
