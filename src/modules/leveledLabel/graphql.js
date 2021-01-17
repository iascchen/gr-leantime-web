import gql from 'graphql-tag'

export const FETCH_LABELS = gql`
    query fetchLabels($offset: Int!, $limit: Int!, $keywords: String) {
        labels(offset: $offset, limit: $limit, keywords: $keywords) {
            total, entities{
                id, name, level, parentIds, path, target, children {
                    id, name, level, parentIds, path, target, children {
                        id, name, level, parentIds, path, target, children {
                            id, name, level, parentIds, path, target, children {
                                id
                            }
                        }
                    }
                }
            }
        }
    }`

export const FETCH_LABELS_JSON = gql`
    query fetchLabelsJson($limit: Int!) {
        labelsJson(limit: $limit) {
            total, entities{
                id, name, level, parentIds, path, target, children {
                    id, name, level, parentIds, path, target, children {
                        id, name, level, parentIds, path, target, children {
                            id, name, level, parentIds, path, target
                        }
                    }
                }
            }
        }
    }`

export const FETCH_LABEL = gql`
    query fetchLabel($id: String!) {
        label(id: $id) {
            id, name, level, parentIds, path, target
        }
    }`

export const DEL_LABEL = gql`
    mutation del($id: String!){
        deleteLabel(id: $id) {
            id
        }
    }`

export const CREATE_LABEL = gql`
    mutation create($label: CreateLabelInput!){
        createLabel(label: $label) {
            id
        }
    }`

export const UPDATE_LABEL = gql`
    mutation update($id: String!, $label: UpdateLabelInput!){
        updateLabel(id: $id, label: $label) {
            id
        }
    }`
