import React, {useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import {Select} from 'antd'

const { Option } = Select

export const VISIBLE_STATUS = [{ label: '公开可见', value: 1 }, { label: '不可评论', value: 2 }, { label: '不可见', value: 3 }]

const StatusInput = ({ onChange, value, disabled }) => {
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
        {VISIBLE_STATUS.map((v) => {
            return <Option key={v.value} value={v.value}>{v.label}</Option>
        })}
    </Select>)
}

StatusInput.propTypes = {
    onChange: PropTypes.func,
    value: PropTypes.number,
    disabled: PropTypes.bool,
}

export default StatusInput
