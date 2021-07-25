import './index.scss'
import { getFile } from '@/utils/getName'

// 动态 import
const { default: _ } = await import('lodash-es');
const element = document.createElement('div');
element.innerHTML = _.join(['Hello', 'webpack'], ' ');

console.log(getFile(), '--')

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
