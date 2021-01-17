import React, {useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import {Form, Input, message, Modal} from 'antd'
import {EditOutlined} from '@ant-design/icons'

import SimpleIndexWidget from './SimpleIndexWidget'
import {DEFAULT_RESULT_SIZE} from '../../blogger/components/SimpleIndexWidget'

const { Group } = Input

const PlaylistSelectWidget = ({ value, multi, disabled, type, onChange }) => {
    const [sPopVisible, setPopVisible] = useState(false)
    const [sValues, setValues] = useState([])

    const [formPlaylists] = Form.useForm()

    useEffect(() => {
        if (!value || value === sValues) {
            return
        }
        setValues(value)
    }, [value])

    const handleChangeInfo = () => {
        if (disabled) {
            message.info('不能修改 PlaylistID')
        } else {
            setPopVisible(true)
        }
    }

    const handleSelect = (values) => {
        console.log('handleSelect', values)
        setValues(values)
        formPlaylists.setFieldsValue({ playlists: values })
        onChange && onChange(values)

        if (!multi) {
            setPopVisible(false)
        }
    }

    const handleCancel = () => {
        setPopVisible(false)
    }

    const renderImgList = (values, type) => {
        return values && values.map((v, index) => {
            return <div key={index}>
                <div className='centerContainer'>
                    <img src={v.cover} alt={v.title} height={type === 'smallImg' ? 80 : 180}/>
                </div>
                <div className='centerContainer'>
                    {v.title}
                </div>
            </div>
        })
    }

    return (
        <>
            {/*{JSON.stringify(sValues)}*/}
            <Group compact>
                <Input addonBefore='Playlist ID' value={sValues.map(v => v.id)} placeholder='视频专辑ID' disabled
                    addonAfter={<span onClick={handleChangeInfo}> <EditOutlined/> </span>}
                />
            </Group>
            {/*{JSON.stringify(sValues)}*/}

            {type === 'smallImg' && renderImgList(sValues, 'smallImg')}
            {type === 'none' && <></>}
            {(!type || type === 'largeImg') && renderImgList(sValues, 'largeImg')}

            <Modal onCancel={handleCancel} onOk={handleCancel} visible={sPopVisible}
                title={<>选择视频专辑(<span style={{ color: 'red' }}>只能列表符合过滤条件的前 {DEFAULT_RESULT_SIZE} 个</span>)</>}>
                <SimpleIndexWidget onChange={handleSelect} multi={multi} disabled={disabled}
                    selectedRowKeys={sValues.map(v => v.id)}/>
            </Modal>
        </>
    )
}

PlaylistSelectWidget.propTypes = {
    value: PropTypes.array,
    multi: PropTypes.bool,
    disabled: PropTypes.bool,
    type: PropTypes.string,

    onChange: PropTypes.func,
}

export default PlaylistSelectWidget
