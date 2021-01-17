import gql from 'graphql-tag'

export const FETCH_PLAYLIST = gql`
    query fetchPlaylist($id: String) {
        playlists(id: $id) {
            entities {
                id, title, desc, cover, status, completed, continuePoster, tags, keywords, blogger{
                    id, name, image
                }, videoIds, videos{
                    id, title, cover_path
                }
            }
        }
    }`

export const CREATE_PLAYLIST = gql`
    mutation create($playlist: CreatePlaylistInput!){
        createPlaylist(playlist: $playlist) {
            id
        }
    }`

export const UPDATE_PLAYLIST = gql`
    mutation update($id: String!, $playlist: UpdatePlaylistInput!){
        updatePlaylist(id: $id, playlist: $playlist) {
            id
        }
    }`

export const FETCH_PLAYLISTS = gql`
    query fetchPlaylists($offset: Int!, $limit: Int!, $searchWords: String, $status: Int, $onlyUncompleted: Int) {
        playlists(offset: $offset, limit: $limit, searchWords: $searchWords, status: $status, onlyUncompleted: $onlyUncompleted) {
            total, entities {
                id, title, cover, status, completed, tags, keywords, blogger{
                    id, name, image
                }, videos{
                    id, title, cover_path
                }
            }
        }
    }`

export const DEL_PLAYLIST = gql`
    mutation del($id: String!){
        deletePlaylist(id: $id) {
            id
        }
    }`
