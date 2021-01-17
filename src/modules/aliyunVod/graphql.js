import gql from 'graphql-tag'

export const FETCH_VOD_VIDEO_IDS = gql`
    query vodVideoIds($pageNo: Int!, $scrollToken: String) {
        vodVideoIds(pageNo: $pageNo, scrollToken: $scrollToken) {
            total, list, scrollToken
        }
    }`

export const FETCH_ZDN_VIDEO_IDS = gql`
    query zdnVideoIds($offset: Int!, $limit: Int!) {
        videoIds(offset: $offset, limit: $limit) {
            total, list
        }
    }`

export const DELETE_VOD_VIDEOS = gql`
    query vodDeleteVideos($VideoIds: String!){
        vodDeleteVideos(VideoIds: $VideoIds) {
            RequestId, NonExistVideoIds, ForbiddenVideoIds
        }
    }`

