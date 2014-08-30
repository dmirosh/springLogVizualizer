var express = require('express'),
    http = require('http'),
    config = require('./config'),
    log = require('./utils/log'),
    app = express();
    middleware = require('./middleware')(app, express);

http.createServer(app).listen(config.get('port'), function(){
    log.info('Express server listening on port ' + config.get('port'));
});