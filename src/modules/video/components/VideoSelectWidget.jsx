import React, {useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import {Button, Card, Col, Form, Input, message, Modal, Row} from 'antd'
import {DownOutlined, EditOutlined, UpOutlined} from '@ant-design/icons'

import SimpleIndexWidget from './SimpleIndexWidget'
import ImageSrcShowWidget from './ImageSrcShowWidget'
import TextShowWidget, {VALUE_MARK} from './TextShowWidget'
import {layout, normalLayout} from '../../../components/constant'
import {DEFAULT_RESULT_SIZE} from '../../blogger/components/SimpleIndexWidget'

const { Group } = Input

const sortVideoListByKeys = (values, keys) => {
    // return selecteds || (values && values.map(v => v.id))
    const _ret = keys.map((k, index) => {
        return values.filter((v) => v.id === k)[0]
    })
    return _ret
}

const VideoSelectWidget = ({ value, selectedKeys, multi, disabled, type, onChange }) => {
    const [sPopVisible, setPopVisible] = useState(false)
    const [sValues, setValues] = useState([])
    const [sSelectedKeys, setSelectedKeys] = useState([])

    const [formVideos] = Form.useForm()

    useEffect(() => {
        if (!value || value === sValues) {
            return
        }

        if (selectedKeys) {
            const _list = sortVideoListByKeys(value, selectedKeys)
            setSelectedKeys(selectedKeys)
            formVideos.setFieldsValue({ videos: _list })
            setValues(_list)
        } else {
            setValues(value)
            setSelectedKeys(value.map(v => v.id))
        }
    }, [selectedKeys, value])

    const handleChangeInfo = () => {
        if (disabled) {
            message.info('不能修改 VideoID')
        } else {
            setPopVisible(true)
        }
    }

    const handleSelect = (values) => {
        console.log('handleSelect', values)
        setValues(values)
        setSelectedKeys(values.map(v => v.id))
        formVideos.setFieldsValue({ videos: values })
        onChange && onChange(values)

        if (!multi) {
            setPopVisible(false)
        }
    }

    const handleCancel = () => {
        setPopVisible(false)
    }

    const handleMove = (fileds) => {
        // console.log('handleMove', fileds)
        if (fileds.length > 0 && fileds[0].name[0] === 'videos') {
            const _vaules = fileds[0].value
            // console.log('handleMove', _vaules)
            setValues(_vaules)
            setSelectedKeys(_vaules.map(v => v.id))
            onChange && onChange(_vaules)
        }
    }

    const renderFormList = () => {
        return <Card style={{ marginBottom: 16 }}>
            <Form {...layout} form={formVideos} onFieldsChange={handleMove}>
                <Form.List name='videos'>
                    {(fields, { move }) => {
                        return <Card>
                            {/*{JSON.stringify(fields)}*/}
                            <Row>
                                <Col span={2} className='centerContainer'>ID</Col>
                                <Col span={14} className='centerContainer'>Title</Col>
                                <Col span={2} className='centerContainer'>Cover</Col>
                                <Col span={4} className='centerContainer'>&nbsp;</Col>
                            </Row>
                            {fields.map((field, index) => (
                                <Row key={field.key}>
                                    <Col span={3}>
                                        <Form.Item {...field} name={[field.name, 'id']}
                                            fieldKey={[field.fieldKey, 'id']}>
                                            <TextShowWidget hrefPrefix={`/videos/${VALUE_MARK}`} target={'video_edit'}/>
                                        </Form.Item>
                                    </Col>
                                    <Col span={13}>
                                        <Form.Item {...normalLayout} {...field} name={[field.name, 'title']}
                                            fieldKey={[field.fieldKey, 'title']}>
                                            <TextShowWidget/>
                                        </Form.Item>
                                    </Col>
                                    <Col span={1}></Col>
                                    <Col span={3}>
                                        <Form.Item {...normalLayout} {...field}
                                            name={[field.name, 'cover_path']}
                                            fieldKey={[field.fieldKey, 'cover_path']}>
                                            <ImageSrcShowWidget small/>
                                        </Form.Item>
                                    </Col>
                                    <Col span={4}>
                                        &nbsp;&nbsp;<Button shape='circle' onClick={() => move(index, index - 1)}
                                            disabled={index <= 0}><UpOutlined/></Button>
                                        &nbsp;<Button shape='circle' onClick={() => move(index, index + 1)}
                                            disabled={index >= fields.length - 1}><DownOutlined/></Button>
                                    </Col>
                                </Row>))
                            }</Card>
                    }}
                </Form.List>
            </Form>
        </Card>
    }

    const renderImgList = (values, type) => {
        return values && values.map((v, index) => {
            return <div key={index}>
                <div className='centerContainer'>
                    <img src={v.cover_path} alt={v.title} height={type === 'smallImg' ? 80 : 180}/>
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
                <Input addonBefore='Video ID' value={sSelectedKeys} placeholder='视频ID' disabled
                    addonAfter={<span onClick={handleChangeInfo}> <EditOutlined/> </span>}
                />
            </Group>
            {/*{JSON.stringify(sValues)}*/}

            {type === 'formlist' && renderFormList()}
            {type === 'smallImg' && renderImgList(sValues, 'smallImg')}
            {type === 'none' && <></>}
            {(!type || type === 'largeImg') && renderImgList(sValues, 'largeImg')}

            <Modal onCancel={handleCancel} onOk={handleCancel} visible={sPopVisible}
                title={<>选择视频(<span style={{ color: 'red' }}>只能列表符合过滤条件的前 {DEFAULT_RESULT_SIZE} 个</span>)</>}>
                <SimpleIndexWidget onChange={handleSelect} multi={multi} disabled={disabled}
                    selectedRowKeys={sSelectedKeys}/>
            </Modal>
        </>
    )
}

VideoSelectWidget.propTypes = {
    onChange: PropTypes.func,
    value: PropTypes.array,
    selectedKeys: PropTypes.array,
    multi: PropTypes.bool,
    disabled: PropTypes.bool,
    type: PropTypes.string,
}

export default VideoSelectWidget
