import React, {useEffect, useState} from 'react'
import {useHistory} from 'react-router-dom'
import {Button, Card, Col, Form, Input, message, Row} from 'antd'
import {SaveOutlined} from '@ant-design/icons'
import {useMutation, useQuery} from '@apollo/react-hooks'

import {layout, loggerError, tailLayout} from '../../../components/constant'
import BloggerSelect from '../../blogger/components/BloggerSelect'
import {useUser} from '../../login/hook/UserProvider'

import {CREATE_OR_UPADTE_MYBLOGGER, FETCH_MYBLOGGER} from '../graphql'

const EditWidget = () => {
    const { user } = useUser()
    const [sAdminId, setAdminId] = useState()
    const [sKeyword, setKeyword] = useState()
    const [sRecord, setRecord] = useState()

    const [formData] = Form.useForm()
    const history = useHistory()

    const { error, data, refetch } = useQuery(FETCH_MYBLOGGER, {
        variables: { adminId: sAdminId },
        skip: !sAdminId,
        refresh: true
    })
    const [updateMyBlogger] = useMutation(CREATE_OR_UPADTE_MYBLOGGER)

    useEffect(() => {
        if (!user) {
            return
        }
        setAdminId(user._id)
    }, [user])

    useEffect(() => {
        if (!sAdminId) {
            return
        }
        setRecord({ adminId: sAdminId })
    }, [sAdminId])

    useEffect(() => {
        if (!data || !data.myBlogger) {
            return
        }
        console.log('init data', data)
        const _record = data.myBlogger
        if (_record) {
            setRecord(_record)
        }
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
        setKeyword(sRecord.keyword)
    }, [sRecord])

    const handleSave = (values) => {
        console.log('handleSave', values)
        const bloggerIds = values.bloggers.map(v => v.id).join(',')
        const keyword = values.keyword

        updateMyBlogger({ variables: { adminId: sAdminId, bloggerIds, keyword }, }).then(
            (result) => {
                console.log(result.id)
                message.info('更新成功！')
                refetch()
            },
            loggerError
        )
    }

    const handleKeywordChange = (value) => {
        console.log('handleKeywordChange', value)
        formData.setFieldsValue({ keyword: value })
    }

    return (
        <Row>
            <Col span={16}>
                <Card title='我管理的博主'>
                    {/*{JSON.stringify(sRecord)}*/}
                    <Form {...layout} form={formData} onFinish={handleSave}
                        initialValues={sRecord}>
                        <Form.Item name='adminId' label='AdminID' required>
                            <Input disabled/>
                        </Form.Item>
                        <Form.Item name='keyword' label='Keyword'>
                            <Input disabled/>
                        </Form.Item>
                        <Form.Item name='bloggers' label='Bloggers'>
                            <BloggerSelect multi keyword={sKeyword} onKeywordChange={handleKeywordChange}/>
                        </Form.Item>

                        <Form.Item {...tailLayout} >
                            <Button type='primary' htmlType='submit'
                                style={{ width: '40%', margin: '0 30%' }}><SaveOutlined/> 保存 </Button>
                        </Form.Item>
                        {/*<div>{JSON.stringify(_formdata)}</div>*/}
                        <div>{JSON.stringify(error)}</div>
                    </Form>
                </Card>
            </Col>
        </Row>
    )
}

export default EditWidget
