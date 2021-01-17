import React, {useEffect, useState} from 'react'
import {Checkbox} from 'antd'
import PropTypes from 'prop-types'

const IsBannedInput = ({ onChange, value, disabled }) => {
    const [sValue, setValue] = useState(false)

    useEffect(() => {
        const v = (1 === value)
        if (v === sValue) {
            return
        }
        setValue(v)
    }, [value])

    useEffect(() => {
        onChange && onChange(sValue ? 1 : 0)
    }, [sValue])

    const handleChange = (e) => {
        const v = e.target.checked
        console.log('handleChange', v)
        setValue(v)
    }

    return (<Checkbox checked={sValue} onChange={handleChange} disabled={disabled}/>)
}

IsBannedInput.propTypes = {
    onChange: PropTypes.func,
    value: PropTypes.number,
    disabled: PropTypes.bool,
}

export default IsBannedInput
