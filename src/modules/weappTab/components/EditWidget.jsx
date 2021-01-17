import React, {useEffect, useState} from 'react'
import {useHistory, useLocation, useParams} from 'react-router-dom'
import {Button, Card, Col, Form, Input, InputNumber, Row} from 'antd'
import {SaveOutlined} from '@ant-design/icons'
import {useMutation, useQuery} from '@apollo/react-hooks'

import {layout, loggerError, tailLayout} from '../../../components/constant'
import IsBannedInput from '../../blogger/components/IsBannedInput'
import {CREATE_WEAPPTAB, FETCH_WEAPPTAB, UPDATE_WEAPPTAB} from '../graphql'
import WeappTabTypeInput from './WeappTabTypeInput'

const EditWidget = () => {
    const [sIsNew, setIsNew] = useState(true)
    const [sRecord, setRecord] = useState({ type: 'video', is_show: 1 })

    const [formData] = Form.useForm()

    const history = useHistory()
    const { id } = useParams()
    const location = useLocation()

    const { error, data } = useQuery(FETCH_WEAPPTAB, {
        variables: { id },
        skip: !id
    })
    const [createWeappTab] = useMutation(CREATE_WEAPPTAB)
    const [updateWeappTab] = useMutation(UPDATE_WEAPPTAB)

    // useEffect(() => {
    //     if (!data || !data.weappTab) {
    //         return
    //     }
    //     console.log('init data', data)
    //     const _record = data.weappTab
    //     const _weappTab = { ..._record }
    //     setRecord(_weappTab)
    // }, [data])

    useEffect(() => {
        if (!data || !data.weappTab || !location) {
            return
        }
        console.log('init data & Location', data, location)
        const _record = data.weappTab

        if (location.pathname.endsWith('/new')) {
            setIsNew(true)
            const parentid = _record.parentid ? `${_record.parentid}` : `${_record.id}`
            const newLabel = { type: 'video', is_show: 1, parentid }
            console.log(newLabel)
            setRecord(newLabel)
        } else {
            setIsNew(false)
            setRecord(_record)
        }
    }, [data, location])

    useEffect(() => {
        if (!error) {
            return
        }
        history.push('/login')
    }, [error])

    useEffect(() => {
        if (!sRecord) {
            return
        }
        formData.setFieldsValue(sRecord)
    }, [sRecord])

    const handleSave = (values) => {
        // console.log('handleSave', values)
        const _weappTab = { ...values }
        console.log(_weappTab)

        const toWeappTabs = (result) => {
            // console.log(result)
            history.push('/weapptabs', { refresh: true })
        }

        if (sIsNew) {
            createWeappTab({ variables: { weappTab: _weappTab } }).then(
                toWeappTabs,
                loggerError)
        } else {
            delete _weappTab.id
            delete _weappTab._id
            delete _weappTab.parentid
            updateWeappTab({ variables: { id: id, weappTab: _weappTab }, }).then(
                toWeappTabs,
                loggerError)
        }
    }

    const handleCancel = (values) => {
        // console.log('handleCancel')
        history.push('/weappTabs')
    }

    // const _formdata = formData && formData.getFieldsValue()
    return (
        <Card title='小程序菜单标签'>
            {/*{JSON.stringify(sRecord)}*/}
            <Form {...layout} form={formData} onFinish={handleSave}
                initialValues={sRecord}>
                <Row>
                    <Col span={12}>
                        <Form.Item name='parentid' label='ParentID'>
                            <Input disabled/>
                        </Form.Item>

                        <Form.Item name='type' label='Type'>
                            <WeappTabTypeInput/>
                        </Form.Item>

                        <Form.Item name='label_name' label='Name' required>
                            <Input/>
                        </Form.Item>
                        <Form.Item name='label_order' label='Order' required>
                            <InputNumber/>
                        </Form.Item>
                        <Form.Item name='english' label='English'>
                            <Input/>
                        </Form.Item>

                        <Form.Item name='is_show' label='isShow'>
                            <IsBannedInput/>
                        </Form.Item>

                        <Form.Item {...tailLayout} >
                            {sIsNew &&
                            <Button style={{ width: '30%', margin: '0 10%' }} onClick={handleCancel}><SaveOutlined/> 取消
                            </Button>
                            }
                            <Button type='primary' htmlType='submit'
                                style={{ width: '30%', margin: '0 10%' }}><SaveOutlined/> 保存 </Button>
                        </Form.Item>
                        {/*<div>{sIsNew ? 'New' : 'Update'}</div>*/}
                        {/*<div>{JSON.stringify(sRecord)}</div>*/}
                        <div>{JSON.stringify(error)}</div>
                    </Col>
                </Row>
            </Form>
        </Card>
    )
}

export default EditWidget
