import React from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'
import {Button} from 'antd'
import {EditTwoTone} from '@ant-design/icons'

export const VALUE_MARK = ':value'

const TextShowWidget = ({ value, hrefPrefix, target }) => {
    const link = hrefPrefix ? hrefPrefix.replace(VALUE_MARK, value) : null
    return link ? <div><Link to={link} target={target}>
        <Button shape='circle'><EditTwoTone/></Button> {value} </Link></div>
        : <span> {value} </span>
}

TextShowWidget.propTypes = {
    value: PropTypes.string,
    hrefPrefix: PropTypes.string,
    target: PropTypes.string,
}

export default TextShowWidget
