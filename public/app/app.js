angular.module('SpringLogs', ['ui.bootstrap'])
    .controller('MainCtrl', ["$scope", "$http", function ($scope, $http) {
        var allMappings = null;
        $http.get("api/mappings")
            .success(function (mappingsList) {
                allMappings = $scope.mappings = mappingsList;
            })
            .error(function () {
                console.log("can't get data from server");
            });
    }])
    .filter("urlFilter", function () {
        return function (items, query) {
            var pattern = new RegExp(query, "i");
            return _.filter(items, function (item) {
                return pattern.test(item.url);
            });
        }
    });