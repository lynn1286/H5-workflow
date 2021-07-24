const { merge } = require('webpack-merge')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const baseConfig = require('./webpack.base')

module.exports = merge(baseConfig, {
    mode: 'production',
    devtool: 'cheap-module-source-map',
    plugins: [
        // css压缩
        new CssMinimizerPlugin()
    ]
})
