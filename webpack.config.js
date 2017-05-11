const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const config = {
  entry: {client: './src/scripts/client.js', listen: './src/scripts/listen.js'},
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    publicPath: '/'
  },
  devServer: {
    port: 8080,
    host: '0.0.0.0',
    https: true,
  },
  module: {
    rules: [
      {
        test: /.jsx?$/,
        use: 'source-map-loader',
        enforce: "pre",
      },
      {
        test: /.jsx?$/,
        use: 'babel-loader',
        exclude: /node_modules/,
        include: path.resolve(__dirname),
      },
      {test: /\.css$/, use: ['style-loader', 'css-loader']}
    ]
  },
  plugins: []
};

module.exports = config;
