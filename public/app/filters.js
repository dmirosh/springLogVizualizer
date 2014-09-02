"use strict";
angular.module('SpringLogs')
    .filter('startFrom', function () {
        return function (input, start) {
            start = +start; //parse to int
            return input ? input.slice(start) : input;
        };
    });