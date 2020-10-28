
var path = require('path')
var config = require('../config')
var utils = require('./utils')
var projectRoot = path.resolve(__dirname, '../')
var webpack = require('webpack')

module.exports = {
  entry: {
    app:  ["babel-polyfill",'./src/main.js'],
   
  },
  output: {
    path: config.build.assetsRoot,
    publicPath: process.env.NODE_ENV === 'production' ? config.build.assetsPublicPath : config.dev.assetsPublicPath,
    filename: '[name].js'
  },
  resolve: {
    extensions: ['', '.js', '.vue', '.css', '.scss'],
    fallback: [path.join(__dirname, '../node_modules')],
    alias: {
      'src': path.resolve(__dirname, '../src'),
      'assets': path.resolve(__dirname, '../src/assets'),
      'api': path.resolve(__dirname, '../src/api'),
      'image': path.resolve(__dirname, '../src/assets/image'),
      'utils': path.resolve(__dirname, '../src/utils'),
      'filter': path.resolve(__dirname, '../src/filter'),
      'store': path.resolve(__dirname, '../src/store'),
      'components': path.resolve(__dirname, '../src/components')
     
      
    }
  },
  // externals: {
  //   'vue': 'Vue',
  //   'vue-router': 'VueRouter',
  //   'axios': 'axios',
  //   'element-ui': 'Element'
  // },
  resolveLoader: {
    fallback: [path.join(__dirname, '../node_modules')]
  },
  module: {
    loaders: [
      {
        test: /\.vue$/,
        loader: 'vue'
      },
      {
        test: /\.js$/,
        loader: 'babel',
        include:[path.resolve(__dirname,'../src'), path.resolve(__dirname,'../node_modules/hash-base')]
        // exclude: /node_modules/
      },
      {
        test: /\.json$/,
        loader: 'json'
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url',
        query: {
          limit: 15000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(mp3|wav)$/,
        loader: 'url',
        query: {
          limit: 10000,
          name: utils.assetsPath('audio/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url',
        query: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ],
  },
  vue: {
    loaders: utils.cssLoaders(),
    postcss: [
      require('autoprefixer')({
        browsers: ['last 2 versions']
      })
    ]
  }
}