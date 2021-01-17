import gql from 'graphql-tag'

export const FETCH_VIDEO_RECOMMENDS = gql`
    query videoRecommendAdjusts($offset: Int!, $limit: Int!, $keywords: String) {
        videoRecommendAdjusts(offset: $offset, limit: $limit, keywords: $keywords) {
            total, entities {
                id, videoId, playCount, shareCount, likeCount, attenuation, weight, video {
                    title, cover_path, blogger {
                        id, name, image
                    }
                }
            }
        }
    }`

export const FETCH_VIDEO_RECOMMEND = gql`
    query videoRecommendAdjust($videoId: String!) {
        videoRecommendAdjust(videoId: $videoId) {
            id, videoId, playCount, shareCount, likeCount, attenuation, weight, video {
                id, title, cover_path
            }
        }
    }`

export const CREATE_VIDEO_RECOMMEND = gql`
    mutation create($video: CreateVideoInput!){
        createVideoRecommendAdjust(video: $video) {
            id
        }
    }`

export const UPDATE_VIDEO_RECOMMEND = gql`
    mutation update($videoId: String!, $videoRecommendAdjust: UpdateVideoRecommendAdjustInput!){
        updateVideoRecommendAdjust(videoId: $videoId, videoRecommendAdjust: $videoRecommendAdjust) {
            id
        }
    }`

export const DEL_VIDEO_RECOMMEND = gql`
    mutation del($id: String!){
        deleteVideoRecommendAdjust(id: $id) {
            id
        }
    }`
