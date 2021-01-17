import gql from 'graphql-tag'

export const FETCH_MYBLOGGER = gql`
    query fetchMyBloggers($adminId: String!) {
        myBlogger(adminId: $adminId) {
            id, adminId, bloggerIds, keyword, bloggers{
                id, name, sex, province, city, image, tags
            }
        }
    }`

export const CREATE_OR_UPADTE_MYBLOGGER = gql`
    mutation update($adminId: String!, $bloggerIds: String, $keyword: String,){
        updateMyBlogger(adminId: $adminId, bloggerIds: $bloggerIds, keyword: $keyword) {
            id
        }
    }`
