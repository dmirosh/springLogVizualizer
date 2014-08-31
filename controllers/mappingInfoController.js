(function () {
    var log = require("../utils/log"),
        extractor = require("../utils/mapInfoExtractor"),
        _ = require("../public/vendor/underscore"),
        mongoose = require("../utils/mongoose"),
        config = require("../config"),
        MappingInfo = require("../models/mappingInfo");


    exports.getAll = function (req, res) {
        return MappingInfo.find( function( err, mappingInfos ) {
            if( !err ) {
                return res.json( mappingInfos );
            } else {
                return log.error( err );
            }
        });
    };


    exports.refreshMappingInfo = function (req, res) {
        var logFile = config.get("pathToLog");
        extractor(logFile, onMappingInfoExtracted);

        function onMappingInfoExtracted(mappingInfoArray) {
            mongoose.connection.collections['mappinginfos'].drop(function (err) {
            });
            _.each(mappingInfoArray, function (elem) {
                elem.save(onErorr);
            });
            res.send("ok");
        }

        function onErorr(err) {
            if (err) log.error("can't save");
        }
    };

})();