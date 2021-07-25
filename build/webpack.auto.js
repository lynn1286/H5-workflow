const path = require('path')

exports.autoFile = entrys => {
    entrys.entry['autoFile'] = path.resolve(process.cwd(), 'src/auto/index.js')

    entrys.htmlTmplater.forEach(item => {
        item.userOptions.chunks.unshift('autoFile') // 将自动引入的 chunk 通过 htmlplugin 引入到每个 html 中
        item.userOptions.chunksSortMode = 'manual' // 按照 chunk 数组排序
    })
}
