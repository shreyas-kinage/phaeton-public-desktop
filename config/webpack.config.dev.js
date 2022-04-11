const webpack = require('webpack');
const { resolve } = require('path');
const merge = require('webpack-merge');

const baseConfig = require('./webpack.config');
const reactConfig = require('./webpack.config.react');
const version = require('../package.json').version;

const config = {
  mode: 'development',
  output: {
    path: resolve(__dirname, '../app', '../dist'),
    filename: 'bundle.[name].[contenthash].js',
  },
  devServer: {
    contentBase: 'src',
    inline: true,
    port: 8080,
    historyApiFallback: true,
    host: '0.0.0.0',
    hot: true,
  },
  plugins: [
    new webpack.IgnorePlugin({ resourceRegExp: /\.\/locale$/ }),
    new webpack.DefinePlugin({
      PRODUCTION: JSON.stringify(false),
      VERSION: JSON.stringify(version),
    }),
  ],
};

module.exports = merge(baseConfig, reactConfig, config);
