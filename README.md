# 基于 webpack5 构建 h5 单页面工作流

如果对你有所帮助, 希望您能给我点个 `start`

## 支持 scss/sass 语法

```scss
.box {
    background-color: $color-primary;
    width: 200px;
    height: 200px;

    .box2 {
        width: 300px;
        height: 100px;
        background-color: $color-primary;
        font-weight: 800;
        font-size: 30px;
    }
}
```

## 全局注入 sass 变量

```javascript
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
}
```

## 自动引入全局初始化文件,例如 normalize.css/normalize.css

```javascript
import '../styles/index.scss'
import 'normalize.css/normalize.css'

console.log('测试全局自动引入公共文件')
```

实现思路就是, 将 `auto` 下的 js 文件作为入口文件经过 `webpack` 打包后作为`chunk` 通过 `html-webpack-plugin`引入到每个 `html` 中。

这里是配置:

```javascript
// 入口文件对应的模板
new HtmlWebpackPlugin({
    template: path.resolve(root, 'src/pages/index/index.html'),
    filename: 'index.html',
    chunks: ['index', 'auto'], // auto
    inject: 'body'
})
new HtmlWebpackPlugin({
    template: path.resolve(root, 'src/pages/other/other.html'),
    filename: 'other.html',
    chunks: ['other', 'auto'], // auto
    inject: 'body'
})
```

## html-loader 不打包静态资源

静态资源,例如 uicss 或者 ui 库、jq 等

```javascript
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
}
```
