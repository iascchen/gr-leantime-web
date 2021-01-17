import gql from 'graphql-tag'

export const FETCH_VIDEO = gql`
    query fetchVideo($id: String) {
        videos(id: $id) {
            entities{
                title, descs, cover_path, play_location, status, coverConfirm, seconds, height, width, tags, keywords, videoId, b_id, blogger{
                    id, name, image
                }
            }
        }
    }`

export const CREATE_VIDEO = gql`
    mutation create($video: CreateVideoInput!){
        createVideo(video: $video) {
            id
        }
    }`

export const UPDATE_VIDEO = gql`
    mutation update($id: String!, $video: UpdateVideoInput!){
        updateVideo(id: $id, video: $video) {
            id
        }
    }`

export const FETCH_VIDEOS = gql`
    query fetchVideos($offset: Int!, $limit: Int!, $searchWords: String, $onlyUnconfirmed: Int, $onlyConfirmed: Int) {
        videos(offset: $offset, limit: $limit, searchWords: $searchWords, onlyUnconfirmed: $onlyUnconfirmed, onlyConfirmed: $onlyConfirmed) {
            total, entities {
                id, title, descs, cover_path, play_location, status, coverConfirm, seconds, height, width, tags, keywords, videoId, blogger{
                    id, name, image
                }, labels {
                    targets {
                        target, labelLevel1, labelLevel2, labelLevel3, labelLevel4
                    }
                }
            }
        }
    }`

export const DEL_VIDEO = gql`
    mutation del($id: String!){
        deleteVideo(id: $id) {
            id
        }
    }`

export const FETCH_VIDEO_INFO = gql`
    query vodGetPlayInfo($VideoId: String!){
        vodGetPlayInfo(VideoId: $VideoId) {
            PlayInfo {
                PlayURL,Duration,Width,Height
            }
            VideoBase {
                Title,CoverURL
            }
        }
    }`

export const EXE_TRANSCODE = gql`
    query vodSubmitTranscodeJobs($VideoId: String!){
        vodSubmitTranscodeJobs(VideoId: $VideoId) {
            JobId
        }
    }`

export const EXE_SNAPSHOT = gql`
    query vodSubmitSnapshotJob($VideoId: String!){
        vodSubmitSnapshotJob(VideoId: $VideoId) {
            JobId
        }
    }`

export const VOD_CREATE_UPLOAD_VIDEO = gql`
    query vodCreateUploadVideo($FileName: String!, $Title: String, $CoverURL: String, $Tags: String, $Description: String){
        vodCreateUploadVideo(FileName: $FileName, Title: $Title, CoverURL: $CoverURL, Tags: $Tags, Description: $Description) {
            RequestId, VideoId, UploadAddress, UploadAuth
        }
    }`

export const VOD_REFRESH_UPLOAD_VIDEO = gql`
    query vodRefreshUploadVideo($VideoId: String!){
        vodRefreshUploadVideo(VideoId: $VideoId) {
            RequestId, VideoId, UploadAddress, UploadAuth
        }
    }`

export const FETCH_VIDEO_LABELS = gql`
    query videoLabels($videoId: String!) {
        videoLabels(videoId: $videoId) {
            video {
                id, title, cover_path, play_location, videoId
            }, targets {
                target, labels
            }
        }
    }`

export const UPDATE_VIDEO_LABEL = gql`
    mutation updateVideoLabel($videoId: String!, $target: String, $label: UpdateVideoLabelInput!){
        updateVideoLabel(videoId: $videoId, target: $target, label: $label) {
            id
        }
    }`
