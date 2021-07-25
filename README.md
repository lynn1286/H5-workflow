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

实现思路就是, 将 `auto` 下的 js 文件作为入口文件经过 `webpack` 打包后作为`chunk` 通过
`html-webpack-plugin`引入到每个 `html` 中。

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

## px2rem

如果你的设计稿不是宽度为 750 , 那么你可能需要修改下 postcss.config.js 文件下的插件参数, 例如：

```javascript
// 将 75 改成 96 ，代表你的设计稿是 960 宽的
require('postcss-plugin-px2rem')({
    rootValue: 96, // 换算基数，1rem 等于 75px ， 默认为 100px
    // unitPrecision: 5, // 允许REM单位增长到的十进制数字。
    // propWhiteList: [],  // 默认值是一个空数组，这意味着禁用白名单并启用所有属性。
    // propBlackList: [], // 黑名单
    exclude: /(node_module)/, // 默认false，可以（reg）利用正则表达式排除某些文件夹的方法，例如/(node_module)/ 。如果想把前端UI框架内的px也转换成rem，请把此属性设为默认值
    // selectorBlackList: [], // 要忽略并保留为px的选择器
    // ignoreIdentifier: false,  //（boolean/string）忽略单个属性的方法，启用ignoreidentifier后，replace将自动设置为true。
    // replace: true, // （布尔值）替换包含REM的规则，而不是添加回退。
    mediaQuery: false, // （布尔值）允许在媒体查询中转换px。
    minPixelValue: 3 // 设置要替换的最小像素值(3px会被转rem)。 默认 0
})
```

## 开发环境下自动启用 mock

测试环境下配置了 mock 数据功能, 实现方法是通过 webpack-dev-server 拦截请求后返回本地的 json 数据, 数
据有 mockjs 生成，具体语法请查看 mock 官网。

mock 有两种情况：

-   有接口前缀的情况下， 请修改 mock/utils.js 的变量 devServerMockUrlMatch , 如果刚好你的接口前缀名
    也叫 /api 那么你可以忽略这个配置。
-   如果你没有接口前缀 , 请在 mock/index.js 中拦截你具体的请求路径，项目已经有 demo， 你可以根据这个
    格式书写你的接口
