export const ENVIRONMENT = process.env.NODE_ENV

export const SERVER_BASE = process.env.REACT_APP_SERVER_BASE

// for login
export const ACCOUNT_CENTER = SERVER_BASE
export const HEADER_FOR_AUTH = process.env.REACT_APP_HEADER_FOR_AUTH || 'token'
export const PASSWORD_RESET_TOKEN_LEN = process.env.REACT_APP_PASSWORD_RESET_TOKEN_LEN || 6
export const INVITE_TOKEN_TTL = process.env.REACT_APP_INVITE_TOKEN_TTL || 60

if (!SERVER_BASE) {
    console.error('No ZDN server uri. Set REACT_APP_ZDN_SERVER_BASE environment variable.')
}

export const ALIYUN_OSS_BUCKET = process.env.REACT_APP_ALIYUN_OSS_BUCKET
export const ALIYUN_OSS_ID = process.env.REACT_APP_ALIYUN_OSS_ID
export const ALIYUN_OSS_KEY = process.env.REACT_APP_ALIYUN_OSS_KEY

export const aliyunOss = {
    bucket: ALIYUN_OSS_BUCKET,
    accessKeyId: ALIYUN_OSS_ID,
    secretAccessKey: ALIYUN_OSS_KEY,
}
