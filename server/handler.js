var fs = require('fs');
var encoder = require('./util/encoder.js')

exports.upload = function(req, res) {
  var stream;
  var params = {};

  req.pipe(req.busboy);

  req.busboy.on('field', function(fieldname, val) {
    // reads the destination format and quality into params
    params[fieldname] = val;
  });
  req.busboy.on('file', function (fieldname, file, filename) {
    console.log('Uploading: ' + filename);
    console.log('Params: ', params);

    // write the uploaded file to disk
    stream = fs.createWriteStream(__dirname + '/files/' + filename);
    file.pipe(stream);

    stream.on('close', function () {
      // once we've received the entire file, pass to the encoder with the response object and encode params
      encoder.encode(filename, res, params);
    })
  })
}