const path = require('path');

module.exports = {
  mode: 'development',
  entry: {
    app: ['./app/index.js']
  },
  output: {
    path: path.resolve(__dirname, 'public/js'),
    publicPath: '/js/',
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: [ 'es2015', 'react' ]
        }
      }
    ]
  },
  devServer: {
    historyApiFallback: true
  }
};

