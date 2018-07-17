const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/server.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'server.js',
    publicPath: '/',
  },
  target: 'node',
  externals: nodeExternals(),
  plugins: [
    new webpack.DefinePlugin({ 'process.env': { NODE_ENV: 'production' } }),
    new CopyWebpackPlugin([{ context: './src/', from: 'schemas/*', to: '.', ignore: ['package.json'], force: true }], { copyUnmodified: true }),
    new CopyWebpackPlugin([{ context: './src/', from: 'data/*', to: '.', ignore: ['package.json'], force: true }], { copyUnmodified: true }),
    new CopyWebpackPlugin([{ context: './src/', from: 'winstonResults.log', to: '.', force: true }], { copyUnmodified: true }),
    new CopyWebpackPlugin([{ context: './', from: 'doc/**', to: '.', force: true }], { copyUnmodified: true }),
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        query: {
          presets: ['react'],
        },
      },
    ],
  },
};
