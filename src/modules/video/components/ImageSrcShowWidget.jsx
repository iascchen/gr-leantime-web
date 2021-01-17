import React from 'react'
import PropTypes from 'prop-types'

const ImageSrcShowWidget = ({ value, small }) => {
    return (<img src={value} alt={value} height={small ? 40 : 80}/>)
}

ImageSrcShowWidget.propTypes = {
    value: PropTypes.string,
    small: PropTypes.bool,
}

export default ImageSrcShowWidget
