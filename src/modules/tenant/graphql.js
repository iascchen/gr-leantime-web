import gql from 'graphql-tag'

export const FETCH_TENANT = gql`
    query fetchTenant($id: String) {
        tenants(id: $id) {
            entities{
                name, sex, province, city, is_banned, image, qrCode, tags
            }
        }
    }`

export const FETCH_TENANTS = gql`
    query fetchTenants($offset: Int!, $limit: Int!, $keywords: String) {
        tenants(offset: $offset, limit: $limit, keywords: $keywords) {
            total, entities{
                _id, siteName, slug, language, timeZone, mainColor, logoPath, ownerId, desc, members{
                    userId, role
                }
            }
        }
    }`

export const FETCH_SIMPLE_TENANTS = gql`
    query fetchTenants($offset: Int!, $limit: Int!, $keywords: String, $isMine: Int) {
        tenants(offset: $offset, limit: $limit, keywords: $keywords, isMine: $isMine, includeBanned: 0, ) {
            total, entities{
                id, name, sex, province, city, is_banned, image
            }
        }
    }`

export const CREATE_TENANT = gql`
    mutation create($tenant: CreateTenantInput!){
        createTenant(tenant: $tenant) {
            id
        }
    }`

export const UPDATE_TENANT = gql`
    mutation update($id: String!, $tenant: UpdateTenantInput!){
        updateTenant(id: $id, tenant: $tenant) {
            id
        }
    }`

export const DEL_TENANT = gql`
    mutation del($id: String!){
        deleteTenant(id: $id) {
            id
        }
    }`
