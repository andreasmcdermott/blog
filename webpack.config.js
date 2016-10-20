const join = require('path').join
const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
  entry: './client/scripts/main.js',
  output: {
    path: join(__dirname, 'static/'),
    filename: 'scripts/main.js'
  },
  module: {
    loaders: [{
      test: /\.styl$/,
      loader: ExtractTextPlugin.extract('style-loader', 'css-loader!stylus-loader')
    }]
  },
  plugins: [
      new ExtractTextPlugin("styles/main.css")
  ]
}