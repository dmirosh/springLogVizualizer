(function () {
    var MappingInfo = require("../models/mappingInfo"),
        _ = require("../public/vendor/underscore");
    var pattern = /^.* - Mapped "{\[(.*)\],methods=\[(.*)\],params=\[(.*)\],headers=\[(.*)\],consumes=\[(.*)\],produces=\[(.*)\],custom=\[(.*)\]}" onto (\w+) (\w+)\s*([^(]+)\(([^)]+)\)(?: throws (.+))?.*$/;

    var extractUrlInfoFromFile = function (fileName, callback) {
        var lazy = require("lazy"),
            fs = require("fs");
        new lazy(fs.createReadStream(fileName))
            .lines
            .map(processUrl)
            .filter(function (item) {return !!item})
            .join(callback);
    };

    function processUrl(line) {
        var pieces = pattern.exec(line);
        if (!pieces) return;
        return new MappingInfo({
            url: pieces[1],
            httpMethods: pieces[2] ? pieces[2].split(",") : [],

            httpParams: pieces[3] ? pieces[3].split(",") : [],
            httpHeaders: pieces[4] ? pieces[4].split(",") : [],
            consumes: pieces[5] ? pieces[5].split(",") : [],
            produces: pieces[6] ? pieces[6].split(",") : [],
            custom: pieces[7] ? pieces[7].split(",") : [],

            methodScope: pieces[8],

            returnTypeFull: pieces[9],
            returnTypeShort: _getLastPart(pieces[9]),

            handlerClassFull: pieces[10].slice(0, pieces[10].lastIndexOf(".")),
            handlerClassShort: _getLastPart(pieces[10].slice(0, pieces[10].lastIndexOf("."))),

            handlerMethod: pieces[10].slice(pieces[10].lastIndexOf(".") + 1),
            handlerParamsLong: pieces[11].split(","),
            handlerParamsShort: _.map(pieces[11].split(","), _getLastPart),

            exceptions: pieces[12] ? pieces[12] : ""
        });
    }

    function _getLastPart(path) {
        var tokens = path.split(".");
        if(tokens.length === 1) {
            return path;
        }
        return tokens[tokens.length - 1];
    }

    module.exports = extractUrlInfoFromFile;
})();