import _ from 'lodash'
import './css/style.css'
import './scss/style.scss'

function component() {
    let element = document.createElement('div')

    element.innerHTML = _.join(['Hello', 'webpack'], ' ')
    element.classList.add('hello')

    return element
}

document.body.appendChild(component())