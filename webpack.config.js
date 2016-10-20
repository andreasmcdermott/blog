const join = require('path').join
const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
  entry: './static/scripts/main.js',
  output: {
    path: join(__dirname, 'static/build'),
    filename: 'client.js'
  },
  module: {
    loaders: [{
      test: /\.styl$/,
      loader: ExtractTextPlugin.extract('style-loader', 'css-loader!stylus-loader')
    }]
  },
  plugins: [
      new ExtractTextPlugin("styles.css")
  ]
}