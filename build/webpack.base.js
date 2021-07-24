const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const root = process.cwd()

const isProd = process.env.NODE_ENV === 'production'

module.exports = {
    target: 'web', // 解决热更新失效问题
    entry: {
        index: path.resolve(root, 'src/pages/index/index.js'),
        other: path.resolve(root, 'src/pages/other/other.js'),
        auto: path.resolve(root, 'src/auto/index.js')
    },
    output: {
        path: path.resolve(root, 'dist'),
        filename: 'js/[name]/[name].[hash].js',
        clean: isProd ? true : false
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
        // 入口文件对应的模板
        new HtmlWebpackPlugin({
            template: path.resolve(root, 'src/pages/index/index.html'),
            filename: 'index.html',
            chunks: ['index', 'auto'],
            inject: 'body'
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(root, 'src/pages/other/other.html'),
            filename: 'other.html',
            chunks: ['other', 'auto'],
            inject: 'body'
        }),

        // 复制静态资源库 一般都是些不需要参与打包的文件， 例如 第三方 ui 库 或者 jquery 包、 uicss 等
        new CopyPlugin({
            patterns: [{ from: path.resolve(root, 'static'), to: 'static' }]
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
        minimize: true,
        minimizer: [
            new TerserPlugin({
                extractComments: false //不将注释提取到单独的文件中
            })
        ],
        runtimeChunk: 'single', // 将运行时代码分割成一个单独的chunk , 解决热更新警告问题
        splitChunks: {
            chunks: 'all',
            // 提取第三方库, 因为它们一般不会变化
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'common-libs',
                    chunks: 'all'
                }
            }
        }
    }
}
