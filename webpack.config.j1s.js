var webpack = require('webpack');
module.exports = {
  entry: ['src/hero-provider.js'],
  output: {
    path: 'src/dist/',
    filename: 'hero-provider.js',
  },
  module: {
    loaders: [
      {
        test: /\.js?$/,
        loaders: ['react-hot', 'babel'],
        exclude: /node_modules/,
      },
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' },
      { test: /\.css$/, loader: 'style!css' },
      { test: /\.less/, loader: 'style-loader!css-loader!less-loader' },
    ],
  },
  resolve: {
    extensions: ['', '.js', '.json'],
  },
};
