import React, {useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import {Radio} from 'antd'

const GENDER = [{ value: 0, name: '女' }, { value: 1, name: '男' }]

const GenderInput = ({ onChange, value }) => {
    const [sValue, setValue] = useState(0)

    useEffect(() => {
        if (!value || value === sValue) {
            return
        }
        setValue(value)
    }, [value])

    useEffect(() => {
        onChange && onChange(sValue)
    }, [sValue])

    const handleChange = (e) => {
        const v = e.target.value
        setValue(v)
    }

    return (<Radio.Group onChange={handleChange} value={sValue}>
        {GENDER.map(v => <Radio key={v.value} value={v.value}>{v.name}</Radio>)}
    </Radio.Group>)
}

GenderInput.propTypes = {
    onChange: PropTypes.func,
    value: PropTypes.number,
}

export default GenderInput
