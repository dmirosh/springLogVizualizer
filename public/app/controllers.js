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
            $scope.showControllers = true;
            $scope.showMethods = true;
            mappingInfoService.getChartData("httpMethods").then(function (chartData) {
                $scope.methodsChart = chartData;
            });
            mappingInfoService.getChartData("controllers").then(function (chartData) {
                $scope.controllersChart = _.sortBy(chartData, "name");
            });
        }])
    .controller("LogfileCtrl", ["$scope", "logDataService", function ($scope, logDataService) {
        $scope.logFileInfo = {
            uploadDate: "never",
            fileName: "",
            fileSize: ""
        };
        logDataService.getLogFileInfo().then(function (logFileInfo) {
           $scope.logFileInfo = logFileInfo;
        });
    }]);
