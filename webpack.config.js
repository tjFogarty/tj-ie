const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const WorkboxPlugin = require('workbox-webpack-plugin')

module.exports = env => {
  return {
    mode: env.NODE_ENV === 'local' ? 'development' : 'production',
    entry: './src/js/index.js',
    output: {
      filename: '[name].[hash].js',
      chunkFilename: '[name].[hash].bundle.js',
      path: path.resolve(__dirname, 'assets'),
      publicPath: '/assets/',
    },
    module: {
      rules: [{
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader']
      }]
    },
    plugins: [
      new CleanWebpackPlugin({
        cleanOnceBeforeBuildPatterns: ['workbox-*.*']
      }),
      new MiniCssExtractPlugin(),
      new HtmlWebpackPlugin({
        filename: '../_includes/layouts/base.njk',
        template: 'src/layout.njk',
        scriptLoading: 'defer',
        inject: false,
      }),
      new WorkboxPlugin.GenerateSW({
        skipWaiting: true,
        clientsClaim: true,
        swDest: '../sw.js',
        exclude: [/\.njk$/i, /\.css$/i],
        runtimeCaching: [{
          urlPattern: new RegExp('/$'),
          handler: 'CacheFirst'
        }]
      })
    ]
  }
}
