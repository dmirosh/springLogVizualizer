(function () {
    var log = require("../utils/log");
    exports.handleUploading = function (req, res) {
        log.info("file uploaded");
//        TBD
        res.redirect("/");
    };
    exports.getLogFileInfo = function (req, res) {
//        TBD
        res.json({
            uploadDate: "never",
            fileName: "",
            fileSize: ""
        });
    };
})();