'use strict'
process.env.NODE_ENV = 'production'

const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const ProgressPlugin = require('webpack/lib/ProgressPlugin')
const OfflinePlugin = require('offline-plugin')
const rm = require('rimraf')
const base = require('./webpack.base')
const pkg = require('../package')
const _ = require('./utils')
const config = require('./config')

if (config.electron) {
  // remove files in dist folder in electron mode
  rm.sync('app/assets/*')
} else {
  // remove dist folder in web app mode
  rm.sync('dist/*')
  // use source-map in web app mode
  base.devtool = 'source-map'
}

// use hash filename to support long-term caching
base.output.filename = '[name].[chunkhash:8].js'
// add webpack plugins
base.plugins.push(
  new ProgressPlugin(),
  new ExtractTextPlugin('styles.[contenthash:8].css'),
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify('production')
  }),
  new webpack.optimize.UglifyJsPlugin({
    sourceMap: true,
    compress: {
      warnings: false
    },
    output: {
      comments: false
    }
  }),
  // extract vendor chunks
  new webpack.optimize.CommonsChunkPlugin({
    name: 'vendor',
    minChunks: module => {
      return module.resource && /\.(js|css|es6)$/.test(module.resource) && module.resource.indexOf('node_modules') !== -1
    }
  }),
  new webpack.optimize.CommonsChunkPlugin({
    name: 'manifest'
  }),
  // progressive web app
  // it uses the publicPath in webpack config
  new OfflinePlugin({
    relativePaths: false,
    AppCache: false,
    ServiceWorker: {
      events: true
    }
  })
)

// extract css in standalone css files
_.cssProcessors.forEach(processor => {
  let loaders
  if (processor.loader === '') {
    loaders = ['postcss-loader']
  } else {
    loaders = ['postcss-loader', processor.loader]
  }
  base.module.loaders.push({
    test: processor.test,
    loader: ExtractTextPlugin.extract({
      use: [_.cssLoader].concat(loaders),
      fallback: 'style-loader'
    })
  })
})

// minimize webpack output
base.stats = {
  // Add children information
  children: false,
  // Add chunk information (setting this to `false` allows for a less verbose output)
  chunks: false,
  // Add built modules information to chunk information
  chunkModules: false,
  chunkOrigins: false,
  modules: false
}

if (process.env.NODE_ELECTRON==='true') {
  const fs = require('fs');
  const copy = (src, dst) => {
    fs.writeFileSync(dst, fs.readFileSync(src));
  }
  copy("./app/index.js","./app/dist/index.js");
  copy("./package.json","./app/dist/package.json");
}

module.exports = base
