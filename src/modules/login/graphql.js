import gql from 'graphql-tag'

export const LOGIN_MOBILE = gql`
    mutation loginByMobile($mobile: String!, $password: String!){
        loginByMobile(mobile: $mobile, password: $password) {
            token, user {
                _id, mobile, email, profile {
                    name, picture, website, location, gender
                }
            }
        }
    }`

export const LOGOUT = gql`
    mutation logout {
        logout
    }`

export const FORGOT_PASSWORD = gql`
    mutation resetPassword($user: ResetPasswordInput!){
        resetPassword(user: $user) {
            _id
        }
    }`

export const RESET_TOKEN = gql`
    mutation passwordResetToken($mobile: String!){
        passwordResetToken(mobile: $mobile) {
            _id, passwordResetToken
        }
    }`

export const SIGN_UP = gql`
    mutation signUp($user: CreateUserInput!){
        signUp(user: $user) {
            _id
        }
    }`

export const INVITE_TOKEN = gql`
    mutation inviteToken($mobile: String!){
        inviteToken(mobile: $mobile) {
            _id, token
        }
    }`

export const UPDATE_USER = gql`
    mutation updateUser($id: String!, $user: UpdateUserInput!){
        updateUser(id: $id, user: $user) {
            _id, mobile, email, profile {
                name, gender, picture, website, location
            }
        }
    }`

export const ME = gql`
    query me{
        me{
            _id, mobile, email, profile {
                name, gender, picture, website, location
            }
        }
    }`
