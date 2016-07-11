var express           = require('express'),
    TransloaditClient = require('transloadit'),
    TRANSLOADIT_API   = process.env.TRANSLOADIT_API || require('./lib/TRANSLOADIT_API.js')
    app               = express();

var transloadit = new TransloaditClient(TRANSLOADIT_API);

transloadit.addFile('test', './test.wav');

var assemblyOptions = {
  params: {
      template_id: 'd241d7a047b211e6b8b9275d8c3f23d9'
    }
}

transloadit.createAssembly(assemblyOptions, function(err, result) {
  if (err) {
    throw new Error(err);
  }

  console.log('success   ', result);

  var assemblyId = result.assembly_id;
  console.log({
    assemblyId: assemblyId
  });
});

app.use(express.static('client'));

module.exports = app;