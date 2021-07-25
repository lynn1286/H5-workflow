import './index.scss'
import { getFile } from '@/utils/getName'

import { join } from 'lodash-es'

const element = document.createElement('div')
element.innerHTML = join(['Hello', 'webpack'], ' ')

console.log(getFile(), '--')

$.ajax({
    url: '/api/userInfo',
    data: { name: 'jenny' },
    type: 'get',
    dataType: 'json',
    success: function (data) {
        console.log('%c 🍨 data: ', 'font-size:20px;background-color: #42b983;color:#fff;', data)
    }
})

$.ajax({
    url: '/userInfo',
    data: { name: 'jenny' },
    type: 'post',
    dataType: 'json',
    success: function (data) {
        console.log('%c 🍨 data: ', 'font-size:20px;background-color: #42b983;color:#fff;', data)
    }
})

// 测试新语法
class Game {
    name = 'Violin Charades'
}
const myGame = new Game()
// 创建 p 节点
const p = document.createElement('p')
p.textContent = `I like ${myGame.name}.`

const heading = document.createElement('h1')
heading.textContent = 'Interesting!'

const app = document.querySelector('.index')
app.append(heading, p)
app.append(element)
