import React, {useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import {Checkbox, Divider, Popover} from 'antd'

import {LABEL_DEPTH} from './ListWidget'
import {Link} from 'react-router-dom'

const fontSize = (level) => {
    return { fontSize: 12 + (LABEL_DEPTH - level) * 4 }
}

const renderAddSubLink = (id) => {
    return <Link to={'/labels/' + id + '/new'} target='label_edit'>
        <Popover content={<>增加子标签</>}>
            [+] &nbsp;&nbsp;
        </Popover>
    </Link>
}

const renderLeaf = (leaf, level) => {
    return <>
        <span style={fontSize(level)}> {(level < LABEL_DEPTH) && [...Array(level).keys()].map(i => <></>)}&nbsp;</span>
        <Checkbox key={leaf.id} value={leaf.value}>
            <span style={fontSize(level)}>{leaf.label}</span>
        </Checkbox>
        {(level < LABEL_DEPTH) && renderAddSubLink(leaf.id)}
    </>
}

const renderBranch = (options, level) => {
    return <div>
        {options.map((v) => <>
            {(v.children && v.children.length > 0)
                ? <>
                    <span
                        style={fontSize(level)}> &nbsp;{(level < LABEL_DEPTH) && [...Array(level).keys()].map(i => <>&gt;</>)}&nbsp; {v.label} </span>
                    {(level < LABEL_DEPTH) && renderAddSubLink(v.id)}
                    {renderBranch(v.children, level + 1)}
                </>
                : <>{renderLeaf(v, level)}</>}
        </>)}
        {(level === 1) && <Divider/>}
    </div>
}

const LabelSelectWidget = ({ options, value, onChange, name }) => {
    const [sOptions, setOptions] = useState()
    const [sValue, setValue] = useState()

    useEffect(() => {
        if (!options) {
            return
        }
        setOptions(options)
    }, [options])

    useEffect(() => {
        if (!value) {
            return
        }
        // console.log('init value', value)
        if (typeof value === 'string') {
            setValue(JSON.parse(value))
        } else {
            setValue(value)
        }
    }, [value])

    const handleChange = (value) => {
        console.log('handleChange', value)
        onChange && onChange(value)
    }

    return (
        <>
            <Checkbox.Group value={sValue} onChange={handleChange} name={name}>
                {sOptions && renderBranch(sOptions, 0)}
            </Checkbox.Group>
            {/*{JSON.stringify(sOptions)}*/}
            {/*{JSON.stringify(sValue)}*/}
        </>
    )
}

LabelSelectWidget.propTypes = {
    onChange: PropTypes.func,
    value: PropTypes.array,
    name: PropTypes.string,
    options: PropTypes.array,
}

export default LabelSelectWidget
