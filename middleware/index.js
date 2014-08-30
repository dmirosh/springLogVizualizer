(function () {
    module.exports = function (app, express) {
        var ejs = require('ejs-locals'),
            path = require('path'),
            config = require('../config'),
            router = require('../routes'),
            mongoose = require('../utils/mongoose');

        /**
         * Page Rendering
         * */
        app.engine('html', ejs);
        app.engine('ejs', ejs);
        app.set('views', path.join(__dirname, '../views'));
        app.set('view engine', 'ejs');

        /**
         * Routing
         * */
        router(app);


        /**
         * Public directory
         * */
        app.use(express.static(path.join(__dirname, '../public')));
        app.use("/public", express.static(path.join(__dirname, '../public')));
    };
})();