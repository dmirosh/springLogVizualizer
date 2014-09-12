"use strict";
angular.module('SpringLogs')
    .service("mappingInfoService", function ($http, $q) {
        var CHART_DATA_MAKERS = {
            httpMethods: _createChartDataForHttpMethods,
            controllers: _createChartDataForControllers
        };
        var mappingsInfo = null; //cached list of all mappings

        this.getAllMappings = function () {
            var res = $q.defer();
            if (!mappingsInfo) {
                $http.get("api/mappings")
                    .success(function (response) {
                        //caching response
                        mappingsInfo = response;
                        res.resolve(mappingsInfo);
                    });
            } else {
                res.resolve(mappingsInfo);
            }
            return res.promise;
        };
        this.getFilteredMappings = function (filters) {
            var res = $q.defer();
            if (!mappingsInfo) {
                this.getAllMappings().then(function (mappingsInfo) {
                    res.resolve(_filter(mappingsInfo, filters));
                    return mappingsInfo;
                });
            } else {
                res.resolve(_filter(mappingsInfo, filters));
            }
            return res.promise;
        };
        this.getChartData = function(type) {
            var res = $q.defer();
            var chartDataMaker = CHART_DATA_MAKERS[type];
            if(!chartDataMaker) {
                res.reject();
                return res.promise;
            }

            if (!mappingsInfo) {
                this.getAllMappings().then(function (mappingsInfo) {
                    res.resolve(chartDataMaker(mappingsInfo));
                    return mappingsInfo;
                });
            } else {
                res.resolve(chartDataMaker(mappingsInfo));
            }
            return res.promise;
        };
        /** private functions **/
        function _filter(mappingsList, filters) {
            if (!mappingsList) {
                return mappingsList;
            }
            var queryRegExp = null;
            if(filters.query) {
                try {
                    queryRegExp = new RegExp(filters.query, "i");
                } catch(e) {
                    return [];
                }
            }
            return _.filter(mappingsList, function (item) {
                var queryMatches = true;
                if (queryRegExp) {
                    queryMatches = queryRegExp.test(item.url);
                }
                var controllersMatches = true;
                if (filters.controllers.length) {
                    controllersMatches = _.contains(filters.controllers, item.handlerClassShort);
                }
                return queryMatches && controllersMatches;
            });
        }

        function _createChartDataForHttpMethods(mappingsList) {
            //TODO make httpMethods normal array
            var GETMethodLength = _.filter(mappingsList, function (mapping) {return mapping.httpMethods.join("").indexOf("GET") != -1}).length,
                POSTMethodLength = _.filter(mappingsList, function (mapping) {return mapping.httpMethods.join("").indexOf("POST") != -1}).length;
            GETMethodLength = isNaN(GETMethodLength) ? 0 : GETMethodLength;
            POSTMethodLength = isNaN(POSTMethodLength) ? 0 : POSTMethodLength;
            return [
                {name: "GET", val: GETMethodLength},
                {name: "POST", val: POSTMethodLength}
            ];
        }

        function _createChartDataForControllers(mappingsList) {
            var groupedByController = _.groupBy(mappingsList, "handlerClassShort");
            return _.map(groupedByController, function (mappings, controller) {
                return {name: controller, val: mappings.length};
            });
        }
    })
    .service("logDataService", ["$http", "$q", function ($http, $q) {
        var logFileInfo = null;
        this.getLogFileInfo = function () {
            var res = $q.defer();
            if(logFileInfo) {
                res.resolve(logFileInfo);
            } else {
                $http.get("api/logfile")
                    .success(function (response) {
                       logFileInfo = response;
                        res.resolve(response);
                    });
            }
            return res.promise;
        }
    }]);