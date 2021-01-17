import React, {useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import {Avatar, Input, Modal} from 'antd'
import {EditOutlined} from '@ant-design/icons'

import SimpleIndexPrompterWidget from '../../prompter/components/SimpleIndexPrompterWidget'
import {DEFAULT_RESULT_SIZE} from './SimpleIndexPrompterWidget'

const { Group } = Input

const PrompterSelect = ({ onChange, onKeywordChange, value, multi, mine, keyword }) => {
    const [sVisible, setVisible] = useState(false)
    const [sValues, setValues] = useState([])

    useEffect(() => {
        if (!value || value === sValues) {
            return
        }
        setValues(value)
    }, [value])

    const handleChangeInfo = () => {
        setVisible(true)
    }

    const handleSelect = (values) => {
        console.log('handleSelect', values)
        setValues(values)
        onChange && onChange(values)

        if (!multi) {
            setVisible(false)
        }
    }

    const handleChangeKeyword = (values) => {
        console.log('handleChangeKeyword', values)
        onKeywordChange && onKeywordChange(values)
    }

    const handleCancel = () => {
        setVisible(false)
    }

    return (
        <>
            {/*{JSON.stringify(sValues)}*/}
            {sValues.map((v, index) =>
                <span key={index}> [ <Avatar size='large' src={v.image} alt={v.name}/> {v.name} ] </span>)}
            <Group compact>
                <Input addonBefore='Prompter ID' value={sValues.map(v => v.id).join(',')} placeholder='分发账号ID' disabled
                    addonAfter={<span onClick={handleChangeInfo}> <EditOutlined/> </span>}
                />
            </Group>
            <Modal title={<>选择分发账号(<span style={{ color: 'red' }}>只能列表符合过滤条件的前 {DEFAULT_RESULT_SIZE} 名</span>)</>}
                onCancel={handleCancel} onOk={handleCancel} visible={sVisible}>
                <SimpleIndexPrompterWidget onChange={handleSelect} onKeywordChange={handleChangeKeyword} multi={multi}
                    mine={mine}
                    selectedRowKeys={sValues.map(v => v.id)} keyword={keyword}/>
            </Modal>
        </>
    )
}

PrompterSelect.propTypes = {
    onChange: PropTypes.func,
    onKeywordChange: PropTypes.func,
    value: PropTypes.array,
    multi: PropTypes.bool,
    mine: PropTypes.bool,
    keyword: PropTypes.string,
}

export default PrompterSelect
