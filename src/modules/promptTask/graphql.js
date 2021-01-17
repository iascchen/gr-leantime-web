import gql from 'graphql-tag'

export const FETCH_PROMPT_TASK = gql`
    query fetchPromptTask($id: String) {
        promptTasks(id: $id) {
            entities{
                id, adminId, promptObject, videoId, playlistId, prompterId, promptAt, targetType, groupCount, peopleCount, 
                promptTool, promptType, desc, video {
                    id, title, cover_path
                }, playlist {
                    id, title, cover
                }, prompter {
                    id, name, image
                } 
            }
        }
    }`

export const FETCH_PROMPT_TASKS = gql`
    query fetchPromptTasks($offset: Int!, $limit: Int!, $keywords: String, $dateRange: [Date!]) {
        promptTasks(offset: $offset, limit: $limit, keywords: $keywords, dateRange: $dateRange, isMine: 1) {
            total, entities{
                id, adminId, promptObject, videoId, playlistId, prompterId, promptAt, targetType, groupCount, peopleCount, 
                promptTool, promptType, desc, video {
                    id, title, cover_path
                }, playlist {
                    id, title, cover
                }, prompter {
                    id, name, image
                } 
            }
        }
    }`

export const CREATE_PROMPT_TASK = gql`
    mutation create($promptTask: CreatePromptTaskInput!){
        createPromptTask(promptTask: $promptTask) {
            id
        }
    }`

export const UPDATE_PROMPT_TASK = gql`
    mutation update($id: String!, $promptTask: UpdatePromptTaskInput!){
        updatePromptTask(id: $id, promptTask: $promptTask) {
            id
        }
    }`

export const DEL_PROMPT_TASK = gql`
    mutation del($id: String!){
        deletePromptTask(id: $id) {
            id
        }
    }`
