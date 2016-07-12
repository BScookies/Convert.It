module.exports = {
  entry: [
    './client/src/index.js'
  ],
  output: {
    filename: './client/built/bundle.js'
  },
  module: {
    loaders: [{
      test: /.jsx?$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      query: {
        presets: ['es2015', 'react']
      }
    }]
  }
};