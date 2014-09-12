(function () {
    var indexController = require("../controllers/indexController"),
        mappingInfoController = require("../controllers/mappingInfoController"),
        logFileController = require("../controllers/logFileController");

    module.exports = function (app) {
        app.get("/", indexController.home);
        app.get("/api/mappings", mappingInfoController.getAll);
        app.get("/refresh", mappingInfoController.refreshMappingInfo);

        app.get("/api/logfile", logFileController.getLogFileInfo);
        app.post("/api/upload", logFileController.handleUploading);
    };
})();