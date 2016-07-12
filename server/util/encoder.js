var TransloaditClient = require('transloadit'),
    TRANSLOADIT_API   = process.env.TRANSLOADIT_KEY ? { authKey: process.env.TRANSLOADIT_KEY,
                                                        authSecret: process.env.TRANSLOADIT_SECRET }
                                                    : require('../lib/TRANSLOADIT_API.js'),
    transloadit = new TransloaditClient(TRANSLOADIT_API),
    checksum = require('checksum'),
    cache = {},
    waitForEncode;

var getEncodeStatus = function(assemblyId, res, sum) {
  transloadit.getAssembly(assemblyId, function(err, response) {
    if (err) {
      console.log('error')
      res.send(400);
    } else {
      if (response.ok === 'ASSEMBLY_COMPLETED') {
        clearInterval(waitForEncode);
        cache[sum] = response.results.encode[0].url;
        res.json({ url: cache[sum] });
      }
    }
  })
}


exports.encode = function(filename, destFormat, res) {
  var path = './server/files/' + filename;

  checksum.file(path, function(err, sum) {
    if (cache[sum]) {
      console.log('serving from cache');
      res.json({ url: cache[sum] });
    } else {
      transloadit.addFile(filename, path);

      var assemblyOptions = {
        params: {
          template_id: 'd241d7a047b211e6b8b9275d8c3f23d9'
        }
      }

      transloadit.createAssembly(assemblyOptions, function(err, result) {
        if (err) {
          throw new Error(err);
        }

        //console.log(res);


        var assemblyId = result.assembly_id;

        waitForEncode = setInterval(function() { getEncodeStatus(assemblyId, res, sum) }, 1500);

        console.log({
          assemblyId: assemblyId
        });
      });
    }
  })

}