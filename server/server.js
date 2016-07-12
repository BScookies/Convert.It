var express           = require('express'),
    handler           = require('./handler'),
    busboy            = require('connect-busboy'),
    app               = express();


app.use(express.static('client'));
app.use(busboy());

app.post('/uploadHandler', handler.upload)

module.exports = app;