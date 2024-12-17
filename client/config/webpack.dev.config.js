/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const { merge } = require('webpack-merge');
const Base = require('./webpack.base.config')

const resolve = path.resolve.bind(path, __dirname);

const dashboardBuildPath = path.resolve(__dirname,'../dist')
const fileLoaderPath = "file-loader?name=[name].[ext]";
const devConfig = {
  devServer: {
    compress: true,
    contentBase: path.join(__dirname, dashboardBuildPath),
    historyApiFallback: true,
    open: true,
    proxy: {
      "/api": {
        target: "http://localhost:3001/",
        secure: false,
        changeOrigin: true
      },
    },
    hot: true,
    port: 9002
  },
  mode:'development',
  devtool:  "sourceMap",
  output:{
    chunkFilename: "[name].js",
    filename: "[name].js",
    path: resolve(dashboardBuildPath),
    publicPath: "/"
  },
  module: {
    rules: [
      {
        test: /.s?css$/,
        use: [
          "style-loader",
          "css-loader",
          "sass-loader"
        ]
      },
      {
        test: /\.less$/i,
        use: [
          "style-loader",
          "css-loader",
          {
            loader: "less-loader",
            options: {
              lessOptions: {
                javascriptEnabled: true
              }
            }
          }
        ]
      }
    ]
  }
}
module.exports = merge(Base,devConfig)