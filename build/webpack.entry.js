const path = require('path')
const glob = require('glob')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const publicPath = './'
const entry = {}
const htmlTmplater = []
const root = process.cwd()

const getEntryFile = (parent = 'src/pages/*') => {
    const fileList = glob.sync(path.resolve(root, parent))

    if (fileList.length <= 0) return

    fileList.forEach(file => {
        const jsFile = file.match(/.*\/(.*js)/i)

        if (jsFile !== null && jsFile[1]) {
            const jsName = jsFile[1]
            const key = jsName.match(/(.*).js/i)[1]
            entry[key] = publicPath + parent.replace(/\*/, '') + jsName
        } else {
            const parentPath = parent.replace(/\*/, '')
            const reg = new RegExp(parentPath + '(.*)', 'i')
            const folder = file.match(reg)[1]
            if (!file.match(/.*\/(.*?)\..*/)) {
                console.log(file)
                getEntryFile(parentPath + folder + '/*')
            }
        }
    })
}

const setHtmlTemplate = () => {
    Object.keys(entry).forEach(key => {
        htmlTmplater.push(
            new HtmlWebpackPlugin({
                template: entry[key].replace(/\.js/, '.html'),
                filename: key + '.html',
                chunks: [key],
                inject: 'body',
                minify: false
            })
        )
    })
}

exports.entry = () => {
    getEntryFile()
    setHtmlTemplate()
    return { entry, htmlTmplater }
}
