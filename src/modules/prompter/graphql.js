import gql from 'graphql-tag'

export const FETCH_PROMPTER = gql`
    query fetchPrompter($id: String) {
        prompters(id: $id) {
            entities{
                name, image, tags
            }
        }
    }`

export const FETCH_PROMPTERS = gql`
    query fetchPrompters($offset: Int!, $limit: Int!, $keywords: String) {
        prompters(offset: $offset, limit: $limit, keywords: $keywords) {
            total, entities{
                id, name, image, tags
            }
        }
    }`

export const FETCH_SIMPLE_PROMPTERS = gql`
    query fetchPrompters($offset: Int!, $limit: Int!, $keywords: String, $isMine: Int) {
        prompters(offset: $offset, limit: $limit, keywords: $keywords, isMine: $isMine ) {
            total, entities{
                id, name, image, tags
            }
        }
    }`

export const CREATE_PROMPTER = gql`
    mutation create($prompter: CreatePrompterInput!){
        createPrompter(prompter: $prompter) {
            id
        }
    }`

export const UPDATE_PROMPTER = gql`
    mutation update($id: String!, $prompter: UpdatePrompterInput!){
        updatePrompter(id: $id, prompter: $prompter) {
            id
        }
    }`

export const DEL_PROMPTER = gql`
    mutation del($id: String!){
        deletePrompter(id: $id) {
            id
        }
    }`
