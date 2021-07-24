// 热更新
if (module.hot) {
    module.hot.accept()
}

import './index.scss'
import { getFile } from '@/utils/getName'

import { chunk } from 'lodash-es'
console.log(
    '%c 🍻 debounce: ',
    'font-size:20px;background-color: #33A5FF;color:#fff;',
    chunk(['a', 'b', 'c', 'd'], 2),
    getFile(),
    '---------------------------------123123123'
)

// 创建没有构造函数的类属性
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
