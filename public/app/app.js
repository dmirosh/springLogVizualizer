angular.module('SpringLogs', [])
    .controller('MainCtrl', ["$scope", "$http", function ($scope, $http) {
        var allMappings = null;
        $http.get("api/mappings")
            .success(function (mappingsList) {
                allMappings = $scope.mappings = mappingsList;
            })
            .error(function () {
                console.log("can't get data from server");
            });
    }]);