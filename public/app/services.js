"use strict";
angular.module('SpringLogs')
    .service("mappingInfoService", function ($http, $q) {
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
                res.resolve(mappingInfos);
            }
            return res.promise;
        };
        this.getFilteredMappings = function (filters) {
            var res = $q.defer();
            if (!mappingsInfo) {
                this.getAllMappings().then(function () {
                    res.resolve(_filter(mappingsInfo, filters));
                });
            } else {
                res.resolve(_filter(mappingsInfo, filters));
            }
            return res.promise;
        };
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
    });