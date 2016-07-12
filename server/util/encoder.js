var TransloaditClient = require('transloadit'),
    TRANSLOADIT_API   = process.env.TRANSLOADIT_KEY ? { authKey: process.env.TRANSLOADIT_KEY,
                                                        authSecret: process.env.TRANSLOADIT_SECRET }
                                                    : require('../lib/TRANSLOADIT_API.js');

var transloadit = new TransloaditClient(TRANSLOADIT_API);
var waitForEncode;

var getEncodeStatus = function(assemblyId, res) {
  transloadit.getAssembly(assemblyId, function(err, response) {
    console.log('checking')
    console.log(res)
    if (err) {
      console.log('error')
      res.send(400);
    } else {
      if (response.ok === 'ASSEMBLY_COMPLETED') {
        clearInterval(waitForEncode);
        res.json({ url: response.results.encode[0].url });
      }
    }
  })
}


exports.encode = function(filename, destFormat, res) {
  transloadit.addFile(filename, './server/files/' + filename);

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

    waitForEncode = setInterval(function() { getEncodeStatus(assemblyId, res) }, 1500);

    console.log({
      assemblyId: assemblyId
    });
  });
}