import './other.scss'
import _ from 'lodash-es'
console.log('other')
console.log(
    '%c 🍻 debounce: ',
    'font-size:20px;background-color: #33A5FF;color:#fff;',
    _.chunk(['a', 'b', 'c', 'd'], 2)
)
