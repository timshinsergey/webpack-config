import _ from 'lodash'
import Print from './js/some'
import './scss/main.scss'

function component() {
	let element = document.createElement('p')

	element.innerHTML = _.join(['Hello', 'webpack'], ' ')
	element.classList.add('hello')
	element.onclick = Print.bind(null, 'Hello webpack!')

	return element
}

document.body.appendChild(component())
