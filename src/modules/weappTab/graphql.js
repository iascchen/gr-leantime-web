import gql from 'graphql-tag'

export const FETCH_WEAPPTAB = gql`
    query fetchWeappTab($id: String!) {
        weappTab(id: $id) {
            id, label_name, label_order, english, is_show, type, parentid
        }
    }`

export const FETCH_WEAPPTABS = gql`
    query fetchWeappTabs($offset: Int!, $limit: Int!, $keywords: String) {
        weappTabs(offset: $offset, limit: $limit, keywords: $keywords) {
            total, entities{
                id, label_name, label_order, english, is_show, type, parentid, children {
                    id, label_name, label_order, english, is_show, type, parentid, children {
                        id
                    }, labels {
                        labelLevel1, labelLevel2, labelLevel3
                    }
                }, labels {
                    labelLevel1, labelLevel2, labelLevel3
                }
            }
        }
    }`

export const CREATE_WEAPPTAB = gql`
    mutation create($weappTab: CreateWeappTabInput!){
        createWeappTab(weappTab: $weappTab) {
            id
        }
    }`

export const UPDATE_WEAPPTAB = gql`
    mutation update($id: String!, $weappTab: UpdateWeappTabInput!){
        updateWeappTab(id: $id, weappTab: $weappTab) {
            id
        }
    }`

export const DEL_WEAPPTAB = gql`
    mutation del($id: String!){
        deleteWeappTab(id: $id) {
            id
        }
    }`

export const FETCH_WEAPPTAB_LABELS = gql`
    query weappTabLabels($tabId: String!) {
        weappTabLabels(tabId: $tabId) {
            tabId, labels
        }
    }`

export const UPDATE_WEAPPTAB_LABEL = gql`
    mutation updateWeappTabLabel($tabId: String!, $label: UpdateWeappTabLabelInput!){
        updateWeappTabLabel(tabId: $tabId, label: $label) {
            id
        }
    }`
