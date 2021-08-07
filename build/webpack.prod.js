const { merge } = require('webpack-merge')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const baseConfig = require('./webpack.base')

module.exports = merge(baseConfig, {
    mode: 'production',
    // devtool: 'cheap-module-source-map',
    plugins: [
        // css压缩
        new CssMinimizerPlugin()
    ],
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                extractComments: false, // 不将注释提取到单独的文件中
                parallel: true // 使用多进程并发运行以提高构建速度
            })
        ],
        runtimeChunk: 'single',
        splitChunks: {
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all'
                }
            }
        }
    }
})
