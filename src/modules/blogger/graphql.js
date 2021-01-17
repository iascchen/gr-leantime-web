import gql from 'graphql-tag'

export const FETCH_BLOGGER = gql`
    query fetchBlogger($id: String) {
        bloggers(id: $id) {
            entities{
                name, sex, province, city, is_banned, image, qrCode, tags
            }
        }
    }`

export const FETCH_BLOGGERS = gql`
    query fetchBloggers($offset: Int!, $limit: Int!, $keywords: String) {
        bloggers(offset: $offset, limit: $limit, keywords: $keywords, includeBanned: 1) {
            total, entities{
                id, name, sex, province, city, is_banned, image, qrCode, tags
            }
        }
    }`

export const FETCH_SIMPLE_BLOGGERS = gql`
    query fetchBloggers($offset: Int!, $limit: Int!, $keywords: String, $isMine: Int) {
        bloggers(offset: $offset, limit: $limit, keywords: $keywords, isMine: $isMine, includeBanned: 0, ) {
            total, entities{
                id, name, sex, province, city, is_banned, image
            }
        }
    }`

export const CREATE_BLOGGER = gql`
    mutation create($blogger: CreateBloggerInput!){
        createBlogger(blogger: $blogger) {
            id
        }
    }`

export const UPDATE_BLOGGER = gql`
    mutation update($id: String!, $blogger: UpdateBloggerInput!){
        updateBlogger(id: $id, blogger: $blogger) {
            id
        }
    }`

export const DEL_BLOGGER = gql`
    mutation del($id: String!){
        deleteBlogger(id: $id) {
            id
        }
    }`
