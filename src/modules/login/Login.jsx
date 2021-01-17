import React from 'react'

import LoginContainer from './LoginContainer'
import {useUser} from '../../modules/login/hook/UserProvider'
import LoginWidget from '../../modules/login/components/LoginWidget'
import UserInfoWidget from '../../modules/login/components/UserInfoWidget'

const Home = () => {
    const { user, accessToken } = useUser()

    return (
        <LoginContainer>
            {accessToken
                ? <UserInfoWidget user={user}/>
                : <LoginWidget/>}
        </LoginContainer>
    )
}

export default Home
