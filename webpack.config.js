// NOTE: To use this example standalone (e.g. outside of deck.gl repo)
// delete the local development overrides at the bottom of this file

const {resolve} = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const CONFIG = {
  entry: {
    main: './app.js',
    app: './app.js',
    app2017: './app2017.js',
    app2016: './app2016.js',
    app2015: './app2015.js'
  },

  devtool: 'source-map',

  module: {
    rules: [
      {
        // Transpile ES6 to ES5 with babel
        // Remove if your app does not use JSX or you don't need to support old browsers
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: [/node_modules/],
        options: {
          presets: ['@babel/preset-react']
        }
      }
    ]
  },

  resolve: {
    alias: {
      // From mapbox-gl-js README. Required for non-browserify bundlers (e.g. webpack):
      'mapbox-gl$': resolve('./node_modules/mapbox-gl/dist/mapbox-gl.js')
    }
  },

  // Optional: Enables reading mapbox token from environment variable
  plugins: [
    new webpack.EnvironmentPlugin(['MapboxAccessToken']),
    new HtmlWebpackPlugin({title: 'DATA 608 Trip Count 2018'})
  ]
};

// This line enables bundling against src in this repo rather than installed deck.gl module
module.exports = env => (env ? require('../../webpack.config.local')(CONFIG)(env) : CONFIG);
