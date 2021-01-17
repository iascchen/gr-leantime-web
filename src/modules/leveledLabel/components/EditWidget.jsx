import React, {useEffect, useState} from 'react'
import {useHistory, useLocation, useParams} from 'react-router-dom'
import {Button, Card, Col, Form, Input, InputNumber, message, Row} from 'antd'
import {SaveOutlined} from '@ant-design/icons'
import {useMutation, useQuery} from '@apollo/react-hooks'

import {layout, tailLayout} from '../../../components/constant'
import {CREATE_LABEL, FETCH_LABEL, UPDATE_LABEL} from '../graphql'
import TargetInput from './TargetInput'

const EditWidget = () => {
    const [sIsNew, setIsNew] = useState(true)
    const [sRecord, setRecord] = useState({ target: 1, level: 0, path: ',.' })

    const [formData] = Form.useForm()

    const history = useHistory()
    const { id } = useParams()
    const location = useLocation()

    const { error, data } = useQuery(FETCH_LABEL, {
        variables: { id },
        skip: !id
    })
    const [createLabel] = useMutation(CREATE_LABEL)
    const [updateLabel] = useMutation(UPDATE_LABEL)

    useEffect(() => {
        if (!data || !data.label || !location) {
            return
        }
        console.log('init data & Location', data, location)
        const _record = data.label

        if (location.pathname.endsWith('/new')) {
            setIsNew(true)
            const parentIds = _record.parentIds ? `${_record.parentIds},${_record.id}` : `,${_record.id}`
            const path = _record.path ? `${_record.path},.` : ',.'
            const newLabel = { level: _record.level + 1, target: _record.target, parentIds, path }
            // console.log(newLabel)
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
        const _label = { ...values }

        const toLabels = (result) => {
            // console.log(result)
            history.push('/labels', { refresh: true })
        }

        const logError = (err) => {
            console.error(err)
            message.error('标签已存在，不可重名')
        }

        const pathArray = sRecord.path.split(',')
        if (pathArray.length > 1) {
            pathArray[pathArray.length - 1] = _label.name
        }
        if (sIsNew) {
            _label.path = pathArray.join(',')
            console.log(sRecord, _label)
            createLabel({ variables: { label: _label } }).then(
                toLabels,
                logError)
        } else {
            updateLabel({ variables: { id: id, label: { name: _label.name, path: pathArray.join(',') } }, }).then(
                toLabels,
                logError)
        }
    }

    const handleCancel = (values) => {
        // console.log('handleCancel')
        history.push('/labels')
    }

    // const _formdata = formData && formData.getFieldsValue()
    return (
        <Card title='分级标签'>
            {/*{JSON.stringify(location)}*/}
            <Form {...layout} form={formData} onFinish={handleSave}
                initialValues={sRecord}>
                <Row>
                    <Col span={11}>
                        <Form.Item name='name' label='Name' required>
                            <Input/>
                        </Form.Item>
                        <Form.Item name='target' label='Target'>
                            <TargetInput disabled={!sIsNew}/>
                        </Form.Item>
                        <Form.Item name='level' label='Level'>
                            <InputNumber disabled/>
                        </Form.Item>
                        <Form.Item name='parentIds' label='Parent Ids'>
                            <Input disabled/>
                        </Form.Item>
                        <Form.Item name='path' label='Path，仅用于列表页排序'>
                            <Input disabled/>
                        </Form.Item>
                        <Form.Item {...tailLayout} >
                            {sIsNew &&
                            <Button style={{ width: '30%', margin: '0 10%' }} onClick={handleCancel}><SaveOutlined/> 取消
                            </Button>
                            }
                            <Button type='primary' htmlType='submit'
                                style={{ width: '30%', margin: '0 10%' }}><SaveOutlined/> 保存 </Button>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
            {JSON.stringify(error)}
        </Card>
    )
}

export default EditWidget
