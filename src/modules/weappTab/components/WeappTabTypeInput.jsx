import React, {useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import {Select} from 'antd'

const { Option } = Select

export const TAB_TYPES = [{ label: '视频', value: 'video' }, { label: '图片', value: 'image' }]

const WeappTabTypeInput = ({ onChange, value, disabled }) => {
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
        {TAB_TYPES.map((v) => {
            return <Option key={v.value} value={v.value}>{v.label}</Option>
        })}
    </Select>)
}

WeappTabTypeInput.propTypes = {
    onChange: PropTypes.func,
    value: PropTypes.string,
    disabled: PropTypes.bool,
}

export default WeappTabTypeInput
