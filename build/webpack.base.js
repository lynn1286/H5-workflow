const path = require('path')
const WebpackBar = require('webpackbar')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const webpackEntry = require('./webpack.entry').entry()

const root = process.cwd()

const isProd = process.env.NODE_ENV === 'production'

// 自动引入
require('./webpack.auto').autoFile(webpackEntry)

module.exports = {
    target: isProd ? 'browserslist' : 'web', // 解决热更新失效问题
    entry: webpackEntry.entry,
    output: {
        path: path.resolve(root, 'dist'),
        filename: 'js/[name]/[name].[hash].js',
        clean: true
    },
    resolve: {
        extensions: ['.js', '.jsx', '.json', 'scss', 'css'], // 引入文件时可以省略后缀名称
        alias: {
            '@': path.resolve(root, 'src/')
        }
    },
    module: {
        rules: [
            // 处理 js 文件
            {
                test: /\.(js|jsx)$/i,
                loader: 'babel-loader'
            },
            // 处理 css 文件
            {
                test: /\.css$/i,
                use: [
                    isProd ? MiniCssExtractPlugin.loader : 'style-loader', // 开发环境下 会导致 css 热更新失效，所以换成style-loader
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1 // 配置这个的作用是为了让 @import 的 scss 文件也添加浏览器前缀
                        }
                    },
                    'postcss-loader'
                ]
            },
            // 处理 scss 文件
            {
                test: /\.s[ac]ss$/i,
                use: [
                    isProd ? MiniCssExtractPlugin.loader : 'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 3
                        }
                    },
                    'sass-loader',
                    'postcss-loader',
                    // 全局引入 scss 文件， 未使用的 mixin function 不会被导入
                    {
                        loader: 'sass-resources-loader',
                        options: {
                            resources: [
                                'src/styles/gobal.scss' // 引入全局 Sass 变量的文件, 这样就不需要每个 scss 文件中都 @import
                            ]
                        }
                    }
                ]
            },
            // 处理 html 文件
            {
                test: /\.html$/,
                loader: 'html-loader',
                options: {
                    minimize: false,
                    // 配置 html 不处理静态资源的引入, 如果不配置会导致打包报错,原因是将html中 引入的 link 或者 script 中的 src 处理成 hash 导致文件找不到
                    sources: {
                        list: [
                            '...', // 这个一定要配置, 否则只处理下面的类型
                            {
                                tag: 'script',
                                attribute: 'src',
                                type: 'src',
                                filter: () => false // 这里是关键， 让 html 中的 script 标签不参与打包
                            },
                            {
                                tag: 'link',
                                attribute: 'href',
                                type: 'src',
                                filter: () => false
                            },
                            {
                                tag: 'a',
                                attribute: 'href',
                                type: 'src' // 如果在 html 中使用 a 标签跳转图片也要处理路径，否则不会参与打包
                            }
                        ]
                    }
                }
            },
            {
                test: /\.(png|jpg|gif|jpeg)$/i,
                type: 'asset',
                parser: {
                    // 处理图片体积
                    dataUrlCondition: {
                        maxSize: 3 * 1024
                    }
                },
                generator: {
                    filename: 'static/images/[hash][ext]'
                }
            },
            {
                test: /\.(eot|woff|ttf|woff2|appcache|mp4|pdf|svg)(\?|$)/i,
                type: 'asset/resource', // 这类资源不需要打包成base64
                generator: {
                    filename: 'static/fonts/[hash][ext][query]'
                }
            }
        ]
    },
    plugins: [
        ...webpackEntry.htmlTmplater, // html 模版

        // 复制静态资源库 一般都是些不需要参与打包的文件， 例如 第三方 ui 库 或者 jquery 包、 uicss 等
        new CopyPlugin({
            patterns: [{ from: path.resolve(root, 'static'), to: 'static' }]
        }),

        // 打包进度条
        new WebpackBar({
            name: '正在进行打包',
            color: '#ff5777'
        }),

        // 优化控制台信息
        new FriendlyErrorsWebpackPlugin({
            // 是否每次都清空控制台
            clearConsole: true
        })
    ].concat(
        isProd
            ? [
                  // 合并文件内css
                  new MiniCssExtractPlugin({
                      filename: 'css/[name]/[name].[hash].css'
                  })
              ]
            : []
    ),
    optimization: {
        minimize: isProd,
        minimizer: [
            new TerserPlugin({
                extractComments: false, // 不将注释提取到单独的文件中
                parallel: true // 使用多进程并发运行以提高构建速度
            })
        ],
        runtimeChunk: 'single', // 将运行时代码分割成一个单独的chunk , 解决热更新警告问题
        splitChunks: {
            cacheGroups: {
                // 打包公共模块
                commons: {
                    // initial表示提取入口文件的公共部分
                    chunks: 'initial',
                    // 表示提取公共部分最少的文件数
                    minChunks: 2,
                    // 表示提取公共部分最小的大小
                    minSize: 0,
                    // 提取出来的文件命名
                    name: 'commons'
                },
                commonsVendors: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all'
                }
            }
        }
    }
}
