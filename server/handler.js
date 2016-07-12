var fs = require('fs');
var encoder = require('./util/encoder.js')

exports.upload = function(req, res) {
  var stream;
  req.pipe(req.busboy);
  req.busboy.on('file', function (fieldname, file, filename) {
    console.log('Uploading: ' + filename);
    stream = fs.createWriteStream(__dirname + '/files/' + filename);
    file.pipe(stream);
    stream.on('close', function () {
      encoder.encode(filename, '', res);
    })
  })
}