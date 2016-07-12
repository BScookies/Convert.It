var TransloaditClient = require('transloadit'),
    TRANSLOADIT_API   = process.env.TRANSLOADIT_KEY ? { authKey: process.env.TRANSLOADIT_KEY,
                                                        authSecret: process.env.TRANSLOADIT_SECRET }
                                                    : require('../lib/TRANSLOADIT_API.js');

var transloadit = new TransloaditClient(TRANSLOADIT_API);


exports.encode = function(filename, destFormat) {
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

    console.log('success ', result);

    var assemblyId = result.assembly_id;
    console.log({
      assemblyId: assemblyId
    });
  });
}