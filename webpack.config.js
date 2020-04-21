const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const WorkboxPlugin = require('workbox-webpack-plugin')

module.exports = env => {
  const isDev = env.NODE_ENV === 'local';
  const plugins = [
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

  return {
    mode: isDev ? 'development' : 'production',
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
    plugins
  }
}
