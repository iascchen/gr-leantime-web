import React, {useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import {useCookies} from 'react-cookie'
import {useHistory} from 'react-router-dom'
import {Button, Checkbox, Col, Form, Input, message, Row, Spin} from 'antd'
import {UserOutlined} from '@ant-design/icons'
import {useMutation} from '@apollo/react-hooks'

import {layout, tailLayout} from '../../../components/constant'
import {ZDN_COOKIE_USER} from '../utils/manage-tokens'
import {useUser} from '../hook/UserProvider'
import {LOGIN_MOBILE} from '../graphql'

const MobileLoginWidget = ({ onRememberMe, rememberMe, userInCookies }) => {
    const [sData, setDate] = useState()
    const [formData] = Form.useForm()

    const { setAccessToken } = useUser()
    const [cookies, setCookie, removeCookie] = useCookies([ZDN_COOKIE_USER])

    const [sLoading, setLoading] = useState(false)

    const history = useHistory()

    const [loginByMobile] = useMutation(LOGIN_MOBILE)

    useEffect(() => {
        if (!userInCookies || !formData) {
            return
        }
        formData.setFieldsValue(userInCookies)
    }, [userInCookies, formData])

    const handleLogin = async (values) => {
        console.log('handleLogin', values)
        setDate(values)
        try {
            const response = await loginByMobile({ variables: values })
            const ret = response.data.loginByMobile
            console.log(ret)

            if (ret && ret.token) {
                setLoading(false)
                const _user = ret.user
                rememberMe ? setCookie(ZDN_COOKIE_USER, _user) : removeCookie(ZDN_COOKIE_USER)
                setAccessToken(ret)
                message.info('登录成功！')
                history.push('/')
                return
            } else {
                setAccessToken()
                removeCookie(ZDN_COOKIE_USER)
            }
        } catch (err) {
            console.log(err)
        }
        setLoading(false)
        message.error('登录失败！')
    }

    return (
        <Form {...layout} form={formData} onFinish={handleLogin}>
            <Form.Item name='mobile' label='Mobile' required>
                <Input/>
            </Form.Item>
            <Form.Item name='password' label='Password' required>
                <Input.Password/>
            </Form.Item>
            {sLoading
                ? <Spin/>
                : <>
                    <Form.Item {...tailLayout} >
                        <Row>
                            <Col span={12}>
                                <Checkbox onChange={onRememberMe} checked={rememberMe}/> Remember Me
                                {sLoading && <Spin/>}
                            </Col>
                            <Col span={12}>
                                {/*<Button style={{ width: '60%', margin: '0 20%' }} onClick={onForgot}><KeyOutlined/> 重置密码*/}
                                {/*</Button>*/}
                            </Col>
                        </Row>
                    </Form.Item>
                    <Form.Item {...tailLayout} >
                        {/*<Button style={{ width: '30%', margin: '0 10%' }} onClick={onSignUp}><UserAddOutlined/> 注册*/}
                        {/*</Button>*/}
                        <Button type='primary' htmlType='submit'
                            style={{ width: '40%', margin: '0 30%' }}><UserOutlined/> 登录 </Button>
                    </Form.Item>
                </>
            }
        </Form>
    )
}

MobileLoginWidget.propTypes = {
    onRememberMe: PropTypes.func,
    rememberMe: PropTypes.bool,
    userInCookies: PropTypes.any
}

export default MobileLoginWidget
