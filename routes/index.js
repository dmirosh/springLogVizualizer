(function () {
    var indexController = require("../controllers/indexController"),
        mappingInfoController = require("../controllers/mappingInfoController");

    module.exports = function (app) {
        app.get("/", indexController.home);
        app.get("/api/mappings", mappingInfoController.getAll);
    };
})();