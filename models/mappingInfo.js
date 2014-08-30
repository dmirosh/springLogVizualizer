(function () {
    var mongoose = require("mongoose"),
        Schema = mongoose.Schema;

    var MappingInfo = new Schema({
        url: String,
        httpMethods: [String],

        httpParams: [String],
        httpHeaders: [String],
        consumes: [String],
        produces: [String],
        custom: [String],

        methodScope: String,

        returnTypeFull: String,
        returnTypeShort: String,

        handlerClassFull: String,
        handlerClassShort: String,

        handlerMethod: String,

        handlerParamsLong: [String],
        handlerParamsShort: [String],
        exception: String
    });

    module.exports = mongoose.model("MappingInfo", MappingInfo);
})();