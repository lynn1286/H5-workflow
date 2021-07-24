const { merge } = require('webpack-merge')
const baseConfig = require('./webpack.base')
const path = require('path')
const portfinder = require('portfinder') // 自动获取可用端口，避免端口被占用

const root = process.cwd()

const devWebpackConfig = merge(baseConfig, {
    mode: 'development',
    devtool: 'eval-cheap-module-source-map',
    devServer: {
        contentBase: path.resolve(root, 'dist'),
        compress: true,
        hotOnly: true,
        watchContentBase: true,
        open: false
    }
})

module.exports = new Promise((resolve, reject) => {
    portfinder.getPort(
        {
            port: 8080, // 默认8080端口，若被占用，重复+1，直到找到可用端口或到stopPort才停止
            stopPort: 65535 // maximum port
        },
        (err, port) => {
            if (err) {
                reject(err)
                return
            }

            devWebpackConfig.devServer.port = port
            resolve(devWebpackConfig)
        }
    )
})
