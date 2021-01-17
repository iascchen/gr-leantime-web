import React from 'react'
import PropTypes from 'prop-types'
import {HttpLink} from 'apollo-link-http'
import {ApolloClient} from 'apollo-client'
import {InMemoryCache} from 'apollo-cache-inmemory'
import {ApolloProvider} from '@apollo/react-hooks'

import {ACCOUNT_CENTER, HEADER_FOR_AUTH} from '../utils/secrets'
import {getTokens} from '../modules/login/utils/manage-tokens'

const customFetch = (uri, options) => {
    const tokens = getTokens()
    if (tokens && tokens.token) {
        // options.headers.Authorization = `Bearer ${tokens.accessToken}`
        options.headers[HEADER_FOR_AUTH] = tokens.token
    }
    return fetch(uri, options)
}
const httpLink = new HttpLink({
    uri: `${ACCOUNT_CENTER}/admin`,
    fetch: customFetch
})
const defaultOptions = {
    watchQuery: {
        fetchPolicy: 'no-cache',
        errorPolicy: 'ignore',
    },
    query: {
        fetchPolicy: 'no-cache',
        errorPolicy: 'all',
    },
}
const client = new ApolloClient({ link: httpLink, cache: new InMemoryCache(), defaultOptions })

const ZdnContainer = ({ children }) => {
    return (
        <ApolloProvider client={client}>
            {children}
        </ApolloProvider>
    )
}

ZdnContainer.propTypes = {
    children: PropTypes.any
}

export default ZdnContainer
