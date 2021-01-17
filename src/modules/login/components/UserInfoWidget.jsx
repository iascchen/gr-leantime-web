import React, {useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import {Avatar, Card, Col, Form, Input, message, Modal, Row} from 'antd'
import {useMutation} from '@apollo/react-hooks'

import {layout} from '../../../components/constant'
import {UPDATE_USER} from '../graphql'

const UserInfoWidget = ({ user }) => {
    const [sVisible, setVisible] = useState(false)
    const [formData] = Form.useForm()
    const [sData, setData] = useState()

    const [updateUser] = useMutation(UPDATE_USER)

    useEffect(() => {
        if (!user) {
            return
        }

        let _data = {}
        if (user.profile) {
            _data = { ...user.profile }
        }
        _data.email = user.email

        setData(_data)
    }, [user])

    const handleChangeInfo = () => {
        setVisible(true)
    }

    const handleSave = async () => {
        setVisible(false)
        const values = formData.getFieldsValue()
        const email = values.email
        const profile = { ...values }
        delete profile.email

        try {
            const _user = { email, profile }
            const variables = { id: user._id, user: _user }

            // console.log('handleSave', variables)
            const response = await updateUser({ variables })
            const ret = response.data.updateUser
            console.log(ret)

            if (ret && ret._id) {
                message.info('更新成功！')
                setData(values)

            } else {
                message.error(`更新失败！${ret}`)
            }
        } catch (err) {
            message.error(`更新失败！${err}`)
        }
    }

    const handleCancel = () => {
        setVisible(false)
    }

    return (
        <Card title={'用户信息'}>
            <Row>
                <Col span={22}>
                    <div className='centerContainer'>
                        <Avatar shape='square' size='large' src={user && user.profile && user.profile.picture}/>
                    </div>
                    {user && <ul>
                        <li>Nick Name {sData?.name}</li>

                        <li>Mobile {user.mobile}</li>
                        <li>Email {sData?.email}</li>

                        <li>Gender {sData?.gender}</li>
                        <li>Web Site {sData?.website}</li>
                        <li>Location {sData?.location}</li>
                    </ul>}
                </Col>
                <Col span={2}>
                    {/*<Button shape='circle' icon={<EditOutlined/>} onClick={handleChangeInfo}/>*/}
                </Col>
            </Row>
            <Modal title='User Profile' visible={sVisible} onOk={handleSave} onCancel={handleCancel}>
                <div className='centerContainer'>
                    <Avatar shape='square' size='large' src={user && user.profile && user.profile.picture}/>
                </div>

                <Form {...layout} form={formData} initialValues={sData}>
                    <Form.Item name='picture' label='Picture'>
                        <Input/>
                    </Form.Item>
                    <Form.Item name='name' label='Name'>
                        <Input/>
                    </Form.Item>
                    <Form.Item name='email' label='Email'>
                        <Input/>
                    </Form.Item>
                    <Form.Item name='gender' label='Gender'>
                        <Input/>
                    </Form.Item>
                    <Form.Item name='website' label='Web Site'>
                        <Input/>
                    </Form.Item>
                    <Form.Item name='location' label='Location'>
                        <Input/>
                    </Form.Item>
                </Form>
            </Modal>
        </Card>
    )
}

UserInfoWidget.propTypes = {
    user: PropTypes.any
}

export default UserInfoWidget
