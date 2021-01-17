import gql from 'graphql-tag'

export const FETCH_SYSPARAMS = gql`
    query fetchSysParams($keys: String!) {
        sysParams(keys: $keys) {
            key, value
        }
    }`

export const UPDATE_SYSPARAM = gql`
    mutation update($params: [SysParamInput!]!){
        updateSysParams(params: $params) {
            key
        }
    }`
