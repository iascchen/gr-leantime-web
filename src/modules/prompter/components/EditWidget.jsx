import React, {useEffect, useState} from 'react'
import {useHistory, useParams} from 'react-router-dom'
import {Button, Card, Col, Divider, Form, Input, Row} from 'antd'
import {SaveOutlined} from '@ant-design/icons'
import {useMutation, useQuery} from '@apollo/react-hooks'

import {layout, loggerError, tailLayout} from '../../../components/constant'
import OssImageUpload from '../../../components/OssImageUpload'
import {CREATE_PROMPTER, FETCH_PROMPTER, UPDATE_PROMPTER} from '../graphql'

const EditWidget = () => {
    const [sRecord, setRecord] = useState({ status: 1 })

    const [formData] = Form.useForm()

    const history = useHistory()
    const { id } = useParams()

    const { error, data } = useQuery(FETCH_PROMPTER, {
        variables: { id },
        skip: !id
    })
    const [createPrompter] = useMutation(CREATE_PROMPTER)
    const [updatePrompter] = useMutation(UPDATE_PROMPTER)

    useEffect(() => {
        if (!data || !data.prompters || !data.prompters.entities || !data.prompters.entities[0]) {
            return
        }
        console.log('init data', data)
        const _record = data.prompters.entities[0]
        const _prompter = { ..._record }
        _prompter.location = { province: _record.province, city: _record.city }
        // const record = data.prompters[0]
        setRecord(_prompter)
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
        const _prompter = { ...values, ...values.location }
        delete _prompter.location
        console.log(_prompter)

        const toPrompters = (result) => {
            // console.log(result)
            history.push('/prompters', { refresh: true })
        }

        if (id) {
            delete _prompter.id
            delete _prompter._id
            delete _prompter.name

            updatePrompter({ variables: { id: id, prompter: _prompter }, }).then(
                toPrompters,
                loggerError)
        } else {
            delete _prompter.is_banned
            createPrompter({ variables: { prompter: _prompter } }).then(
                toPrompters,
                loggerError)
        }
    }

    const handleCancel = (values) => {
        // console.log('handleCancel')
        history.push('/prompters')
    }

    // const _formdata = formData && formData.getFieldsValue()
    return (
        <Card title='分发账号详情'>
            {/*{JSON.stringify(sRecord)}*/}
            <Form {...layout} form={formData} onFinish={handleSave}
                initialValues={sRecord}>
                <Row>
                    <Col span={12}>
                        <Divider>基本信息</Divider>
                        <Form.Item name='name' label='微信名' required>
                            <Input disabled={!!id} placeholder={'此内容一旦创建不可修改'}/>
                        </Form.Item>
                        <Form.Item name='tags' label='Tags'>
                            <Input placeholder={'多个 tag 使用英文逗号 , 分割'}/>
                        </Form.Item>
                        <Form.Item name='image' label='Image(OSS)' required>
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
