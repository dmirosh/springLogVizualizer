(function () {
    var log = require("../utils/log"),
        extractor = require("../utils/mapInfoExtractor"),
        _ = require("../public/vendor/underscore"),
        mongoose = require("../utils/mongoose"),
        config = require("../config");


    exports.getAll = function (req, res) {
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