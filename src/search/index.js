'user strict'

import React from 'react'
import ReactDom from 'react-dom'
import largeNumber from 'large-number'
import { common } from '../../common'
import logo from '../images/logo.png'
import { a } from './tree-shaking'
import './search.less'
console.log(common())

class Search extends React.Component {
    constructor () {
        super(...arguments)

        this.state = {
            Text: null
        }
    }

    loadComponent () {
        import('./text.js').then((Text) => {
            this.setState({
                Text: Text.default
            })
        })
    }

    render () {
        const funcA = a()
        const addResult = largeNumber('999', '1')
        const { Text } = this.state
        return <div className="search-text">
            {
                Text ? <Text /> : null
            }
            { addResult }
            搜索文字的内容{funcA}
            <img src={logo} onClick={this.loadComponent.bind(this)}/>
        </div>
    }
}

ReactDom.render(
    <Search/>,
    document.getElementById('root')
)
