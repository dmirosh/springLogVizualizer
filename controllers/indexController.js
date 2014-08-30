(function () {
    var log = require("../utils/log");
    exports.home = function (req, res) {

        res.render("index.html");
    };
})();