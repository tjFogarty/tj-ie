const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const WorkboxPlugin = require('workbox-webpack-plugin')

const mode = process.env.ELEVENTY_DEV || 'development'
const isDev = mode === 'development'

const plugins = [
  new CleanWebpackPlugin({
    cleanOnceBeforeBuildPatterns: ['workbox-*.*']
  }),
  new MiniCssExtractPlugin(),
  new HtmlWebpackPlugin({
    filename: __dirname + '/src/site/_includes/layouts/base.njk',
    template: __dirname + '/src/layout.njk',
    scriptLoading: 'defer',
    inject: false,
  }),
];

if (!isDev) {
  plugins.push(new WorkboxPlugin.GenerateSW({
    skipWaiting: true,
    clientsClaim: true,
    swDest: '../sw.js',
    exclude: [/\.njk$/i, /\.css$/i],
    runtimeCaching: [{
      urlPattern: new RegExp('/$'),
      handler: 'StaleWhileRevalidate'
    }]
  }))
}

module.exports = {
  mode,
  entry: {
    main: __dirname + '/src/site/_includes/js/index.js'
  },
  output: {
    filename: '[name].[hash].js',
    chunkFilename: '[name].[hash].bundle.js',
    path: __dirname + '/src/site/assets',
    publicPath: '/assets/'
  },
  module: {
    rules: [{
      test: /\.css$/i,
      use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader']
    }, {
      test: /\.(png|woff|woff2|eot|ttf|svg)$/, loader: 'url-loader?limit=false'
    }]
  },
  plugins
}
