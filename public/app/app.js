"use strict"
angular.module('SpringLogs', ['ui.bootstrap'])
    .controller('MainCtrl', function ($scope, $http, $filter) {
        var allMappings = null;
        $scope.currentPage = 1;
        $scope.pageSize = 7;
        $scope.totalMappings = 0;
        $scope.sortOrder = "url";
        $scope.reverse = false;


//        watch for url search input
        $scope.$watch("urlQuery", function (newQuery) {
            $scope.mappings = $filter("urlFilter")(allMappings, newQuery);
            $scope.currentPage = 1;
            $scope.totalMappings = $scope.mappings.length;
        });

        $http.get("api/mappings")
            .success(function (mappingsList) {
                allMappings = $scope.mappings = mappingsList;
                $scope.totalMappings = $scope.mappings.length;
            })
            .error(function () {
                console.log("can't get data from server");
            });
    })
    .filter("urlFilter", function () {
        return function (items, query) {
            var pattern = new RegExp(query, "i");
            return _.filter(items, function (item) {
                return pattern.test(item.url);
            });
        }
    })
    .filter('startFrom', function () {
        return function (input, start) {
            start = +start; //parse to int
            return input.slice(start);
        };
    });
