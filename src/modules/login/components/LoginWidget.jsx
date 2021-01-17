import React, {useState} from 'react'
import {useCookies} from 'react-cookie'
import {useHistory} from 'react-router-dom'
import {Card} from 'antd'

import {ZDN_COOKIE_USER} from '../utils/manage-tokens'
import MobileLoginWidget from './MobileLoginWidget'

const LoginWidget = () => {
    const [sRememberMe, setRememberMe] = useState(false)
    const [cookies, setCookie, removeCookie] = useCookies([ZDN_COOKIE_USER])

    const history = useHistory()

    const handleRememberMe = (e) => {
        const value = e.target.checked
        setRememberMe(value)
        !value && removeCookie(ZDN_COOKIE_USER)
    }

    const handleSignUp = () => {
        history.push('/signup')
    }

    const handleResetPW = () => {
        history.push('/resetpw')
    }

    return (
        <Card title='登录'>
            <MobileLoginWidget onSignUp={handleSignUp} onForgot={handleResetPW} onRememberMe={handleRememberMe}
                rememberMe={sRememberMe} userInCookies={cookies[ZDN_COOKIE_USER]}/>
        </Card>
    )
}

export default LoginWidget
