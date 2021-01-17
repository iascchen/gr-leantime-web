import React, {useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import {Select} from 'antd'

const { Option } = Select

export const TRAGET_VALUE = [{ label: '内容', value: 1 }, { label: '用户', value: 2 }]

const TargetInput = ({ onChange, value, disabled }) => {
    const [sValue, setValue] = useState()

    useEffect(() => {
        if (!value) {
            return
        }
        setValue(value)
    }, [value])

    useEffect(() => {
        onChange && onChange(sValue)
    }, [sValue])

    const handleChange = (value) => {
        // console.log('handleChange', value)
        setValue(value)
    }

    return (<Select disabled={disabled} onChange={handleChange} value={sValue}>
        {TRAGET_VALUE.map((v) => {
            return <Option key={v.value} value={v.value}>{v.label}</Option>
        })}
    </Select>)
}

TargetInput.propTypes = {
    onChange: PropTypes.func,
    value: PropTypes.number,
    disabled: PropTypes.bool,
}

export default TargetInput
