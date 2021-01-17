import gql from 'graphql-tag'

export const FETCH_MYPROMPTER = gql`
    query fetchMyPrompters($adminId: String!) {
        myPrompter(adminId: $adminId) {
            id, adminId, prompterIds, keyword, prompters{
                id, name, image, tags
            }
        }
    }`

export const CREATE_OR_UPADTE_MYPROMPTER = gql`
    mutation update($adminId: String!, $prompterIds: String, $keyword: String,){
        updateMyPrompter(adminId: $adminId, prompterIds: $prompterIds, keyword: $keyword) {
            id
        }
    }`
