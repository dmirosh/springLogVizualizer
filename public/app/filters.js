"use strict"
angular.module('SpringLogs')
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
            return input ? input.slice(start) : input;
        };
    });