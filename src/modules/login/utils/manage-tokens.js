export const ZDN_COOKIE_USER = 'zdn-user'
export const ZDN_TOKEN_KEY = 'zdnTokens'

// module for saving tokens to local storage
// tokens = { token: "abc", user: "{}" }

export const saveTokens = (tokens) => {
    localStorage.setItem(ZDN_TOKEN_KEY, JSON.stringify(tokens))
}

export const getTokens = () => {
    return JSON.parse(localStorage.getItem(ZDN_TOKEN_KEY))
}

export const deleteTokens = () => {
    localStorage.removeItem(ZDN_TOKEN_KEY)
}
