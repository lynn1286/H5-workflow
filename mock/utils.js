/*
 * @Author: lynn
 * @Date: 2021-06-23 09:54:05
 * @LastEditTime: 2021-07-25 17:47:45
 * @LastEditors: lynn
 * @Description:
 */
const chalk = require('chalk')
const fs = require('fs-extra')
const path = require('path')
const Mock = require('mockjs2')
const JSON5 = require('json5')

/**
 * @description: 定时器 模拟接口返回时间
 * @param { number } time
 * @return { promises }
 */
const delay = function (time) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve()
        }, time)
    })
}

/**
 * @description: 读取本地json文件，返回json数据
 * @param { string } dataFilePath
 * @param { string } method
 * @return { string } 返回 json 数据
 */
async function getMockData(dataFilePath, method) {
    const fileJsonPath = `${dataFilePath}.json`
    const fileMockjsPath = `${dataFilePath}.mockjs.json`
    const fileRestFulPath = `${dataFilePath}$${method.toLowerCase()}.json`
    const fileRestFulMockjsPath = `${dataFilePath}$${method.toLowerCase()}.mockjs.json`
    const fileExist = await fs.pathExists(dataFilePath)
    const fileJsonExist = await fs.pathExists(fileJsonPath)
    const fileMockjsExist = await fs.pathExists(fileMockjsPath)
    const fileRestFulExist = await fs.pathExists(fileRestFulPath)
    const fileRestFulMockjsExist = await fs.pathExists(fileRestFulMockjsPath)

    // 先寻找 RESTFul .mockjs.json 文件
    if (fileRestFulMockjsExist) {
        return fs
            .readFile(fileRestFulMockjsPath, 'utf8')
            .then(json => JSON.stringify(Mock.mock(JSON5.parse(json))))
    }

    // 再寻找 RESTFul .json 数据文件
    if (fileRestFulExist) {
        return fs.readFile(fileRestFulPath, 'utf8')
    }

    // 再寻找 .mockjs.json 后缀 mock 数据文件
    if (fileMockjsExist) {
        return fs
            .readFile(fileMockjsPath, 'utf8')
            .then(json => JSON.stringify(Mock.mock(JSON5.parse(json))))
    }

    // 再寻找 .json 后缀 mock 数据文件
    if (fileJsonExist) {
        return fs.readFile(fileJsonPath, 'utf8')
    }

    // 再寻找无后缀 mock 数据文件
    if (fileExist) {
        return fs.readFile(dataFilePath, 'utf8')
    }

    console.error(chalk`{red.bold ------- ERROR ------}`)
    console.error(chalk`{red.bold 尝试了以下可能的 mock 数据文件，仍没有找到对应的数据}`)
    console.error(chalk`{red.bold 1. ${fileRestFulPath}}`)
    console.error(chalk`{red.bold 2. ${fileRestFulMockjsPath}}`)
    console.error(chalk`{red.bold 3. ${fileJsonPath}}`)
    console.error(chalk`{red.bold 4. ${fileMockjsExist}}`)
    console.error(chalk`{red.bold 5. ${dataFilePath}}`)

    return Promise.reject(new Error(`未找到对应 mock 文件, 请确认路径是否正确`))
}

// 接口前缀
const devServerMockUrlMatch = /^\/api\//

/**
 * @description: 返回存放在本地json数据的完整路径
 * @param {*} originalUrl
 * @param {*} replaceStr 是否需要替换前缀拼接路径， 如果没有前缀，填空字符串就可以
 * @param {*} notPrefix 是否有接口前缀 如果有需要到本地 mock 文件夹的json文件内再加一层 前缀文件夹
 * @return {*} 完整的本地路径
 */
function replacer(originalUrl, replaceStr = devServerMockUrlMatch, notPrefix = false) {
    if (notPrefix)
        return originalUrl.replace(replaceStr, `${path.join(process.cwd(), 'mock/json')}/`)

    return originalUrl
        .replace(devServerMockUrlMatch, `${path.join(process.cwd(), 'mock/json')}$&`)
        .replace(/\?.*$/, '')
}

const utils = {
    delay,
    getMockData,
    replacer,
    chalk,
    JSON5,
    devServerMockUrlMatch
}

module.exports = utils

// 监听 没有 reject 处理器的情况
process.on('unhandledRejection', reason => {
    console.log(chalk.red.bold(reason))
    console.error(reason.stack)

    // 以失败代码退出程序
    process.exit(1)
})
