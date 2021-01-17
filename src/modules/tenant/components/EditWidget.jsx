import React, {useEffect, useState} from 'react'
import {useHistory, useParams} from 'react-router-dom'
import {Button, Card, Col, Divider, Form, Input, Row} from 'antd'
import {SaveOutlined} from '@ant-design/icons'
import {useMutation, useQuery} from '@apollo/react-hooks'

import {layout, loggerError, tailLayout} from '../../../components/constant'
import OssImageUpload from '../../../components/OssImageUpload'
import ProvinceCityInput from '../../../components/ProvinceCityInput'
import GenderInput from '../../../components/GenderInput'
import {CREATE_TENANT, FETCH_TENANT, UPDATE_TENANT} from '../graphql'
import IsBannedInput from '../../blogger/components/IsBannedInput'

const EditWidget = () => {
    const [sRecord, setRecord] = useState({ status: 1 })

    const [formData] = Form.useForm()

    const history = useHistory()
    const { id } = useParams()

    const { error, data } = useQuery(FETCH_TENANT, {
        variables: { id },
        skip: !id
    })
    const [createBlogger] = useMutation(CREATE_TENANT)
    const [updateBlogger] = useMutation(UPDATE_TENANT)

    useEffect(() => {
        if (!data || !data.bloggers || !data.bloggers.entities || !data.bloggers.entities[0]) {
            return
        }
        console.log('init data', data)
        const _record = data.bloggers.entities[0]
        const _blogger = { ..._record }
        _blogger.location = { province: _record.province, city: _record.city }
        // const record = data.bloggers[0]
        setRecord(_blogger)
    }, [data])

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
        const _blogger = { ...values, ...values.location }
        delete _blogger.location
        console.log(_blogger)

        const toBloggers = (result) => {
            // console.log(result)
            history.push('/bloggers', { refresh: true })
        }

        if (id) {
            delete _blogger.id
            delete _blogger._id
            updateBlogger({ variables: { id: id, blogger: _blogger }, }).then(
                toBloggers,
                loggerError)
        } else {
            delete _blogger.is_banned
            createBlogger({ variables: { blogger: _blogger } }).then(
                toBloggers,
                loggerError)
        }
    }

    const handleCancel = (values) => {
        // console.log('handleCancel')
        history.push('/bloggers')
    }

    // const _formdata = formData && formData.getFieldsValue()
    return (
        <Card title='组织详情'>
            {/*{JSON.stringify(sRecord)}*/}
            <Form {...layout} form={formData} onFinish={handleSave}
                initialValues={sRecord}>
                <Row>
                    <Col span={11}>
                        <Divider>基本信息</Divider>
                        <Form.Item name='name' label='Name' required>
                            <Input/>
                        </Form.Item>
                        <Form.Item name='tags' label='Tags'>
                            <Input placeholder={'多个 tag 使用英文逗号 , 分割'}/>
                        </Form.Item>
                        <Form.Item name='sex' label='Gender'>
                            <GenderInput/>
                        </Form.Item>
                        <Form.Item name='location' label='Location'>
                            <ProvinceCityInput/>
                        </Form.Item>

                        <Form.Item name='is_banned' label='isBanned'>
                            <IsBannedInput disabled={!id}/>
                        </Form.Item>
                    </Col>
                    <Col span={1}>
                    </Col>
                    <Col span={11}>
                        <Divider>头像</Divider>
                        <Form.Item name='image' label='Image(OSS)' required>
                            <OssImageUpload/>
                        </Form.Item>
                        <Form.Item name='qrCode' label='QRCode(OSS)'>
                            <OssImageUpload/>
                        </Form.Item>
                        <Form.Item {...tailLayout} >
                            {!id &&
                            <Button style={{ width: '30%', margin: '0 10%' }} onClick={handleCancel}><SaveOutlined/> 取消
                            </Button>
                            }
                            <Button type='primary' htmlType='submit'
                                style={{ width: '30%', margin: '0 10%' }}><SaveOutlined/> 保存 </Button>
                        </Form.Item>
                        {/*<div>{JSON.stringify(_formdata)}</div>*/}
                        <div>{JSON.stringify(error)}</div>
                    </Col>
                </Row>
            </Form>
        </Card>
    )
}

export default EditWidget
