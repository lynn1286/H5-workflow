/*
 * @Author: lynn
 * @Date: 2021-06-23 09:41:17
 * @LastEditTime: 2021-07-25 17:48:02
 * @LastEditors: lynn
 * @Description: mock service
 */
const { delay, getMockData, replacer, chalk, JSON5, devServerMockUrlMatch } = require('./utils.js')

module.exports = app => {
    console.info(chalk`{red.bold --------------开启本地mock数据调试模式--------------}`)

    app.all(devServerMockUrlMatch, async (req, res) => {
        const { method, originalUrl } = req
        console.error(chalk`{red.bold 本地数据请求：[${method}] ${originalUrl}}`)
        try {
            // 响应延迟500ms，模拟请求
            await delay(500)

            const dataFilePath = replacer(originalUrl)

            let data = await getMockData(dataFilePath, method)

            res.append('Access-Control-Allow-Origin', true)
            try {
                data = JSON5.parse(data)
            } catch (e) {
                const errMsg = `local mock json data parse error (本地测试数据JSON解析错误): ${dataFilePath}`
                throw new Error(`${errMsg}\n${e}`)
            }
            res.json(data)
        } catch (err) {
            console.error(chalk`{red.bold ${err}}`)
            res.status(500).send(err.stack)
        }
    })

    // 如果你不需要前缀,则如下匹配拦截
    app.post('/userInfo', async (req, res) => {
        const { method, originalUrl } = req
        console.error(chalk`{red.bold 本地数据请求：[${method}] ${originalUrl}}`)
        try {
            // 响应延迟500ms，模拟请求
            await delay(500)

            const dataFilePath = replacer(originalUrl, '', true)

            let data = await getMockData(dataFilePath, method)

            res.append('Access-Control-Allow-Origin', true)
            try {
                data = JSON5.parse(data)
            } catch (e) {
                const errMsg = `local mock json data parse error (本地测试数据JSON解析错误): ${dataFilePath}`
                throw new Error(`${errMsg}\n${e}`)
            }
            res.json(data)
        } catch (err) {
            console.error(chalk`{red.bold ${err}}`)
            res.status(500).send(err.stack)
        }
    })
}
