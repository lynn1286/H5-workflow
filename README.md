# webpack 搭建 h5 多页面

新建 `build` 存放三个文件:

-   webpack.base.js
-   webpack.dev.js
-   webpack.prod.js

使用 `webpack-merge` 插件, 将区分测试环境和生产环境, 使用方式:

```javascript
const { merge } = require('webpack-merge')
const baseConfig = require('./webpack.base')

module.exports = merge(baseConfig, {
    mode: 'development'
})
```

使用 `html-webpack-plugin` 动态生成 `html` 模版, 使用方式:

```javascript
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const root = process.cwd()

module.exports = {
    entry: {
        index: path.resolve(root, 'src/pages/index/index.js'),
        other: path.resolve(root, 'src/pages/other/other.js')
    },
    output: {
        path: path.resolve(root, 'dist'),
        filename: '[name].[fullhash].js',
        clean: true
    },
    module: {
        rules: []
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: path.resolve(root, 'src/pages/index/index.html'),
            chunks: ['index']
        }),

        new HtmlWebpackPlugin({
            filename: 'other.html',
            template: path.resolve(root, 'src/pages/other/other.html'),
            chunks: ['other']
        })
    ]
}
```

`scss-loader`语法支持 ,使用方式:

```javascript
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const root = process.cwd()

module.exports = {
    entry: {
        index: path.resolve(root, 'src/pages/index/index.js'),
        other: path.resolve(root, 'src/pages/other/other.js')
    },
    output: {
        path: path.resolve(root, 'dist'),
        filename: '[name].[fullhash].js',
        clean: true
    },
    module: {
        rules: [
            // 使用 scss-loader,注意 loader 是从右到左的加载执行的
            {
                test: /\.s[ac]ss$/i,
                use: ['style-loader', 'css-loader', 'sass-loader']
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: path.resolve(root, 'src/pages/index/index.html'),
            chunks: ['index']
        }),
        new HtmlWebpackPlugin({
            filename: 'other.html',
            template: path.resolve(root, 'src/pages/other/other.html'),
            chunks: ['other']
        })
    ]
}
```
抽离`css`,



图片的使用, `url-loader`的使用方式:

```javascript
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const root = process.cwd()

module.exports = {
    entry: {
        index: path.resolve(root, 'src/pages/index/index.js'),
        other: path.resolve(root, 'src/pages/other/other.js')
    },
    output: {
        path: path.resolve(root, 'dist'),
        filename: '[name].[fullhash].js',
        clean: true
    },
    module: {
        rules: [
            // 使用 scss-loader,注意 loader 是从右到左的加载执行的
            {
                test: /\.s[ac]ss$/i,
                use: ['style-loader', 'css-loader', 'sass-loader']
            },

            // 使用url-loader, 将项目中 scss 或者 js 中使用到的图片打包
            {
                test: /\.(png|jpg|gif|jpeg)$/i,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            // 大于 1kb 的图片 进行 base64 转换
                            limit: 1024,
                            // 打包后的名字保持一致，并加上hash, 后缀也保持
                            name: 'images/[name]-[hash].[ext]'
                        }
                    }
                ]
            },

            // 字体图标也是需要打包的, 同样使用 url-loader
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 20000,
                    name: 'fonts/[name]-[hash].[ext]'
                }
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: path.resolve(root, 'src/pages/index/index.html'),
            chunks: ['index']
        }),
        new HtmlWebpackPlugin({
            filename: 'other.html',
            template: path.resolve(root, 'src/pages/other/other.html'),
            chunks: ['other']
        })
    ]
}
```



<!-- 清理 `dist` 目录下的文件, `clean-webpack-plugin` 的使用: -->


