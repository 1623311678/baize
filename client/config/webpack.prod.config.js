/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const { merge } = require('webpack-merge');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const Base = require('./webpack.base.config')

const resolve = path.resolve.bind(path, __dirname);
const dashboardBuildPath = path.resolve(__dirname,'../dist')
const publicPath = "./";
const prodConfig =  {
  mode: "production",
  devtool: false,
  output:{
    chunkFilename: `[name].[chunkhash].js`,
    filename: `[name].[chunkhash].js`,
    path: resolve(dashboardBuildPath),
    publicPath
  },
  module: {
    rules: [
      {
        test: /.s?css$/,
        use: [
         MiniCssExtractPlugin.loader,
          "css-loader",
          "sass-loader"
        ]
      },
      {
        test: /\.less$/i,
        use: [
          MiniCssExtractPlugin.loader,
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
  },
  optimization: {
    minimize: true,
    removeAvailableModules: false,
    removeEmptyChunks: false,
    splitChunks: {
      minSize: 10000, // 设置拆分的最小文件大小阈值
      maxSize: 500000, // 设置拆分的最大文件大小阈值
      minChunks: 1, // 设置被引用次数超过多少次才会被拆分
      maxAsyncRequests: 30, // 设置异步加载的并行请求数上限
      maxInitialRequests: 30, // 设置入口点的并行请求数上限,
      automaticNameDelimiter: '~',
      chunks: "all",
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all',
          priority: -10
        },
        common: {
          name: 'common',
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        },
        'hundun-ui-react': {
          test: /[\\/]node_modules[\\/]hundun-ui-library-react[\\/]/,
          name: 'lodash',
          chunks: 'all',
          priority: 10
        },
        lodash: {
          test: /[\\/]node_modules[\\/]lodash[\\/]/,
          name: 'lodash',
          chunks: 'all',
          priority: 10
        },
        qs: {
          test: /[\\/]node_modules[\\/]qs[\\/]/, // 匹配qs模块
          name: 'qs', // 拆分出的包的名称
          chunks: 'all', // 拆分所有类型的代码块
          priority: 10, // 优先级，数值越大，优先级越高
          enforce: true
        },
        axios: {
          test: /[\\/]node_modules[\\/](axios)[\\/]/,
          name: 'axios',
          chunks: 'all',
          priority: 20,
          enforce: true
        },
        redux: {
          test: /[\\/]node_modules[\\/](redux|react-redux|@reduxjs)[\\/]/,
          name: 'redux',
          chunks: 'all',
          priority: 20,
          enforce: true
        },
        editorjs: {
          name: "chunk-editjs",
          priority: 10,
          test: /[\/]node_modules[\/]@editorjs[\/]/,
          enforce: true
        },
        react: {
          name: "chunk-react",
          priority: 82,
          test: /[\/]node_modules[\/](react|react-dom|react-router|react-router-dom)[\/]/,
          enforce: true
        },
        antd: {
          name: "chunk-antd",
          priority: 13,
          test: /[\/]node_modules[\/](antd|@ant-design|rc-\w+)[\/]/,
          enforce: true
        },
        echarts: {
          name: "chunk-echarts",
          priority: 13,
          test: /[\/]node_modules[\/](echarts)[\/]/,
          enforce: true
        },
        moment: {
          chunks: "all",
          name: "moment",
          test: /(?<!node_modules.*)[\\/]node_modules[\\/](moment|moment-timezone)[\\/]/,
          priority: 24,
          enforce: true
        }
      }
    },
    minimizer: [
      // webpack:production模式默认有配有js压缩，但是如果这里设置了css压缩，js压缩也要重新设置,因为使用minimizer会自动取消webpack的默认配置
      new CssMinimizerPlugin({
        parallel: true,
        minimizerOptions: {
          preset: [
            "default",
            {
              discardComments: { removeAll: true }
            }
          ]
        },
        minify: CssMinimizerPlugin.cleanCssMinify
      }),
      new TerserPlugin({
        include: path.resolve(__dirname,'../src'),
        exclude: /node_modules/,
        terserOptions: {
          ecma: 5,
          parse: {},
          compress: {},
          drop_console: true, //传true就是干掉所有的console.*这些函数的调用.
          drop_debugger: true, //干掉那些debugger;
          pure_funcs: ["console.log"], // 如果你要干掉特定的函数比如console.info ，又想删掉后保留其参数中的副作用，那用pure_funcs来处理
          module: false,
          format: {
            comments: false
          }
        },
        extractComments: false
      })
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].[contenthash].css",
      chunkFilename: "[id].[contenthash].css"
    }),
    new BundleAnalyzerPlugin()
  ]
};

module.exports = merge(Base,prodConfig)