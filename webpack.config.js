const path = require('path');
const BundleTracker = require('webpack-bundle-tracker');
const ForkTsCheckerNotifierWebpackPlugin = require('fork-ts-checker-notifier-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const webpack = require('webpack');

if (!process.env.LAUGHINGPOTATO_BASE_URL) {
  process.env.LAUGHINGPOTATO_BASE_URL = '';
}
if (!process.env.LAUGHINGPOTATO_STATIC_URL) {
  process.env.LAUGHINGPOTATO_STATIC_URL = '/static/';
}

module.exports = {
  context: __dirname,
  entry: {
    frontend: './laughingpotato/frontend/src/index.tsx',
  },
  devtool: 'inline-source-map',
  output: {
    path: path.resolve('./laughingpotato/frontend/dist'),
    filename: '[name]-[fullhash].js',
    chunkFilename: '[name].bundle.js',
    publicPath: `${process.env.LAUGHINGPOTATO_BASE_URL}${process.env.LAUGHINGPOTATO_STATIC_URL}`,
  },
  plugins: [
    new CleanWebpackPlugin(),
    new BundleTracker({
      path: __dirname,
      filename: './laughingpotato/frontend/webpack-stats.json',
    }),
    new Dotenv({ defaults: true }),
    new ForkTsCheckerWebpackPlugin(),
    new ForkTsCheckerNotifierWebpackPlugin({
      title: 'Sparkle TypeScript',
      excludeWarnings: false,
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|venv)/,
        include: path.resolve(__dirname, 'laughingpotato/frontend/src'),
        use: {
          loader: 'babel-loader',
          options: { presets: [['@babel/env', { exclude: ['proposal-dynamic-import'] }], ['@babel/preset-react', { exclude: ['proposal-dynamic-import'] }]] },
        },
      },
      {
        test: /\.tsx$/,
        loader: 'ts-loader',
        include: path.resolve(__dirname, 'laughingpotato/frontend/src'),
        exclude: /(node_modules|venv)/,
        options: {
          transpileOnly: true,
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        include: path.resolve(__dirname, 'laughingpotato/frontend'),
        use: [
          {
            loader: 'url-loader',
          },
        ],
      },
    ],
  },
  devServer: {
    devMiddleware: {
      writeToDisk: true,
    },
    hot: true,
    compress: true,
  },
  resolve: {
    extensions: ['.js', '.tsx', '.ts', '.jsx'],
    symlinks: false,
    plugins: [new TsconfigPathsPlugin()],
    alias: {
      '@sparkle': path.resolve(__dirname, 'laughingpotato/frontend/src'),
    },
  },
  optimization: {
    splitChunks: {
      chunks: 'async',
      minSize: 2000,
      minRemainingSize: 0,
      minChunks: 1,
      maxAsyncRequests: 30,
      maxInitialRequests: 30,
      enforceSizeThreshold: 50000,
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          reuseExistingChunk: true,
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
  },
};
