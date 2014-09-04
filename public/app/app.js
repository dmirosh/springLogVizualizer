"use strict";
angular.module('SpringLogs', ['ui.bootstrap', 'ngRoute'])
    .config(['$routeProvider',
        function($routeProvider) {
            $routeProvider
                .when('/mappings', {
                    templateUrl: '/public/app/templates/mappings-list.html',
                    controller: 'MappingsCtrl'
                })
                .when('/graph', {
                    templateUrl: '/public/app/templates/graph.html',
                    controller: 'GraphCtrl'
                })
                .otherwise({
                    redirectTo: '/mappings'
                });
        }]);
