var TransloaditClient = require('transloadit'),
    TRANSLOADIT_API   = process.env.TRANSLOADIT_KEY ? { authKey: process.env.TRANSLOADIT_KEY,
                                                        authSecret: process.env.TRANSLOADIT_SECRET }
                                                    : require('../lib/TRANSLOADIT_API.js'),
    transloadit = new TransloaditClient(TRANSLOADIT_API),
    checksum = require('checksum'),
    cache = {}, // url's expire after 24 hours so we won't persist the cache
    waitForEncode; // for the interval to check if file is done processing

var getEncodeStatus = function(assemblyId, res, sum) {
  transloadit.getAssembly(assemblyId, function(err, response) {
    if (err) {
      console.log('error')
      res.send(400);
    } else {
      if (response.ok === 'ASSEMBLY_COMPLETED') {
        clearInterval(waitForEncode);
        cache[sum] = response.results.encode[0].url; // cache the url of the result
        res.json({ url: cache[sum] }); // then send back the url
      }
    }
  })
}

// big switch to determine which template to use based on chosen params
var selectTemplate = function(format, quality) {
  if (format === 'mp3') {
    if (quality === '0') {
      return '7ef02330487111e6bf42df11836b2f36'
    } else if (quality === '1') {
      return 'd241d7a047b211e6b8b9275d8c3f23d9';
    } else if (quality === '2') {
      return '8bb9c210487111e6ad40fbcda087e444';
    }
  }

  if (format === 'aac') {
    if (quality === '0') {
      return 'f5f75ec0487211e6a047a7590d782e4b'
    } else if (quality === '1') {
      return 'e69e8980487211e6969725d76fca00c2'
    } else if (quality === '2') {
      return 'ca4d1620487211e6b8f9ab1e94d99cfe'
    }
  }

  if (format === 'wav') {
    return '040e8c40487311e6b11473a9ff257956'
  }
}

exports.encode = function(filename, res, params) {
  var path = './server/files/' + filename;

  // first check if we've processed this request before
  checksum.file(path, function(err, sum) {
    // should check the cache for if we've processed this file w/ same settings before
    var sumWithParams = sum + '+' + params.format + '+' + params.quality;

    // if we've processed this file before, respond with the cached url
    if (cache[sumWithParams]) {
      console.log('serving from cache');
      res.json({ url: cache[sumWithParams] });
    } else {
      transloadit.addFile(filename, path);

      var assemblyOptions = {
        params: {
          template_id: selectTemplate(params.format, params.quality) // choose template based on selected params
        }
      }

      // send the file to the transloadit server for encoding
      transloadit.createAssembly(assemblyOptions, function(err, result) {
        if (err) {
          throw new Error(err);
        }

        var assemblyId = result.assembly_id;

        // keep checking to see if file is done processing
        waitForEncode = setInterval(function() { getEncodeStatus(assemblyId, res, sumWithParams) }, 1500);
      });
    }
  });
}